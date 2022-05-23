import * as actionTypes from "../actions/actionsTypes";

const initialState = {
  id: "",
  text: "",
  name: "",
  alertType: "",
};

const showAlert = (state, action) => {
  return {
    ...state,
    ...{
      id: action.id,
      text: action.text,
      name: action.name,
      alertType: action.alertType,
    },
  };
};

const hideAlert = (state, action) => {
  return { ...state, ...{ id: action.id, text: "", name: "", alertType: "" } };
};

const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_ALERT:
      return showAlert(state, action);
    case actionTypes.HIDE_ALERT:
      return hideAlert(state, action);
    default:
      return state;
  }
};

export default alertReducer;
