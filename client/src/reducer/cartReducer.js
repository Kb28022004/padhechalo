const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEMS_TO_CART":
    case "UPDATE_ITEMS_TO_CART":
    case "REMOVE_ITEMS_TO_CART":
      return {
        ...state,
        cartItems: action.payload,
      };

    case "SHIPPING_ITEMS_INFO":
      return {
        ...state,
        shippingInfo: action.payload,
      };

    default:
      return state;
  }
};

export default cartReducer;
