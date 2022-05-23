import * as actionTypes from './actionsTypes';
import axios from 'axios';

//

export const fetchProjectsStart = () => {
    return {
        type: actionTypes.FETCH_PROJECTS_START
    }
}

export const fetchProjectsSuccess = (projects) => {
    return {
        type: actionTypes.FETCH_PROJECTS_SUCCESS,
        projects: projects
    }
}

export const fetchProjectsFail = (error) => {
    return{
        type: actionTypes.FETCH_PROJECTS_FAIL,
        error: error
    }
}

export const selectProject = (project) => {
    return{
        type: actionTypes.SELECT_PROJECT,
        project: project
    }
}

export const fetchProjects = (username, token) => {
    return dispatch => {
        dispatch(fetchProjectsStart());

        axios.get(`/projects?username=${username}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            let fechedProjects = [];
            fechedProjects=[...res.data.projects];
            console.log(fechedProjects);
            dispatch(fetchProjectsSuccess(fechedProjects));
            
        })
        .catch(err=>{
            dispatch(fetchProjectsFail(err));
        });
    }
}


export const createProject = (pName, pDescription, username, token) => {
    return dispatch => {

        const projectData = {
            username: username,
            name: pName,
            description: pDescription
        }

        console.log(projectData);
        
        axios.post(`/projects`,projectData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchProjects(username, token));
        })
        .catch(err=>{
            dispatch(fetchProjectsFail(err));
        });
    }
}

export const modifyProject = (pID, pName, pDescription, username, token) => {
    console.log(token);
    return dispatch => {


        const projectData = {
            pID: pID,
            username: username,
            name: pName,
            description: pDescription
        }

        axios.patch(`/projects`,projectData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchProjects(username, token)); 
        })
        .catch(err=>{
            dispatch(fetchProjectsFail(err));
        });
    }
}

export const removeProject = (pID, username, token = '') => {
    return dispatch => {

        axios.delete(`/projects/${pID}?username=${username}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchProjects(username, token));   
        })
        .catch(err=>{
            dispatch(fetchProjectsFail(err));
        });
    }
}


