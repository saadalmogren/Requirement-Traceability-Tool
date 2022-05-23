import * as actionTypes from '../actions/actionsTypes';

const initalState = {
    projectRoles: [],
    privileges: [],
    loading: true,
    error: null,
    selectedRole: null,
    isRoleExist: false
}

const projectRolesStart = (state, action) => {
    return { ...state, ...{  error: null, isRoleExist: false } };
}

const projectRolesSuccess = (state, action) => {
    return { ...state, ...{  error: null, projectRoles: [ ...action.projectRoles ]} };
}

const projectRolesFail = (state, action) => {
    return { ...state, ...{ error: action.error} };
}

const createRoleStart = (state, action) => {
    return { ...state, ...{  isRoleExist: false, loading: true } };
}

const createRoleSuccess = (state, action) => {
    return { ...state, ...{  isRoleExist: false, loading: false } };
}

const createRoleFail = (state, action) => {
    return { ...state, ...{  isRoleExist: true, loading: false } };
}

const privilegesSuccess = (state, action) => {
    return { ...state, ...{  privileges: [...action.privileges] } };
}

const rolesReducer = (state = initalState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_PROJECT_ROLES_START: return projectRolesStart(state, action);
        case actionTypes.FETCH_PROJECT_ROLES_SUCCESS: return projectRolesSuccess(state, action);
        case actionTypes.FETCH_PROJECT_ROLES_FAIL: return projectRolesFail(state, action);
        case actionTypes.CREATE_ROLE_START: return createRoleStart(state, action);
        case actionTypes.CREATE_ROLE_SUCCESS: return createRoleSuccess(state, action);
        case actionTypes.CREATE_ROLE_FAIL: return createRoleFail(state, action);
        case actionTypes.FETCH_PRIVILEGES_SUCCESS: return privilegesSuccess(state, action);
        default: return state;
    }
}

export default rolesReducer;