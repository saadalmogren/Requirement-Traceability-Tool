import * as actionTypes from '../actions/actionsTypes';

const initalState = {
    traceabilityLinks: [],
    loading: true,
    error: null,
    selectedTraceabilityLink: null,
    isTraceabilityLinkExist: false
}

const TraceabilityLinksStart = (state, action) => {
    return { ...state, ...{  error: null, isTraceabilityLinkExist: false } };
}

const TraceabilityLinksSuccess = (state, action) => {
    return { ...state, ...{  error: null, traceabilityLinks: [ ...action.traceabilityLinks ]} };
}

const TraceabilityLinksFail = (state, action) => {
    return { ...state, ...{ error: action.error} };
}

const createTraceabilityLinkStart = (state, action) => {
    return { ...state, ...{  isTraceabilityLinkExist: false, loading: true } };
}

const createTraceabilityLinkSuccess = (state, action) => {
    return { ...state, ...{  isTraceabilityLinkExist: false, loading: false } };
}

const createTraceabilityLinkFail = (state, action) => {
    return { ...state, ...{  isTraceabilityLinkExist: true, loading: false } };
}


const TraceabilityLinksReducer = (state = initalState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_TRACEABILITY_LINKS_START: return TraceabilityLinksStart(state, action);
        case actionTypes.FETCH_TRACEABILITY_LINKS_SUCCESS: return TraceabilityLinksSuccess(state, action);
        case actionTypes.FETCH_TRACEABILITY_LINKS_FAIL: return TraceabilityLinksFail(state, action);
        case actionTypes.CREATE_TRACEABILITY_LINK_START: return createTraceabilityLinkStart(state, action);
        case actionTypes.CREATE_TRACEABILITY_LINK_SUCCESS: return createTraceabilityLinkSuccess(state, action);
        case actionTypes.CREATE_TRACEABILITY_LINK_FAIL: return createTraceabilityLinkFail(state, action);
        default: return state;
    }
}

export default TraceabilityLinksReducer;