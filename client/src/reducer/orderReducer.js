const orderReducer = (state, action) => {
  switch (action.type) {
    case "CREATE_ORDER_REQUEST":
    case "MY_ORDERS_REQUEST":
    case "ORDER_DETAILS_REQUEST":
    case "ALL_ADMIN_ORDERS_REQUEST":
    case "UPDATE_ORDER_STATUS_REQUEST":
    case "DELETE_ORDER_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
      };

    case "CREATE_ORDER_SUCCESS":
    case "ORDER_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        order: action.payload.order,
      };

    case "MY_ORDERS_SUCCESS":
    case "ALL_ADMIN_ORDERS_SUCCESS":
      return {
        ...state,
        loading: false,
        orders: action.payload.orders,
      };

    case "UPDATE_ORDER_STATUS_SUCCESS":
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };

    case "DELETE_ORDER_SUCCESS":
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case "CREATE_ORDER_FAIL":
    case "MY_ORDERS_FAIL":
    case "ORDER_DETAILS_FAIL":
    case "ALL_ADMIN_ORDERS_FAIL":
    case "UPDATE_ORDER_STATUS_FAIL":
    case "DELETE_ORDER_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "UPDATE_ORDER_STATUS_RESET":
      return {
        ...state,
        isUpdated: false,
      };

    case "DELETE_ORDER_RESET":
      return {
        ...state,
        isDeleted: false,
      };
    case "CLEAR_ERRORS":
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default orderReducer;
