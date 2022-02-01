import {
  FETCH_BALANCE,
  FETCH_NOTIFICATION,
  PROFILE_PIC,
  IS_SIGNED_IN,
  SHOW_SPLASH_SCREEN
} from "./actions";

const initialState = {
  balance: {},
  notification: {},
  pic: null,
  loginStatus: false,
  showSplash:true
};

function reducers(state = initialState, action) {
  switch (action.type) {
    case FETCH_BALANCE:
      return { ...state, balance: action.payload };
    case FETCH_NOTIFICATION:
      return { ...state, notification: action.payload };
    case PROFILE_PIC:
      return { ...state, pic: action.payload };

    case IS_SIGNED_IN:
      return { ...state, loginStatus: action.payload };

      case SHOW_SPLASH_SCREEN:
      return { ...state, showSplash: action.payload };

    default:
      return state;
  }
}

export default reducers;
