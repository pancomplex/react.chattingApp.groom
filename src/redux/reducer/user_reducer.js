import { SET_USER, CLEAR_USER, SET_PHOTO_URL } from "../actions/types";

const initialUserState = {
  currentUser: null,
  isLoading: true,
};

export default function (state = initialUserState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        currentUser: action.payload,
        isLoading: false,
      };
    case CLEAR_USER:
      return { ...state, currentUser: null, isLoading: false };
    case SET_PHOTO_URL:
      return {
        ...state,
        currentUser: { ...state.currentUser, SET_PHOTO_URL: action.payload },
      };
    default:
      return state;
  }
}
