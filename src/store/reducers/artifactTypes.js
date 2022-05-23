import * as actionTypes from '../actions/actionsTypes';

const initalState = {
    artifactTypes: [],
    loading: true,
    error: null,
    selectedArtifactType: null,
    isArtifactTypeExist: false
}

const artifactTypesStart = (state, action) => {
    return { ...state, ...{  error: null, isArtifactTypeExist: false } };
}

const artifactTypesSuccess = (state, action) => {
    return { ...state, ...{  error: null, artifactTypes: [ ...action.artifactTypes ]} };
}

const artifactTypesFail = (state, action) => {
    return { ...state, ...{ error: action.error} };
}

const createArtifactTypeStart = (state, action) => {
    return { ...state, ...{  isArtifactTypeExist: false, loading: true } };
}

const createArtifactTypeSuccess = (state, action) => {
    return { ...state, ...{  isArtifactTypeExist: false, loading: false } };
}

const createArtifactTypeFail = (state, action) => {
    return { ...state, ...{  isArtifactTypeExist: true, loading: false } };
}


const ArtifactTypesReducer = (state = initalState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_ARTIFACT_TYPES_START: return artifactTypesStart(state, action);
        case actionTypes.FETCH_ARTIFACT_TYPES_SUCCESS: return artifactTypesSuccess(state, action);
        case actionTypes.FETCH_ARTIFACT_TYPES_FAIL: return artifactTypesFail(state, action);
        case actionTypes.CREATE_ARTIFACT_TYPE_START: return createArtifactTypeStart(state, action);
        case actionTypes.CREATE_ARTIFACT_TYPE_SUCCESS: return createArtifactTypeSuccess(state, action);
        case actionTypes.CREATE_ARTIFACT_TYPE_FAIL: return createArtifactTypeFail(state, action);
        default: return state;
    }
}

export default ArtifactTypesReducer;