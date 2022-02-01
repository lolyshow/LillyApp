import Helper from "../Helpers/Helper";

// Define action types
export const FETCH_BALANCE = "FETCH_BALANCE";
export const FETCH_NOTIFICATION = "FETCH_NOTIFICATION";
export const PROFILE_PIC = "PROFILE_PIC";
export const IS_SIGNED_IN = "IS_SIGNED_IN";
export const SHOW_SPLASH_SCREEN = "SHOW_SPLASH_SCREEN";

export const setProfilePicture = (pic) => {
  try {
    return async (dispatch) => {
      dispatch({
        type: PROFILE_PIC,
        payload: pic,
      });
    };
  } catch (error) {
    // Add custom logic to handle errors
  }
};

export const isSignedIn = (status) => {
  try {
    return async (dispatch) => {
      dispatch({
        type: IS_SIGNED_IN,
        payload: status,
      });
    };
  } catch (error) {
    // Add custom logic to handle errors
  }
};

export const showSplashScreen = (status) => {
  try {
    return async (dispatch) => {
      dispatch({
        type: SHOW_SPLASH_SCREEN,
        payload: status,
      });
    };
  } catch (error) {
    // Add custom logic to handle errors
  }
};

export const getBalance = (walletDetail = null) => {
  try {
    return async (dispatch) => {
      if (walletDetail) {
        dispatch({
          type: FETCH_BALANCE,
          payload: walletDetail,
        });
      } else {
        let { wallet, error, message } = await Helper.getBalance();

        if (error == false) {
          dispatch({
            type: FETCH_BALANCE,
            payload: wallet,
          });
        } else {
          console.log(message);
        }
      }
    };
  } catch (error) {
    // Add custom logic to handle errors
  }
};

export const getNotifications = () => {
  try {
    return async (dispatch) => {
      let { notification, error, message } = await Helper.getNotifications();

      if (error == false) {
        dispatch({
          type: FETCH_NOTIFICATION,
          payload: notification,
        });
      } else {
        console.log(message);
      }
    };
  } catch (error) {
    // Add custom logic to handle errors
  }
};
