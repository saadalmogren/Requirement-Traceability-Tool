import * as actionTypes from '../actions/actionsTypes';

const initalState = {
    artifactChangeRequests: [],
    selectedArtifactChangeRequest: null,
    loading: true,
    error: null
}

const artifactChangeRequestsStart = (state, action) => {
    return { ...state, ...{  error: null } };
}

const artifactChangeRequestsSuccess = (state, action) => {
    return { ...state, ...{  error: null, artifactChangeRequests: [ ...action.artifactChangeRequests ]} };
}

const artifactChangeRequestsFail = (state, action) => {
    return { ...state};
}


const artifactChangeRequestsReducer = (state = initalState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_ARTIFACTS_CHANGE_REQUESTS_START: return artifactChangeRequestsStart(state, action);
        case actionTypes.FETCH_ARTIFACTS_CHANGE_REQUESTS_SUCCESS: return artifactChangeRequestsSuccess(state, action);
        case actionTypes.FETCH_ARTIFACTS_CHANGE_REQUESTS_FAIL: return artifactChangeRequestsFail(state, action);
        default: return state;
    }
}

export default artifactChangeRequestsReducer;