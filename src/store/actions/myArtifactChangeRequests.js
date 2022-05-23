import * as actionTypes from './actionsTypes';
import axios from 'axios';

//

export const fetchMyArtifactChangeRequestsStart = () => {
    return {
        type: actionTypes.FETCH_MY_ARTIFACTS_CHANGE_REQUESTS_START
    }
}

export const fetchMyArtifactChangeRequestsSuccess = (artifactChangeRequests) => {
    
    return {
        type: actionTypes.FETCH_MY_ARTIFACTS_CHANGE_REQUESTS_SUCCESS,
        artifactChangeRequests: artifactChangeRequests
    }
}

export const fetchMyArtifactChangeRequestsFail = (error) => {
    return{
        type: actionTypes.FETCH_MY_ARTIFACTS_CHANGE_REQUESTS_FAIL,
        error: error
    }
}

export const fetchMyArtifactChangeRequests = (projectID, token) => {
    return dispatch => {
        dispatch(fetchMyArtifactChangeRequestsStart());

        axios.get(`/project/artifact_sent_change_requests?pID=${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            let fechedartifactChangeRequests = [...res.data.artifact_sent_change_requests];
            console.log(fechedartifactChangeRequests);
            dispatch(fetchMyArtifactChangeRequestsSuccess(fechedartifactChangeRequests));
            
        })
        .catch(err=>{
            console.log(err);
            dispatch(fetchMyArtifactChangeRequestsFail(err));
        });
    }
}

// not modified yet 
export const createArtifactChangeRequeststart = () => {
    return {
        type: actionTypes.CREATE_ARTIFACT_CHANGE_REQUEST_START
    }
}

export const createArtifactChangeRequestsuccess = () => {
    return {
        type: actionTypes.CREATE_ARTIFACT_CHANGE_REQUEST_SUCCESS
    }
}

export const createArtifactChangeRequestFail = () => {
    return{
        type: actionTypes.CREATE_ARTIFACT_CHANGE_REQUEST_FAIL
    }
}

export const createCreationArtifactChangeRequest = (title, description, requestType, projectID,artifactName,artifactDescription,artifactType,username, token) => {
    
    return dispatch => {
        dispatch(fetchMyArtifactChangeRequestsStart());
        dispatch(createArtifactChangeRequeststart());
        const data= {
            title: title,
            description: description,
            request_type: requestType,
            pID: projectID,
            aName: artifactName,
            aDescription: artifactDescription,
            artifact_type: artifactType,
            username: username
        }
        console.log(data);
        axios.post(`/artifact_creation_request`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchMyArtifactChangeRequests(projectID,token));
            dispatch(createArtifactChangeRequestsuccess());
        })
        .catch(err=>{
            dispatch(createArtifactChangeRequestFail());
        });
    }
}

export const createModificationArtifactChangeRequest = (title, description, requestType, projectID,artifactName, artifactID, artifactDescription,artifactType,username, token) => {
    
    return dispatch => {
        dispatch(fetchMyArtifactChangeRequestsStart());
        dispatch(createArtifactChangeRequeststart());
        const data= {
            title: title,
            description: description,
            request_type: requestType,
            pID: projectID,
            aName: artifactName,
            aID: artifactID,
            aDescription: artifactDescription,
            artifact_type: artifactType,
            username: username
        }
        console.log(data);
        axios.post(`/artifact_modification_request`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchMyArtifactChangeRequests(projectID,token));
            dispatch(createArtifactChangeRequestsuccess());
        })
        .catch(err=>{
            dispatch(createArtifactChangeRequestFail());
        });
    }
}

export const createDeletionArtifactChangeRequest = (title, description, requestType, projectID, artifactID, username, token) => {
    
    return dispatch => {
        dispatch(fetchMyArtifactChangeRequestsStart());
        dispatch(createArtifactChangeRequeststart());
        const data= {
            title: title,
            description: description,
            request_type: requestType,
            pID: projectID,
            aID: artifactID,
            username: username
        }
        console.log(data);
        axios.post(`/artifact_deletion_request`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchMyArtifactChangeRequests(projectID,token));
            dispatch(createArtifactChangeRequestsuccess());
        })
        .catch(err=>{
            dispatch(createArtifactChangeRequestFail());
        });
    }
}

export const removeMyArtifactChangeRequest = (requestID, projectID, token) => {
    
    return dispatch => {
        dispatch(fetchMyArtifactChangeRequestsStart());
        
        axios.delete(`/artifact_request?id=${requestID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchMyArtifactChangeRequests(projectID,token));
        })
        .catch(err=>{

        });
    }
}