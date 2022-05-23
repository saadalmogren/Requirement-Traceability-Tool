import * as actionTypes from '../actions/actionsTypes';

const initalState = {
    artifacts: [],
    loading: true,
    error: null,
    selectedArtifact: null,
    isArtifactExist: false
}

const artifactsStart = (state, action) => {
    return { ...state, ...{  error: null, isArtifactExist: false } };
}

const artifactsSuccess = (state, action) => {
    return { ...state, ...{  error: null, artifacts: [ ...action.artifacts ]} };
}

const artifactsFail = (state, action) => {
    return { ...state, ...{ error: action.error} };
}

const createArtifactStart = (state, action) => {
    return { ...state, ...{  isArtifactExist: false, loading: true } };
}

const createArtifactSuccess = (state, action) => {
    return { ...state, ...{  isArtifactExist: false, loading: false } };
}

const createArtifactFail = (state, action) => {
    return { ...state, ...{  isArtifactExist: true, loading: false } };
}


const artifactsReducer = (state = initalState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_ARTIFACTS_START: return artifactsStart(state, action);
        case actionTypes.FETCH_ARTIFACTS_SUCCESS: return artifactsSuccess(state, action);
        case actionTypes.FETCH_ARTIFACTS_FAIL: return artifactsFail(state, action);
        case actionTypes.CREATE_ARTIFACT_START: return createArtifactStart(state, action);
        case actionTypes.CREATE_ARTIFACT_SUCCESS: return createArtifactSuccess(state, action);
        case actionTypes.CREATE_ARTIFACT_FAIL: return createArtifactFail(state, action);
        default: return state;
    }
}

export default artifactsReducer;