import * as actionTypes from './actionsTypes';
import axios from 'axios';

//

export const fetchArtifactTypesStart = () => {
    return {
        type: actionTypes.FETCH_ARTIFACT_TYPES_START
    }
}

export const fetchArtifactTypesSuccess = (artifactTypes) => {
    return {
        type: actionTypes.FETCH_ARTIFACT_TYPES_SUCCESS,
        artifactTypes: artifactTypes
    }
}

export const fetchArtifactTypesFail = (error) => {
    return{
        type: actionTypes.FETCH_ARTIFACT_TYPES_FAIL,
        error: error
    }
}

export const fetchArtifactTypes = (projectID, token) => {
    return dispatch => {
        dispatch(fetchArtifactTypesStart());

        axios.get(`/project/artifact_types?pID=${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            let fechedArtifactTypes = [...res.data.artifact_types];
            console.log(fechedArtifactTypes);
            dispatch(fetchArtifactTypesSuccess(fechedArtifactTypes));
            
        })
        .catch(err=>{
            dispatch(fetchArtifactTypesFail(err));
        });
    }
}


export const createArtifactTypestart = () => {
    return {
        type: actionTypes.CREATE_ARTIFACT_TYPE_START
    }
}

export const createArtifactTypesuccess = () => {
    return {
        type: actionTypes.CREATE_ARTIFACT_TYPE_SUCCESS
    }
}

export const createArtifactTypeFail = () => {
    return{
        type: actionTypes.CREATE_ARTIFACT_TYPE_FAIL
    }
}

export const createArtifactTypeInProject = (projectID,artifactTypeName,artifactTypeDescription, token) => {
    return dispatch => {
        dispatch(fetchArtifactTypesStart());
        dispatch(createArtifactTypestart());
        const data= {
            pID: projectID,
            aName: artifactTypeName,
            aDescription: artifactTypeDescription
        }
        axios.post(`/artifact_types`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchArtifactTypes(projectID,token));
            dispatch(createArtifactTypesuccess());
        })
        .catch(err=>{
            dispatch(createArtifactTypeFail());
        });
    }
}

export const removeArtifactTypeFromProject = (projectID,artifactTypeID, token) => {
    return dispatch => {
        dispatch(fetchArtifactTypesStart());

        axios.delete(`/artifact_types?aID=${artifactTypeID}&pID=${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchArtifactTypes(projectID,token));
        })
        .catch(err=>{
            dispatch(fetchArtifactTypesFail(err));
        });
    }
}

export const modifyArtifactTypeInProject = (projectID,artifactTypeName,artifactTypeDescription,artifactTypeID, token) => {
    
    return dispatch => {
        dispatch(fetchArtifactTypesStart());
        dispatch(createArtifactTypestart());
        const data= {
            pID: projectID,
            aID: artifactTypeID,
            aName: artifactTypeName,
            aDescription: artifactTypeDescription
        }
        axios.patch(`/artifact_types`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchArtifactTypes(projectID,token));
            dispatch(createArtifactTypesuccess());
        })
        .catch(err=>{
            dispatch(createArtifactTypeFail());
        });
    }
}