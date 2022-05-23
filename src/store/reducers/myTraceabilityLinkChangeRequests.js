import * as actionTypes from '../actions/actionsTypes';

const initalState = {
    myTraceabilityLinkChangeRequests: [],
    loading: true,
    error: null,
    selectedMyTraceabilityLinkChangeRequest: null,
    isMyTraceabilityLinkChangeRequestExist: false
}

const myTraceabilityLinkChangeRequestsStart = (state, action) => {
    return { ...state, ...{  error: null, isMyTraceabilityLinkChangeRequestExist: false } };
}

const myTraceabilityLinkChangeRequestsSuccess = (state, action) => {
    console.log(action);
    return { ...state, ...{  error: null, myTraceabilityLinkChangeRequests: [ ...action.traceabilityLinkChangeRequests ]} };
}

const myTraceabilityLinkChangeRequestsFail = (state, action) => {
    return { ...state, ...{ error: action.error} };
}

const createTraceabilityLinkChangeRequesttart = (state, action) => {
    return { ...state, ...{  isMyTraceabilityLinkChangeRequestExist: false, loading: true } };
}

const createTraceabilityLinkChangeRequestuccess = (state, action) => {
    return { ...state, ...{  isMyTraceabilityLinkChangeRequestExist: false, loading: false } };
}

const createTraceabilityLinkChangeRequestFail = (state, action) => {
    return { ...state, ...{  isMyTraceabilityLinkChangeRequestExist: true, loading: false } };
}


const myTraceabilityLinkChangeRequestsReducer = (state = initalState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_MY_TRACEABILITY_LINKS_CHANGE_REQUESTS_START: return myTraceabilityLinkChangeRequestsStart(state, action);
        case actionTypes.FETCH_MY_TRACEABILITY_LINKS_CHANGE_REQUESTS_SUCCESS: return myTraceabilityLinkChangeRequestsSuccess(state, action);
        case actionTypes.FETCH_MY_TRACEABILITY_LINKS_CHANGE_REQUESTS_FAIL: return myTraceabilityLinkChangeRequestsFail(state, action);
        case actionTypes.CREATE_TRACEABILITY_LINK_CHANGE_REQUEST_START: return createTraceabilityLinkChangeRequesttart(state, action);
        case actionTypes.CREATE_TRACEABILITY_LINK_CHANGE_REQUEST_SUCCESS: return createTraceabilityLinkChangeRequestuccess(state, action);
        case actionTypes.CREATE_TRACEABILITY_LINK_CHANGE_REQUEST_FAIL: return createTraceabilityLinkChangeRequestFail(state, action);
        default: return state;
    }
}

export default myTraceabilityLinkChangeRequestsReducer;