import * as actionTypes from '../actions/actionsTypes';

const initalState = {
    traceabilityLinkChangeRequests: [],
    selectedaTraceabilityLinkChangeRequest: null,
    loading: true,
    error: null
}

const traceabilityLinkChangeRequestsStart = (state, action) => {
    return { ...state, ...{  error: null } };
}

const traceabilityLinkChangeRequestsSuccess = (state, action) => {
    return { ...state, ...{  error: null, traceabilityLinkChangeRequests: [ ...action.traceabilityLinkChangeRequests ]} };
}

const traceabilityLinkChangeRequestsFail = (state, action) => {
    return { ...state};
}


const traceabilityLinkChangeRequestsReducer = (state = initalState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_TRACEABILITY_LINKS_CHANGE_REQUESTS_START: return traceabilityLinkChangeRequestsStart(state, action);
        case actionTypes.FETCH_TRACEABILITY_LINKS_CHANGE_REQUESTS_SUCCESS: return traceabilityLinkChangeRequestsSuccess(state, action);
        case actionTypes.FETCH_TRACEABILITY_LINKS_CHANGE_REQUESTS_FAIL: return traceabilityLinkChangeRequestsFail(state, action);
        default: return state;
    }
}

export default traceabilityLinkChangeRequestsReducer;