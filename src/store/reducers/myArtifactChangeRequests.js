import * as actionTypes from '../actions/actionsTypes';

const initalState = {
    myArtifactChangeRequests: [],
    loading: true,
    error: null,
    selectedMyArtifactChangeRequest: null,
    isMyArtifactChangeRequestExist: false
}

const myArtifactChangeRequestsStart = (state, action) => {
    return { ...state, ...{  error: null, isMyArtifactChangeRequestExist: false } };
}

const myArtifactChangeRequestsSuccess = (state, action) => {
    console.log(action);
    return { ...state, ...{  error: null, myArtifactChangeRequests: [ ...action.artifactChangeRequests ]} };
}

const myArtifactChangeRequestsFail = (state, action) => {
    return { ...state, ...{ error: action.error} };
}

const createArtifactChangeRequesttart = (state, action) => {
    return { ...state, ...{  isMyArtifactChangeRequestExist: false, loading: true } };
}

const createArtifactChangeRequestuccess = (state, action) => {
    return { ...state, ...{  isMyArtifactChangeRequestExist: false, loading: false } };
}

const createArtifactChangeRequestFail = (state, action) => {
    return { ...state, ...{  isMyArtifactChangeRequestExist: true, loading: false } };
}


const myArtifactChangeRequestsReducer = (state = initalState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_MY_ARTIFACTS_CHANGE_REQUESTS_START: return myArtifactChangeRequestsStart(state, action);
        case actionTypes.FETCH_MY_ARTIFACTS_CHANGE_REQUESTS_SUCCESS: return myArtifactChangeRequestsSuccess(state, action);
        case actionTypes.FETCH_MY_ARTIFACTS_CHANGE_REQUESTS_FAIL: return myArtifactChangeRequestsFail(state, action);
        case actionTypes.CREATE_ARTIFACT_CHANGE_REQUEST_START: return createArtifactChangeRequesttart(state, action);
        case actionTypes.CREATE_ARTIFACT_CHANGE_REQUEST_SUCCESS: return createArtifactChangeRequestuccess(state, action);
        case actionTypes.CREATE_ARTIFACT_CHANGE_REQUEST_FAIL: return createArtifactChangeRequestFail(state, action);
        default: return state;
    }
}

export default myArtifactChangeRequestsReducer;