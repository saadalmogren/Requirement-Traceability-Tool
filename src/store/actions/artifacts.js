import * as actionTypes from './actionsTypes';
import axios from 'axios';
import download from 'downloadjs';
//

export const fetchArtifactsStart = () => {
    return {
        type: actionTypes.FETCH_ARTIFACTS_START
    }
}

export const fetchArtifactsSuccess = (artifacts) => {
    return {
        type: actionTypes.FETCH_ARTIFACTS_SUCCESS,
        artifacts: artifacts
    }
}

export const fetchArtifactsFail = (error) => {
    return{
        type: actionTypes.FETCH_ARTIFACTS_FAIL,
        error: error
    }
}

export const fetchArtifacts = (projectID, token) => {
    return dispatch => {
        dispatch(fetchArtifactsStart());

        axios.get(`/project/artifacts?pID=${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            let fechedArtifacts = [...res.data.artifacts];
            console.log(fechedArtifacts);
            dispatch(fetchArtifactsSuccess(fechedArtifacts));
            
        })
        .catch(err=>{
            dispatch(fetchArtifactsFail(err));
        });
    }
}

// not modified yet 
export const createArtifactstart = () => {
    return {
        type: actionTypes.CREATE_ARTIFACT_START
    }
}

export const createArtifactsuccess = () => {
    return {
        type: actionTypes.CREATE_ARTIFACT_SUCCESS
    }
}

export const createArtifactFail = () => {
    return{
        type: actionTypes.CREATE_ARTIFACT_FAIL
    }
}

export const createArtifactInProject = (projectID,artifactName,artifactDescription,artifactType,username, token) => {
    console.log(artifactType);
    return dispatch => {
        dispatch(fetchArtifactsStart());
        dispatch(createArtifactstart());
        const data= {
            pID: projectID,
            aName: artifactName,
            aDescription: artifactDescription,
            artifact_type: artifactType,
            username: username
        }
        console.log(data);
        axios.post(`/artifact`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchArtifacts(projectID,token));
            dispatch(createArtifactsuccess());
        })
        .catch(err=>{
            dispatch(createArtifactFail());
        });
    }
}

export const removeArtifactFromProject = (projectID,artifactID, token) => {
    console.log(token);
    return dispatch => {
        dispatch(fetchArtifactsStart());

        axios.delete(`/artifact?aID=${artifactID}&pID=${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchArtifacts(projectID,token));
        })
        .catch(err=>{
            dispatch(fetchArtifactsFail(err));
        });
    }
}

export const modifyArtifactInProject = (projectID,artifactName,artifactDescription,artifactType, artifactID, username, token) => {
    
    return dispatch => {
        dispatch(fetchArtifactsStart());
        dispatch(createArtifactstart());
        const data= {
            pID: projectID,
            aName: artifactName,
            aDescription: artifactDescription,
            artifact_type: artifactType,
            aID: artifactID,
            username: username
        }
        console.log(data);
        axios.patch(`/artifact`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchArtifacts(projectID,token));
            dispatch(createArtifactsuccess());
        })
        .catch(err=>{
            dispatch(createArtifactFail());
        });
    }
}

export const exportArtifacts = (projectID, token) => {
    return dispatch => {
        dispatch(fetchArtifactsStart());

        axios.get(`/project/export_artifact_information?pID=${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            console.log(res);
            download(res.data, "Artifacts.csv", "text/csv" )
        })
        .catch(err=>{
            console.log(err);
        });
    }
}