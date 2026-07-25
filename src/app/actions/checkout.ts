'use server';

const endpoint = 'https://admin.dffotoshop.com.ng/graphql';

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
    cache: 'no-store', // CRITICAL: Disable caching for dynamic cart operations
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

    // Step 1: If we already have a session, empty the server cart first so we don't duplicate items
    if (currentSession) {
      const emptyMutation = `mutation EmptyCart { emptyCart(input: {clearPersistentCart: false}) { clientMutationId } }`;
      await fetchGraphQL(emptyMutation, {}, currentSession);
    }

    // Step 2: Add all Zustand cart items to the WooCommerce server cart
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

      // Capture the session token on the first item added
      if (!currentSession && result.newSessionToken) {
        currentSession = result.newSessionToken;
      }
    }

    if (!currentSession) {
      throw new Error('Could not establish a secure session with the store.');
    }

    // Step 3: Update the customer's shipping address to calculate correct zones
    const updateCustomerMutation = `
      mutation UpdateCustomer($shipping: CustomerAddressInput) {
        updateCustomer(input: { shipping: $shipping }) {
          customer { id }
        }
      }
    `;
    await fetchGraphQL(updateCustomerMutation, { shipping: { country, state } }, currentSession);

    // Step 4: Fetch the dynamically calculated shipping methods
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

    let shippingMethods = [];
    const packages = cartResult.data?.cart?.availableShippingMethods || [];

    // WooCommerce groups shipping by packages. Usually, everything is in package [0].
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
  // If the user tries to checkout without a session, the cart was never synced.
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
        }
      }
    `;

    // Ensure email is passed into the billing and shipping objects for WooCommerce
    const finalBilling = { ...billing, email: contact.email };
    const finalShipping = { ...shipping, email: contact.email };
    const shippingMethodArray = shippingMethod ? [shippingMethod] : undefined;

    const result = await fetchGraphQL(checkoutQuery, {
      billing: finalBilling,
      shipping: finalShipping,
      paymentMethod: 'paystack', // This MUST match the ID of your Paystack plugin in WooCommerce
      customerNote: customerNote || '',
      shippingMethod: shippingMethodArray
    }, sessionToken);

    if (result.errors) {
      console.error("Checkout Error:", result.errors);
      return { success: false, message: result.errors[0]?.message || 'Checkout failed on the server.' };
    }

    const checkoutResult = result.data?.checkout;

    // A successful Paystack/WooCommerce headless checkout returns 'SUCCESS' and a redirect URL
    if (checkoutResult?.result === 'SUCCESS' && checkoutResult?.redirect) {
      return { success: true, redirectUrl: checkoutResult.redirect };
    }

    return { success: false, message: 'Checkout processed, but no payment link was returned.' };

  } catch (error) {
    console.error('Checkout action error:', error);
    return { success: false, message: 'An unexpected network error occurred during checkout.' };
  }
}