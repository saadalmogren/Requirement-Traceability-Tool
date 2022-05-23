import * as actionTypes from './actionsTypes';
import axios from 'axios';

//

export const fetchTraceabilityLinkTypesStart = () => {
    return {
        type: actionTypes.FETCH_TRACEABILITY_LINK_TYPES_START
    }
}

export const fetchTraceabilityLinkTypesSuccess = (traceabilityLinkTypes) => {
    return {
        type: actionTypes.FETCH_TRACEABILITY_LINK_TYPES_SUCCESS,
        traceabilityLinkTypes: traceabilityLinkTypes
    }
}

export const fetchTraceabilityLinkTypesFail = (error) => {
    return{
        type: actionTypes.FETCH_TRACEABILITY_LINK_TYPES_FAIL,
        error: error
    }
}

export const fetchTraceabilityLinkTypes = (projectID, token) => {
    return dispatch => {
        dispatch(fetchTraceabilityLinkTypesStart());

        axios.get(`/project/traceability_link_types?pID=${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            let fechedTraceabilityLinkTypes = [...res.data.traceability_link_types];
            console.log(fechedTraceabilityLinkTypes);
            dispatch(fetchTraceabilityLinkTypesSuccess(fechedTraceabilityLinkTypes));
            
        })
        .catch(err=>{
            dispatch(fetchTraceabilityLinkTypesFail(err));
        });
    }
}


export const createTraceabilityLinkTypestart = () => {
    return {
        type: actionTypes.CREATE_TRACEABILITY_LINK_TYPE_START
    }
}

export const createTraceabilityLinkTypesuccess = () => {
    return {
        type: actionTypes.CREATE_TRACEABILITY_LINK_TYPE_SUCCESS
    }
}

export const createTraceabilityLinkTypeFail = () => {
    return{
        type: actionTypes.CREATE_TRACEABILITY_LINK_TYPE_FAIL
    }
}

export const createTraceabilityLinkTypeInProject = (projectID,traceabilityLinkTypeName,traceabilityLinkTypeDescription,firstArtifactType,secondArtifactType, token) => {
    return dispatch => {
        dispatch(fetchTraceabilityLinkTypesStart());
        dispatch(createTraceabilityLinkTypestart());
        const data= {
            pID: projectID,
            tName: traceabilityLinkTypeName,
            tDescription: traceabilityLinkTypeDescription,
            artifactType1: firstArtifactType,
            artifactType2: secondArtifactType
        }
        console.log(data);
        axios.post(`/traceability_link_types`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchTraceabilityLinkTypes(projectID,token));
            dispatch(createTraceabilityLinkTypesuccess());
        })
        .catch(err=>{
            console.log(err);
            dispatch(createTraceabilityLinkTypeFail());
        });
    }
}

export const removeTraceabilityLinkTypeFromProject = (projectID,traceabilityLinkTypeID, token) => {
    return dispatch => {
        dispatch(fetchTraceabilityLinkTypesStart());

        axios.delete(`/traceability_link_types?tID=${traceabilityLinkTypeID}&pID=${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchTraceabilityLinkTypes(projectID,token));
        })
        .catch(err=>{
            dispatch(fetchTraceabilityLinkTypesFail(err));
        });
    }
}

export const modifyTraceabilityLinkTypeInProject = (projectID,traceabilityLinkTypeName,traceabilityLinkTypeDescription,traceabilityLinkTypeID,firstArtifactType,secondArtifactType, token) => {
    
    return dispatch => {
        dispatch(fetchTraceabilityLinkTypesStart());
        dispatch(createTraceabilityLinkTypestart());
        const data= {
            pID: projectID,
            tID: traceabilityLinkTypeID,
            tName: traceabilityLinkTypeName,
            tDescription: traceabilityLinkTypeDescription,
            artifactType1: firstArtifactType,
            artifactType2: secondArtifactType
        }
        axios.patch(`/traceability_link_types`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchTraceabilityLinkTypes(projectID,token));
            dispatch(createTraceabilityLinkTypesuccess());
        })
        .catch(err=>{
            dispatch(createTraceabilityLinkTypeFail());
        });
    }
}