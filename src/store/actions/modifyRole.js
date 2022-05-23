import * as actionTypes from './actionsTypes';
import axios from 'axios';

//

export const fetchRolePrivilegesStart = () => {
    return {
        type: actionTypes.FETCH_ROLE_PRIVILEGES_START
    }
}

export const fetchRolePrivilegesSuccess = (rolePrivileges) => {
    return {
        type: actionTypes.FETCH_ROLE_PRIVILEGES_SUCCESS,
        rolePrivileges: rolePrivileges
    }
}

export const fetchRolePrivilegesFail = (error) => {
    return{
        type: actionTypes.FETCH_ROLE_PRIVILEGES_FAIL,
        error: error
    }
}


export const fetchRolePrivileges = (projectID,roleName, token) => {
    return dispatch => {
        dispatch(fetchRolePrivilegesStart());

        axios.get(`/role/privileges?pID=${projectID}&rName=${roleName}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            let fechedRolePrivileges = [...res.data.privileges];
            console.log(fechedRolePrivileges);
            dispatch(fetchRolePrivilegesSuccess(fechedRolePrivileges));
            
        })
        .catch(err=>{
            console.log(err);
            dispatch(fetchRolePrivilegesFail(err));
        });
    }
}

export const modifyRole = (projectID,roleName,roleID, token) => {
    return dispatch => {
        const data= {
            rName: roleName,
            rID: roleID,
            pID: projectID,
        }
        axios.patch(`/role`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            console.log("modifyRole success");
        })
        .catch(err=>{
            console.log("modifyRole fail", err);
        });
    }
}

export const addPrivilegesToRole = (projectID,roleID,privileges, token) => {
    return dispatch => {
        const data= {
            rID: roleID,
            rPrivileges: privileges,
            pID: projectID,
        }
        axios.patch(`/role/privileges/add`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            console.log("addPrivilegesToRole success");
        })
        .catch(err=>{
            console.log("addPrivilegesToRole fail", err);
        });
    }
}

export const removePrivilegesFromRole = (projectID,roleID,privileges, token) => {
    return dispatch => {
        const data= {
            rID: roleID,
            rPrivileges: privileges,
            pID: projectID,
        }
        axios.patch(`/role/privileges/delete`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            console.log("removePrivilegesFromRole success");
        })
        .catch(err=>{
            console.log("removePrivilegesFromRole fail", err);
        });
    }
}