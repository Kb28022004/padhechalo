const authReducer = (state, action) => {
  switch (action.type) {
    case "USER_REGISTER_REQUEST":
    case "USER_LOGIN_REQUEST":
    case "USER_DETAILS_REQUEST":
    case "USER_PROFILE_UPDATE_REQUEST":
    case "GET_ALL_ADMIN_USERS_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "USER_REGISTER_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload,
      };

    case "USER_LOGIN_SUCCESS":
    case "USER_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload,
        isAuthenticated: true,
      };

    case "USER_PROFILE_UPDATE_SUCCESS":
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };

    case "USER_LOGOUT_SUCCESS":
      return {
        ...state,
        loading: false,
        user: null,
        error: null,
        isAuthenticated: false,
      };

    case "GET_ALL_ADMIN_USERS_SUCCESS":
      return {
        ...state,
        loading: false,
        users: action.payload.users,
      
      };

    case "USER_REGISTER_FAIL":
    case "USER_LOGIN_FAIL":
    case "USER_DETAILS_FAIL":
    case "GET_ALL_ADMIN_USERS_FAIL":
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case "USER_PROFILE_UPDATE_FAIL":
    case "USER_LOGOUT_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "USER_PROFILE_UPDATE_RESET": {
      return {
        ...state,
        loading: false,
        isUpdated: false,
      };
    }
    case "CLEAR_ERRORS":
      return { ...state, error: null };

    default:
      return state;
  }
};

export default authReducer;
