import { gql } from 'graphql-request';

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    products(first: 20) {
      nodes {
        id
        databaseId
        slug
        name
        description
        image {
          sourceUrl
        }
        galleryImages {
          nodes {
            sourceUrl
          }
        }
        productCategories {
          nodes {
            name
          }
        }
        averageRating
        reviewCount
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($id: ID!) {
    product(id: $id, idType: SLUG) {
      id
      databaseId
      slug
      name
      description
      image {
        sourceUrl
      }
      galleryImages {
        nodes {
          sourceUrl
        }
      }
      productCategories {
        nodes {
          name
        }
      }
      reviewCount
      averageRating
      reviews {
        nodes {
          id
          content
          date
          author {
            node {
              name
            }
          }
        }
      }
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
      }
      ... on VariableProduct {
        price
        regularPrice
        salePrice
      }
    }
  }
`;

export const SUBMIT_REVIEW_MUTATION = gql`
  mutation SubmitReview($commentOn: Int!, $author: String!, $authorEmail: String!, $content: String!, $rating: Int!) {
    writeReview(input: {
      commentOn: $commentOn,
      author: $author,
      authorEmail: $authorEmail,
      content: $content,
      rating: $rating
    }) {
      clientMutationId
    }
  }
`;

export const ADD_TO_CART_MUTATION = gql`
  mutation AddToCart($productId: Int!, $quantity: Int!) {
    addToCart(input: { productId: $productId, quantity: $quantity }) {
      cartItem {
        key
      }
    }
  }
`;

export const CHECKOUT_MUTATION = gql`
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
        id
        orderKey
        orderNumber
        status
      }
    }
  }
`;
