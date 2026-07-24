'use server';

const endpoint = 'https://admin.dffotoshop.com.ng/wp/graphql';

export async function processCheckout(
  contact: any,
  shipping: any,
  billing: any,
  customerNote: string,
  shippingMethod: string,
  lineItems: { productId: number; quantity: number }[]
) {
  if (!lineItems || lineItems.length === 0) {
    return { success: false, message: 'Your cart is empty.' };
  }

  try {
    let sessionHeader = '';

    // Step 1: Build the session by adding items to the server-side cart
    for (let i = 0; i < lineItems.length; i++) {
      const item = lineItems[i];
      
      const query = `
        mutation AddToCart($productId: Int!, $quantity: Int!) {
          addToCart(input: { productId: $productId, quantity: $quantity }) {
            cartItem { key }
          }
        }
      `;

      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (sessionHeader) {
        headers['woocommerce-session'] = sessionHeader.startsWith('Session ') ? sessionHeader : `Session ${sessionHeader}`;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query,
          variables: { productId: item.productId, quantity: item.quantity }
        }),
        cache: 'no-store' // CRITICAL: Disable Next.js caching to ensure session headers are returned
      });

      const json = await res.json();
      
      if (json.errors) {
        console.error("AddToCart Error:", json.errors);
        return { success: false, message: json.errors[0]?.message || 'Failed to add items to server cart' };
      }

      if (i === 0) {
        const returnedSession = res.headers.get('woocommerce-session');
        if (returnedSession) {
          sessionHeader = returnedSession;
        }
      }
    }

    if (!sessionHeader) {
      return { success: false, message: 'Failed to securely connect to the storefront (no session generated).' };
    }

    // Step 2: Execute Checkout with the session
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

    const finalBilling = { ...billing, email: contact.email };
    const finalShipping = { ...shipping, email: contact.email };
    const shippingMethodArray = shippingMethod ? [shippingMethod] : undefined;

    const checkoutRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'woocommerce-session': sessionHeader.startsWith('Session ') ? sessionHeader : `Session ${sessionHeader}`
      },
      body: JSON.stringify({
        query: checkoutQuery,
        variables: {
          billing: finalBilling,
          shipping: finalShipping,
          paymentMethod: 'paystack',
          customerNote: customerNote || '',
          shippingMethod: shippingMethodArray
        }
      }),
      cache: 'no-store'
    });

    const checkoutJson = await checkoutRes.json();

    if (checkoutJson.errors) {
      console.error("Checkout Error:", checkoutJson.errors);
      return { success: false, message: checkoutJson.errors[0]?.message || 'Checkout failed on the server' };
    }

    const checkoutResult = checkoutJson.data?.checkout;

    if (checkoutResult?.result === 'SUCCESS' && checkoutResult?.redirect) {
      return { success: true, redirectUrl: checkoutResult.redirect };
    }

    return { success: false, message: 'Checkout failed. Please try again.' };

  } catch (error) {
    console.error('Checkout action error:', error);
    return { success: false, message: 'An unexpected error occurred during checkout.' };
  }
}
