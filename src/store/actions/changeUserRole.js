import * as actionTypes from "./actionsTypes";
import axios from "axios";

//user roles

export const fetchUserRolesStart = () => {
  return {
    type: actionTypes.FETCH_USER_ROLES_START,
  };
};

export const fetchUserRolesSuccess = (userRoles) => {
  return {
    type: actionTypes.FETCH_USER_ROLES_SUCCESS,
    userRoles: userRoles,
  };
};

export const fetchUserRolesFail = (error) => {
  return {
    type: actionTypes.FETCH_USER_ROLES_FAIL,
    error: error,
  };
};

export const fetchUserRoles = (projectID, username, token) => {
  return (dispatch) => {
    dispatch(fetchUserRolesStart());

    axios
      .get(`/project/user/roles?pID=${projectID}&username=${username}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
      .then((res) => {
        let fechedUserRoles = res.data.roles.map((role) => role.name);
        console.log(fechedUserRoles);
        dispatch(fetchUserRolesSuccess(fechedUserRoles));
      })
      .catch((err) => {
        console.log(err);
        dispatch(fetchUserRolesFail(err));
      });
  };
};

//user privileges
export const fetchUserPrivilegesStart = () => {
  return {
    type: actionTypes.FETCH_USER_PRIVILEGES_START,
  };
};

export const fetchUserPrivilegesSuccess = (userPrivileges) => {
  return {
    type: actionTypes.FETCH_USER_PRIVILEGES_SUCCESS,
    userPrivileges: userPrivileges,
  };
};

export const fetchUserPrivilegesFail = (error) => {
  return {
    type: actionTypes.FETCH_USER_PRIVILEGES_FAIL,
    error: error,
  };
};

export const fetchUserPrivileges = (projectID, username, token) => {
  return (dispatch) => {
    dispatch(fetchUserPrivilegesStart());

    axios.get(`/project/user/privileges?pID=${projectID}&username=${username}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
      .then((res) => {
        // let fechedUserPrivileges = res.data.privileges.map((p) => p.name);
        let fechedUserPrivileges = res.data.privileges;

        console.log(fechedUserPrivileges);
        dispatch(fetchUserPrivilegesSuccess(fechedUserPrivileges));
      })
      .catch((err) => {
        console.log(err);
        dispatch(fetchUserPrivilegesFail(err));
      });
  };
};

// change management
export const changeManagement = (projectID, oldUsername, newUsername, token) => {
  return (dispatch) => {
    const data = {
      oldUsername: oldUsername,
      newUsername: newUsername,
      pID: projectID,
    };
    axios
      .patch(`/project/change_management`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
      .then((res) => {
        console.log("changeManagement success");
      })
      .catch((err) => {
        console.log("changeManagement fail", err);
      });
  };
};

// change user role
export const addRolesToUser = (projectID, username, roles, token) => {
  return (dispatch) => {
    const data = {
      username: username,
      roles: roles,
      pID: projectID,
    };
    axios
      .patch(`/project/user/roles/add`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
      .then((res) => {
        console.log("addRolesToUser success");
      })
      .catch((err) => {
        console.log("addRolesToUser fail", err);
      });
  };
};

export const removeRolesFromUser = (projectID, username, roles, token) => {
  return (dispatch) => {
    const data = {
      username: username,
      roles: roles,
      pID: projectID,
    };
    axios
      .patch(`/project/user/roles/delete`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
      .then((res) => {
        console.log("removeRolesFromUser success");
      })
      .catch((err) => {
        console.log("removeRolesFromUser fail", err);
      });
  };
};
