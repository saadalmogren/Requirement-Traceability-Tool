import * as actionTypes from './actionsTypes';
import axios from 'axios';

//

export const fetchProjectUsersStart = () => {
    return {
        type: actionTypes.FETCH_PROJECT_USERS_START
    }
}

export const fetchProjectUsersSuccess = (projectUsers) => {
    return {
        type: actionTypes.FETCH_PROJECT_USERS_SUCCESS,
        projectUsers: projectUsers
    }
}

export const fetchProjectUsersFail = (error) => {
    return{
        type: actionTypes.FETCH_PROJECT_USERS_FAIL,
        error: error
    }
}

export const addUserStart = () => {
    return {
        type: actionTypes.ADD_USER_START
    }
}

export const addUserSuccess = () => {
    return {
        type: actionTypes.ADD_USER_SUCCESS
    }
}

export const addUserFail = () => {
    return{
        type: actionTypes.ADD_USER_FAIL
    }
}

export const fetchProjectUsers = (projectID, token) => {
    return dispatch => {
        dispatch(fetchProjectUsersStart());

        axios.get(`/project/user?pID=${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            let fechedProject = [...res.data.users];
            console.log(fechedProject);
            dispatch(fetchProjectUsersSuccess(fechedProject));
            
        })
        .catch(err=>{
            dispatch(fetchProjectUsersFail(err));
        });
    }
}

export const addUserToProject = (projectID,username,token) => {
    return dispatch => {
        dispatch(fetchProjectUsersStart());
        dispatch(addUserStart());
        const data= {
            pID: projectID,
            username: username
        }
        axios.post(`/project/user`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchProjectUsers(projectID, token));
            dispatch(addUserSuccess());
        })
        .catch(err=>{
            dispatch(addUserFail());
        });
    }
}

export const removeUserFromProject = (projectID,username,token) => {
    return dispatch => {
        dispatch(fetchProjectUsersStart());

        axios.delete(`/project/user?username=${username}&pID=${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchProjectUsers(projectID, token));
        })
        .catch(err=>{
            dispatch(fetchProjectUsersFail(err));
        });
    }
}

export const exitFromProject = (projectID,username,token) => {
    return dispatch => {
        dispatch(fetchProjectUsersStart());

        axios.delete(`/project/leave?pID=${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchProjectUsers(projectID, token));
        })
        .catch(err=>{
            dispatch(fetchProjectUsersFail(err));
        });
    }
}