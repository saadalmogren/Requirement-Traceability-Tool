import * as actionTypes from '../actions/actionsTypes';

const initalState = {
    rolePrivileges: [],
    loading: true,
    error: null,
}

const rolePrivilegesStart = (state, action) => {
    return { ...state, ...{  error: null } };
}

const rolePrivilegesSuccess = (state, action) => {
    return { ...state, ...{  error: null, rolePrivileges: [ ...action.rolePrivileges ]} };
}

const rolePrivilegesFail = (state, action) => {
    return { ...state, ...{ error: action.error} };
}


const modifyRoleReducer = (state = initalState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_ROLE_PRIVILEGES_START: return rolePrivilegesStart(state, action);
        case actionTypes.FETCH_ROLE_PRIVILEGES_SUCCESS: return rolePrivilegesSuccess(state, action);
        case actionTypes.FETCH_ROLE_PRIVILEGES_FAIL: return rolePrivilegesFail(state, action);

        default: return state;
    }
}

export default modifyRoleReducer;