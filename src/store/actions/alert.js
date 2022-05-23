import * as actionTypes from "../actions/actionsTypes";

export const showAlert = (id, text, name, alertType) => {
  return {
    type: actionTypes.SHOW_ALERT,
    id,
    text,
    name,
    alertType,
  };
};
export const hideAlert = (id) => {
  return {
    type: actionTypes.HIDE_ALERT,
    id,
  };
};

let nextAlertId = 0;
export function showAlertWithTimeout(text, name, alertType) {
  // Assigning IDs to Alerts lets reducer ignore HIDE_ALERT
  // for the Alert that is not currently visible.
  // Alternatively, we could store the timeout ID and call
  // clearTimeout(), but we’d still want to do it in a single place.
  return function (dispatch) {
    const id = nextAlertId++;
    dispatch(showAlert(id, text, name, alertType));

    setTimeout(() => {
      dispatch(hideAlert(id));
    }, 3500);
  };
}
