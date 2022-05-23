import * as actionTypes from './actionsTypes';
import axios from 'axios';

//

export const fetchProjectRolesStart = () => {
    return {
        type: actionTypes.FETCH_PROJECT_ROLES_START
    }
}

export const fetchProjectRolesSuccess = (projectRoles) => {
    return {
        type: actionTypes.FETCH_PROJECT_ROLES_SUCCESS,
        projectRoles: projectRoles
    }
}

export const fetchProjectRolesFail = (error) => {
    return{
        type: actionTypes.FETCH_PROJECT_ROLES_FAIL,
        error: error
    }
}

export const createRolestart = () => {
    return {
        type: actionTypes.CREATE_ROLE_START
    }
}

export const createRolesuccess = () => {
    return {
        type: actionTypes.CREATE_ROLE_SUCCESS
    }
}

export const createRoleFail = () => {
    return{
        type: actionTypes.CREATE_ROLE_FAIL
    }
}

export const fetchPrivilegesSuccess = (privileges) => {
    return {
        type: actionTypes.FETCH_PRIVILEGES_SUCCESS,
        privileges: privileges
    }
}

export const fetchProjectRoles = (projectID,token) => {
    
    return dispatch => {
        dispatch(fetchProjectRolesStart());

        axios.get(`/project/roles?pID=${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            let fechedProjectRoles = [...res.data.roles];
            console.log(fechedProjectRoles);
            dispatch(fetchProjectRolesSuccess(fechedProjectRoles));
            
        })
        .catch(err=>{
            dispatch(fetchProjectRolesFail(err));
        });
    }
}

export const createRoleInProject = (projectID,Rolename,privileges,token) => {
    return dispatch => {
        dispatch(fetchProjectRolesStart());
        dispatch(createRolestart());
        const data= {
            pID: projectID,
            rName: Rolename,
            rPrivileges: privileges
        }
        axios.post(`/role`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchProjectRoles(projectID, token));
            dispatch(createRolesuccess());
        })
        .catch(err=>{
            dispatch(createRoleFail());
        });
    }
}

export const removeRoleFromProject = (projectID,rolename,token) => {
    return dispatch => {
        dispatch(fetchProjectRolesStart());

        axios.delete(`/role?rName=${rolename}&pID=${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(fetchProjectRoles(projectID,token));
        })
        .catch(err=>{
            dispatch(fetchProjectRolesFail(err));
        });
    }
}

export const fetchPrivileges = (token) => {
    return dispatch => {

        axios.get(`/privileges`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            let fechedPrivileges = [...res.data.privileges];
            dispatch(fetchPrivilegesSuccess(fechedPrivileges));
            
        })
        .catch(err=>{
            console.log(err);
        });
    }
}