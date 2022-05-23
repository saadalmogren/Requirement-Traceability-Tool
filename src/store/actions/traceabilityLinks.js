import * as actionTypes from './actionsTypes';
import axios from 'axios';
import download from 'downloadjs';
//

export const fetchTraceabilityLinksStart = () => {
    return {
        type: actionTypes.FETCH_TRACEABILITY_LINKS_START
    }
}

export const fetchTraceabilityLinksSuccess = (traceabilityLinks) => {
    return {
        type: actionTypes.FETCH_TRACEABILITY_LINKS_SUCCESS,
        traceabilityLinks: traceabilityLinks
    }
}

export const fetchTraceabilityLinksFail = (error) => {
    return{
        type: actionTypes.FETCH_TRACEABILITY_LINKS_FAIL,
        error: error
    }
}

export const fetchTraceabilityLinks = (projectID, token) => {
    return dispatch => {
        dispatch(fetchTraceabilityLinksStart());

        axios.get(`/project/traceability_links?pID=${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            let fechedTraceabilityLinks = [...res.data.traceability_links];
            console.log(fechedTraceabilityLinks);
            dispatch(fetchTraceabilityLinksSuccess(fechedTraceabilityLinks));
            
        })
        .catch(err=>{
            dispatch(fetchTraceabilityLinksFail(err));
        });
    }
}


export const createTraceabilityLinkstart = () => {
    return {
        type: actionTypes.CREATE_TRACEABILITY_LINK_START
    }
}

export const createTraceabilityLinksuccess = () => {
    return {
        type: actionTypes.CREATE_TRACEABILITY_LINK_SUCCESS
    }
}

export const createTraceabilityLinkFail = () => {
    return{
        type: actionTypes.CREATE_TRACEABILITY_LINK_FAIL
    }
}

export const createTraceabilityLinkInProject = (projectID,traceabilityLinkName,traceabilityLinkDescription,traceabilityLinkType,username,firstArtifact,secondArtifact, token) => {
    return dispatch => {
        dispatch(fetchTraceabilityLinksStart());
        dispatch(createTraceabilityLinkstart());
        const data= {
            pID: projectID,
            tName: traceabilityLinkName,
            tDescription: traceabilityLinkDescription,
            tType: traceabilityLinkType,
            username: username,
            artifact1: firstArtifact,
            artifact2: secondArtifact
        }
        console.log(data);
        axios.post(`/traceability_links`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchTraceabilityLinks(projectID, token));
            dispatch(createTraceabilityLinksuccess());
        })
        .catch(err=>{
            dispatch(createTraceabilityLinkFail());
        });
    }
}

export const removeTraceabilityLinkFromProject = (projectID,traceabilityLinkID, token) => {
    return dispatch => {
        dispatch(fetchTraceabilityLinksStart());

        axios.delete(`/traceability_links?tID=${traceabilityLinkID}&pID=${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchTraceabilityLinks(projectID, token));
        })
        .catch(err=>{
            dispatch(fetchTraceabilityLinksFail(err));
        });
    }
}

export const modifyTraceabilityLinkInProject = (projectID,traceabilityLinkName,traceabilityLinkDescription,traceabilityLinkType, traceabilityLinkID, username,firstArtifact,secondArtifact, token) => {
    
    return dispatch => {
        dispatch(fetchTraceabilityLinksStart());
        dispatch(createTraceabilityLinkstart());
        const data= {
            tID: traceabilityLinkID,
            pID: projectID,
            tName: traceabilityLinkName,
            tDescription: traceabilityLinkDescription,
            tType: traceabilityLinkType,
            username: username,
            artifact1: firstArtifact,
            artifact2: secondArtifact
        }
        console.log(data);
        axios.patch(`/traceability_links`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchTraceabilityLinks(projectID, token));
            dispatch(createTraceabilityLinksuccess());
        })
        .catch(err=>{
            dispatch(createTraceabilityLinkFail());
        });
    }
}

export const exportTraceabilityLinks = (projectID, token) => {
    return dispatch => {
        dispatch(fetchTraceabilityLinksStart());

        axios.get(`/project/export_traceability_link_information?pID=${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            console.log(res);
            download(res.data, "TraceabilityLinks.csv", "text/csv" )
        })
        .catch(err=>{
            console.log(err);
        });
    }
}