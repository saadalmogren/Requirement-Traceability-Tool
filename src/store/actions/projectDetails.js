import * as actionTypes from './actionsTypes';
import axios from 'axios';

//

export const fetchProjectDetailsStart = () => {
    return {
        type: actionTypes.FETCH_PROJECT_DETAILS_START
    }
}

export const fetchProjectDetailsSuccess = (projectDetails) => {
    return {
        type: actionTypes.FETCH_PROJECT_DETAILS_SUCCESS,
        projectDetails: projectDetails
    }
}

export const fetchProjectDetailsFail = (error) => {
    return{
        type: actionTypes.FETCH_PROJECT_DETAILS_FAIL,
        error: error
    }
}

export const fetchProjectDetails = (projectID, token) => {
    return dispatch => {
        dispatch(fetchProjectDetailsStart());

        axios.get(`/projects/${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            let fechedProject = {...res.data.project_details};
            console.log(fechedProject);
            dispatch(fetchProjectDetailsSuccess(fechedProject));
            
        })
        .catch(err=>{
            dispatch(fetchProjectDetailsFail(err));
        });
    }
}

