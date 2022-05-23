import * as actionTypes from './actionsTypes';
import axios from 'axios';

export const fetchTraceabilityLinkChangeRequestsStart = () => {
    return {
        type: actionTypes.FETCH_TRACEABILITY_LINKS_CHANGE_REQUESTS_START
    }
}

export const fetchTraceabilityLinkChangeRequestsSuccess = (traceabilityLinkChangeRequests) => {
    return {
        type: actionTypes.FETCH_TRACEABILITY_LINKS_CHANGE_REQUESTS_SUCCESS,
        traceabilityLinkChangeRequests: traceabilityLinkChangeRequests
    }
}

export const fetchTraceabilityLinkChangeRequestsFail = (error) => {
    return{
        type: actionTypes.FETCH_TRACEABILITY_LINKS_CHANGE_REQUESTS_FAIL,
        error: error
    }
}

export const fetchTraceabilityLinkChangeRequests = (projectID, token) => {
    return dispatch => {
        dispatch(fetchTraceabilityLinkChangeRequestsStart());

        axios.get(`/project/traceability_link_change_requests?pID=${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            let fechedTraceabilityLinkChangeRequests = [...res.data.traceability_link_change_requests];
            console.log(fechedTraceabilityLinkChangeRequests);
            dispatch(fetchTraceabilityLinkChangeRequestsSuccess(fechedTraceabilityLinkChangeRequests));
            
        })
        .catch(err=>{
            console.log(err);
            dispatch(fetchTraceabilityLinkChangeRequestsFail(err));
        });
    }
}

export const acceptTraceabilityLinkChangeRequest = (projectID, rID, token) => {
    
    return dispatch => {
        dispatch(fetchTraceabilityLinkChangeRequestsStart());
        const data= {
            pID: projectID,
            id: rID
        }
        console.log(data);
        axios.post(`/accept_traceability_link_request`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchTraceabilityLinkChangeRequests(projectID,token));
        })
        .catch(err=>{
            console.log(err);
            dispatch(fetchTraceabilityLinkChangeRequestsFail());
        });
    }
}

export const rejectTraceabilityLinkChangeRequest = (projectID, rID, rejectReason, token) => {
    
    return dispatch => {
        dispatch(fetchTraceabilityLinkChangeRequestsStart());
        const data= {
            pID: projectID,
            id: rID,
            reject_reason: rejectReason
        }
        console.log(data);
        axios.post(`/reject_traceability_link_request`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchTraceabilityLinkChangeRequests(projectID,token));
        })
        .catch(err=>{
            console.log(err);
            dispatch(fetchTraceabilityLinkChangeRequestsFail());
        });
    }
}