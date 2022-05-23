import * as actionTypes from '../actions/actionsTypes';

const initalState = {
    traceabilityLinkTypes: [],
    loading: true,
    error: null,
    selectedTraceabilityLinkType: null,
    isTraceabilityLinkTypeExist: false
}

const TraceabilityLinkTypesStart = (state, action) => {
    return { ...state, ...{  error: null, isTraceabilityLinkTypeExist: false } };
}

const TraceabilityLinkTypesSuccess = (state, action) => {
    return { ...state, ...{  error: null, traceabilityLinkTypes: [ ...action.traceabilityLinkTypes ]} };
}

const TraceabilityLinkTypesFail = (state, action) => {
    return { ...state, ...{ error: action.error} };
}

const createTraceabilityLinkTypeStart = (state, action) => {
    return { ...state, ...{  isTraceabilityLinkTypeExist: false, loading: true } };
}

const createTraceabilityLinkTypeSuccess = (state, action) => {
    return { ...state, ...{  isTraceabilityLinkTypeExist: false, loading: false } };
}

const createTraceabilityLinkTypeFail = (state, action) => {
    return { ...state, ...{  isTraceabilityLinkTypeExist: true, loading: false } };
}


const TraceabilityLinkTypesReducer = (state = initalState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_TRACEABILITY_LINK_TYPES_START: return TraceabilityLinkTypesStart(state, action);
        case actionTypes.FETCH_TRACEABILITY_LINK_TYPES_SUCCESS: return TraceabilityLinkTypesSuccess(state, action);
        case actionTypes.FETCH_TRACEABILITY_LINK_TYPES_FAIL: return TraceabilityLinkTypesFail(state, action);
        case actionTypes.CREATE_TRACEABILITY_LINK_TYPE_START: return createTraceabilityLinkTypeStart(state, action);
        case actionTypes.CREATE_TRACEABILITY_LINK_TYPE_SUCCESS: return createTraceabilityLinkTypeSuccess(state, action);
        case actionTypes.CREATE_TRACEABILITY_LINK_TYPE_FAIL: return createTraceabilityLinkTypeFail(state, action);
        default: return state;
    }
}

export default TraceabilityLinkTypesReducer;