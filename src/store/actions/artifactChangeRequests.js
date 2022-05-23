import * as actionTypes from './actionsTypes';
import axios from 'axios';


export const fetchArtifactChangeRequestsStart = () => {
    return {
        type: actionTypes.FETCH_ARTIFACTS_CHANGE_REQUESTS_START
    }
}

export const fetchArtifactChangeRequestsSuccess = (artifactChangeRequests) => {
    return {
        type: actionTypes.FETCH_ARTIFACTS_CHANGE_REQUESTS_SUCCESS,
        artifactChangeRequests: artifactChangeRequests
    }
}

export const fetchArtifactChangeRequestsFail = (error) => {
    return{
        type: actionTypes.FETCH_ARTIFACTS_CHANGE_REQUESTS_FAIL,
        error: error
    }
}

export const fetchArtifactChangeRequests = (projectID, token) => {
    return dispatch => {
        dispatch(fetchArtifactChangeRequestsStart());

        axios.get(`/project/artifact_change_requests?pID=${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            let fechedartifactChangeRequests = [...res.data.artifact_change_requests];
            console.log(fechedartifactChangeRequests);
            dispatch(fetchArtifactChangeRequestsSuccess(fechedartifactChangeRequests));
            
        })
        .catch(err=>{
            console.log(err);
            dispatch(fetchArtifactChangeRequestsFail(err));
        });
    }
}

export const acceptArtifactChangeRequest = (projectID, rID, token) => {
    
    return dispatch => {
        dispatch(fetchArtifactChangeRequestsStart());
        const data= {
            pID: projectID,
            id: rID
        }
        console.log(data);
        axios.post(`/accept_artifact_request`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchArtifactChangeRequests(projectID,token));
        })
        .catch(err=>{
            console.log(err);
            dispatch(fetchArtifactChangeRequestsFail());
        });
    }
}

export const rejectArtifactChangeRequest = (projectID, rID, rejectReason, token) => {
    
    return dispatch => {
        dispatch(fetchArtifactChangeRequestsStart());
        const data= {
            pID: projectID,
            id: rID,
            reject_reason: rejectReason
        }
        console.log(data);
        axios.post(`/reject_artifact_request`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchArtifactChangeRequests(projectID,token));
        })
        .catch(err=>{
            console.log(err);
            dispatch(fetchArtifactChangeRequestsFail());
        });
    }
}

