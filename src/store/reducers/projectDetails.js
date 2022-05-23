import * as actionTypes from '../actions/actionsTypes';

const initalState = {
    projectDetails: {},
    loading: false,
    error: null,
    selectedProject: null,
}

const projectDetailsStart = (state, action) => {
    return { ...state, ...{ loading: true, error: null } };
}

const projectDetailsSuccess = (state, action) => {
    console.log(action.projectDetails);
    return { ...state, ...{ loading: false, error: null, projectDetails: { ...action.projectDetails } } };
}

const projectDetailsFail = (state, action) => {
    return { ...state, ...{ error: action.error, loading: false} };
}

const projectsReducer = (state = initalState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_PROJECT_DETAILS_START: return projectDetailsStart(state, action);
        case actionTypes.FETCH_PROJECT_DETAILS_SUCCESS: return projectDetailsSuccess(state, action);
        case actionTypes.FETCH_PROJECT_DETAILS_FAIL: return projectDetailsFail(state, action);
        default: return state;
    }
}

export default projectsReducer;