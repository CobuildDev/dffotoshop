'use server';

const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://admin.dffotoshop.com.ng/wp/graphql';

// Helper function to handle GraphQL requests and manage the WooCommerce Session token
async function fetchGraphQL(query: string, variables: any = {}, sessionToken: string | null = null) {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };

  if (sessionToken) {
    headers['woocommerce-session'] = sessionToken.startsWith('Session ') ? sessionToken : `Session ${sessionToken}`;
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const json = await res.json();
  const returnedSession = res.headers.get('woocommerce-session');

  return {
    data: json.data,
    errors: json.errors,
    newSessionToken: returnedSession || sessionToken
  };
}

export async function syncCartAndFetchShipping({
  lineItems,
  country,
  state,
  sessionToken
}: {
  lineItems: { productId: number; quantity: number }[];
  country: string;
  state: string;
  sessionToken: string | null;
}) {
  try {
    let currentSession = sessionToken;

    if (currentSession) {
      const emptyMutation = `mutation EmptyCart { emptyCart(input: {clearPersistentCart: false}) { clientMutationId } }`;
      await fetchGraphQL(emptyMutation, {}, currentSession);
    }

    for (const item of lineItems) {
      const addMutation = `
        mutation AddToCart($productId: Int!, $quantity: Int!) {
          addToCart(input: { productId: $productId, quantity: $quantity }) {
            cartItem { key }
          }
        }
      `;
      const result = await fetchGraphQL(addMutation, { productId: item.productId, quantity: item.quantity }, currentSession);

      if (result.errors) {
        console.error("AddToCart Error:", result.errors);
        throw new Error(result.errors[0]?.message || 'Failed to sync cart with server.');
      }

      if (!currentSession && result.newSessionToken) {
        currentSession = result.newSessionToken;
      }
    }

    if (!currentSession) {
      throw new Error('Could not establish a secure session with the store.');
    }

    const updateCustomerMutation = `
      mutation UpdateCustomer($shipping: CustomerAddressInput) {
        updateCustomer(input: { shipping: $shipping }) {
          customer { id }
        }
      }
    `;
    await fetchGraphQL(updateCustomerMutation, { shipping: { country, state } }, currentSession);

    const cartQuery = `
      query GetCartShipping {
        cart {
          availableShippingMethods {
            rates {
              id
              label
              cost
            }
          }
        }
      }
    `;
    const cartResult = await fetchGraphQL(cartQuery, {}, currentSession);

    let shippingMethods: any = [];
    const packages = cartResult.data?.cart?.availableShippingMethods || [];

    if (packages.length > 0 && packages[0].rates) {
      shippingMethods = packages[0].rates;
    }

    return {
      success: true,
      sessionToken: currentSession,
      shippingMethods
    };

  } catch (error: any) {
    console.error('Cart Sync Error:', error);
    return { success: false, message: error.message || 'Failed to sync cart.' };
  }
}

export async function processCheckout(
  contact: any,
  shipping: any,
  billing: any,
  customerNote: string,
  shippingMethod: string,
  sessionToken: string | null
) {
  if (!sessionToken) {
    return { success: false, message: 'Cart session expired or missing. Please refresh and try again.' };
  }

  try {
    const checkoutQuery = `
      mutation Checkout($billing: CustomerAddressInput, $shipping: CustomerAddressInput, $paymentMethod: String!, $customerNote: String, $shippingMethod: [String]) {
        checkout(input: {
          billing: $billing,
          shipping: $shipping,
          paymentMethod: $paymentMethod,
          customerNote: $customerNote,
          shippingMethod: $shippingMethod
        }) {
          result
          redirect
          order {
            databaseId
            orderKey
          }
        }
      }
    `;

    // HELPER: Strip out empty strings/nulls and enforce Paystack API requirements
    const sanitizeAddress = (addressObj: any, defaultEmail: string, isBilling: boolean = false) => {
      const clean: any = {};
      for (const [key, value] of Object.entries(addressObj || {})) {
        if (value !== null && value !== undefined && value !== '') {
          clean[key] = value;
        }
      }

      // Clean the email to prevent Paystack validation crashes due to hidden spaces
      clean.email = defaultEmail.trim();

      // CRITICAL FIX: Paystack will crash and return 'null' if a phone number is missing.
      if (isBilling && !clean.phone) {
        clean.phone = contact.phone || '08000000000';
      }

      return clean;
    };

    const finalBilling = sanitizeAddress(billing, contact.email, true);
    const finalShipping = sanitizeAddress(shipping, contact.email, false);
    const shippingMethodArray = shippingMethod ? [shippingMethod] : [];

    const result = await fetchGraphQL(checkoutQuery, {
      billing: finalBilling,
      shipping: finalShipping,
      paymentMethod: 'bacs',
      customerNote: customerNote || undefined,
      shippingMethod: shippingMethodArray
    }, sessionToken);

    if (result.errors) {
      console.error("Checkout Error:", result.errors);
      return { success: false, message: result.errors[0]?.message || 'Checkout failed on the server.' };
    }

    const checkoutResult = result.data?.checkout;

    console.log("WOOCOMMERCE RAW RESPONSE:", JSON.stringify(checkoutResult, null, 2));

    if (checkoutResult?.result?.toLowerCase() === 'success') {

      // 1. Primary Redirect: Trust WooCommerce's native redirect now that the order is "Pending"
      if (checkoutResult.redirect) {
        return { success: true, redirectUrl: checkoutResult.redirect };
      }

      // 2. Fallback Redirect: Build it manually with the /wp directory and strict trailing slash
      if (checkoutResult.order?.databaseId && checkoutResult.order?.orderKey) {
        const orderId = checkoutResult.order.databaseId;
        const orderKey = checkoutResult.order.orderKey;

        // CRITICAL: The trailing slash before the ? is required to prevent WP 301 redirects from dropping the key
        const paymentUrl = `https://admin.dffotoshop.com.ng/wp/checkout/order-pay/${orderId}/?pay_for_order=true&key=${orderKey}`;

        return { success: true, redirectUrl: paymentUrl };
      }
    }

    return { success: false, message: 'Checkout processed, but no payment link was returned.' };

  } catch (error) {
    console.error('Checkout action error:', error);
    return { success: false, message: 'An unexpected network error occurred during checkout.' };
  }
}