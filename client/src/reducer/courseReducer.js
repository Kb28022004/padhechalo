const courseReducer = (state, action) => {
  switch (action.type) {
    case "TRENDING_COURSES_REQUEST":
    case "ALL_COURSES_REQUEST":
    case "COURSE_DETAILS_REQUEST":
    case "ALL_ADMIN_COURSES_REQUEST":
    case "DELETE_COURSES_REQUEST":
    case "ADD_NEW_COURSE_REQUEST":
    case "UPDATE_COURSE_REQUEST":
    case "ADD_NEW_REVIEW_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "TRENDING_COURSES_SUCCESS": {
      return {
        ...state,
        loading: false,
        trendingCourses: action.payload.courses.filter(
          (curElem) => curElem.category === "Sports"
        ),
      };
    }

    case "ALL_COURSES_SUCCESS":
      return {
        ...state,
        loading: false,
        courses: action.payload.courses,
        courseCounts: action.payload.courseCounts,
        resultPerPage: action.payload.resultPerPage,
        currentPage: action.payload.currentPage || 1, // Update current page
      };

    case "ALL_ADMIN_COURSES_SUCCESS":
      return {
        ...state,
        loading: false,
        courses: action.payload,
      };

    case "COURSE_DETAILS_SUCCESS":
    case "ADD_NEW_COURSE_SUCCESS":
      return {
        ...state,
        loading: false,
        course: action.payload.course,
      };

    case "DELETE_COURSES_SUCCESS":
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };

    case "UPDATE_COURSE_SUCCESS":
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };

    case "ADD_NEW_REVIEW_SUCCESS":
      return {
        ...state,
        loading: false,
        success: action.payload,
      };
    case "TRENDING_COURSES_FAIL":
    case "ALL_COURSES_FAIL":
    case "COURSE_DETAILS_FAIL":
    case "ALL_ADMIN_COURSES_FAIL":
    case "DELETE_COURSES_FAIL":
    case "ADD_NEW_COURSE_FAIL":
    case "UPDATE_COURSE_FAIL":
    case "ADD_NEW_REVIEW_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "DELETE_COURSES_RESET":
      return {
        ...state,
        isDeleted: false,
      };

    case "UPDATE_COURSE_RESET":
      return {
        ...state,
        isUpdated: false,
      };
    case "ADD_NEW_REVIEW_RESET":
      return {
        ...state,
        success: false,
      };
    case "CLEAR_ERRORS": {
      return { ...state, error: null };
    }

    default:
      return state;
  }
};

export default courseReducer;
