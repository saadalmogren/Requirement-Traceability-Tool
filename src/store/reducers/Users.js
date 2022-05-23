import * as actionTypes from "../actions/actionsTypes";

const initalState = {
  projectUsers: [],
  loading: true,
  error: null,
  selectedUser: null,
  isUserExist: false,
};

const projectUsersStart = (state, action) => {
  return { ...state, ...{ error: null, isUserExist: false } };
};

const projectUsersSuccess = (state, action) => {
  console.log(action.projectUsers);
  return {
    ...state,
    ...{ error: null, projectUsers: [...action.projectUsers] },
  };
};

const projectUsersFail = (state, action) => {
  return { ...state, ...{ error: action.error } };
};

const addUserStart = (state, action) => {
  return { ...state, ...{ isUserExist: false, loading: true } };
};

const addUserSuccess = (state, action) => {
  return { ...state, ...{ isUserExist: false, loading: false } };
};

const addUserFail = (state, action) => {
  return { ...state, ...{ isUserExist: true, loading: false } };
};

const projectsReducer = (state = initalState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PROJECT_USERS_START:
      return projectUsersStart(state, action);
    case actionTypes.FETCH_PROJECT_USERS_SUCCESS:
      return projectUsersSuccess(state, action);
    case actionTypes.FETCH_PROJECT_USERS_FAIL:
      return projectUsersFail(state, action);
    case actionTypes.ADD_USER_START:
      return addUserStart(state, action);
    case actionTypes.ADD_USER_SUCCESS:
      return addUserSuccess(state, action);
    case actionTypes.ADD_USER_FAIL:
      return addUserFail(state, action);
    default:
      return state;
  }
};

export default projectsReducer;
