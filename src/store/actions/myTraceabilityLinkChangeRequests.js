import * as actionTypes from './actionsTypes';
import axios from 'axios';

export const fetchMyTraceabilityLinkChangeRequestsStart = () => {
    return {
        type: actionTypes.FETCH_MY_TRACEABILITY_LINKS_CHANGE_REQUESTS_START
    }
}

export const fetchMyTraceabilityLinkChangeRequestsSuccess = (traceabilityLinkChangeRequests) => {
    
    return {
        type: actionTypes.FETCH_MY_TRACEABILITY_LINKS_CHANGE_REQUESTS_SUCCESS,
        traceabilityLinkChangeRequests: traceabilityLinkChangeRequests
    }
}

export const fetchMyTraceabilityLinkChangeRequestsFail = (error) => {
    return{
        type: actionTypes.FETCH_MY_TRACEABILITY_LINKS_CHANGE_REQUESTS_FAIL,
        error: error
    }
}

export const fetchMyTraceabilityLinkChangeRequests = (projectID, token) => {
    return dispatch => {
        dispatch(fetchMyTraceabilityLinkChangeRequestsStart());

        axios.get(`/project/traceability_link_sent_change_requests?pID=${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            let fechedTraceabilityLinkChangeRequests = [...res.data.traceability_link_sent_change_requests];
            console.log(fechedTraceabilityLinkChangeRequests);
            dispatch(fetchMyTraceabilityLinkChangeRequestsSuccess(fechedTraceabilityLinkChangeRequests));
            
        })
        .catch(err=>{
            console.log(err);
            dispatch(fetchMyTraceabilityLinkChangeRequestsFail(err));
        });
    }
}

export const createTraceabilityLinkChangeRequeststart = () => {
    return {
        type: actionTypes.CREATE_TRACEABILITY_LINK_CHANGE_REQUEST_START
    }
}

export const createTraceabilityLinkChangeRequestsuccess = () => {
    return {
        type: actionTypes.CREATE_TRACEABILITY_LINK_CHANGE_REQUEST_SUCCESS
    }
}

export const createTraceabilityLinkChangeRequestFail = () => {
    return{
        type: actionTypes.CREATE_TRACEABILITY_LINK_CHANGE_REQUEST_FAIL
    }
}

export const createCreationTraceabilityLinkChangeRequest = (title, description, requestType, projectID,traceabilityLinkName,traceabilityLinkDescription,traceabilityLinkType,username, firstArtifact, secondArtifact, token) => {
    
    return dispatch => {
        dispatch(fetchMyTraceabilityLinkChangeRequestsStart());
        dispatch(createTraceabilityLinkChangeRequeststart());
        const data= {
            title: title,
            description: description,
            request_type: requestType,
            pID: projectID,
            tName: traceabilityLinkName,
            tDescription: traceabilityLinkDescription,
            tType: traceabilityLinkType,
            username: username,
            artifact1: firstArtifact,
            artifact2: secondArtifact
        }
        console.log(data);
        axios.post(`/traceability_link_creation_request`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchMyTraceabilityLinkChangeRequests(projectID,token));
            dispatch(createTraceabilityLinkChangeRequestsuccess());
        })
        .catch(err=>{
            dispatch(createTraceabilityLinkChangeRequestFail());
        });
    }
}

export const createModificationTraceabilityLinkChangeRequest = (title, description, requestType, projectID, traceabilityLinkID, traceabilityLinkName,traceabilityLinkDescription,traceabilityLinkType,username, firstArtifact, secondArtifact, token) => {
    
    return dispatch => {
        dispatch(fetchMyTraceabilityLinkChangeRequestsStart());
        dispatch(createTraceabilityLinkChangeRequeststart());
        const data= {
            title: title,
            description: description,
            request_type: requestType,
            pID: projectID,
            tID: traceabilityLinkID,
            tName: traceabilityLinkName,
            tDescription: traceabilityLinkDescription,
            tType: traceabilityLinkType,
            username: username,
            artifact1: firstArtifact,
            artifact2: secondArtifact
        }
        console.log(data);
        axios.post(`/traceability_link_modification_request`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchMyTraceabilityLinkChangeRequests(projectID,token));
            dispatch(createTraceabilityLinkChangeRequestsuccess());
        })
        .catch(err=>{
            dispatch(createTraceabilityLinkChangeRequestFail());
        });
    }
}

export const createDeletionTraceabilityLinkChangeRequest = (title, description, requestType, projectID, traceabilityLinkID, username, token) => {
    
    return dispatch => {
        dispatch(fetchMyTraceabilityLinkChangeRequestsStart());
        dispatch(createTraceabilityLinkChangeRequeststart());
        const data= {
            title: title,
            description: description,
            request_type: requestType,
            pID: projectID,
            tID: traceabilityLinkID,
            username: username
        }
        console.log(data);
        axios.post(`/traceability_link_deletion_request`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchMyTraceabilityLinkChangeRequests(projectID,token));
            dispatch(createTraceabilityLinkChangeRequestsuccess());
        })
        .catch(err=>{
            dispatch(createTraceabilityLinkChangeRequestFail());
        });
    }
}

export const removeMyTraceabilityLinkChangeRequest = (requestID, projectID, token) => {
    
    return dispatch => {
        dispatch(fetchMyTraceabilityLinkChangeRequestsStart());
        
        axios.delete(`/traceability_link_request?id=${requestID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchMyTraceabilityLinkChangeRequests(projectID,token));
        })
        .catch(err=>{

        });
    }
}