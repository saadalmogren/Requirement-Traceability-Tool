import * as actionTypes from '../actions/actionsTypes';

const initalState = {
    userRoles: [],
    userPrivileges: [],
    loading: true,
    error: null,
}

const userRolesStart = (state, action) => {
    return { ...state, ...{  error: null } };
}

const userRolesSuccess = (state, action) => {
    return { ...state, ...{  error: null, userRoles: [ ...action.userRoles ]} };
}

const userRolesFail = (state, action) => {
    return { ...state, ...{ error: action.error} };
}

const userPrivilegesStart = (state, action) => {
    return { ...state, ...{  error: null } };
}

const userPrivilegesSuccess = (state, action) => {
    return { ...state, ...{  error: null, userPrivileges: [ ...action.userPrivileges ]} };
}

const userPrivilegesFail = (state, action) => {
    return { ...state, ...{ error: action.error} };
}

const changeUserRolesReducer = (state = initalState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_USER_ROLES_START: return userRolesStart(state, action);
        case actionTypes.FETCH_USER_ROLES_SUCCESS: return userRolesSuccess(state, action);
        case actionTypes.FETCH_USER_ROLES_FAIL: return userRolesFail(state, action);
        case actionTypes.FETCH_USER_PRIVILEGES_START: return userPrivilegesStart(state, action);
        case actionTypes.FETCH_USER_PRIVILEGES_SUCCESS: return userPrivilegesSuccess(state, action);
        case actionTypes.FETCH_USER_PRIVILEGES_FAIL: return userPrivilegesFail(state, action);
        default: return state;
    }
}

export default changeUserRolesReducer;