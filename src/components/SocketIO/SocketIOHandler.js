import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import io from "socket.io-client";
import * as projectsActions from "../../store/actions/projectActions";
import * as usersActions from "../../store/actions/Users";
import * as rolesActions from "../../store/actions/roles";
import * as changeUserRoleActions from "../../store/actions/changeUserRole";
import * as projectDetailsActions from "../../store/actions/projectDetails";
import * as alertActions from "../../store/actions/alert";

let endPoint = "http://127.0.0.1:5000";
let socket = io.connect(`${endPoint}`);

function SocketIOHandler(props) {
  useEffect(() => {
    if (props.username) props.onFetchProjects(props.username, props.token);
    initializeSocket();
  }, [props.username]);

  useEffect(() => {
    handleListeners();
  }, [props.selectedProject, props.username, props.token]);

  useEffect(() => {
    // using state maybe?
    if (props.username && props.projects.length > 0)
      JoinAllProjects(
        props.projects.map((p) => p.id),
        props.username
      );
    // console.log("Props at SocketIO: ", props);
  }, [props.projects, props.username]);

  function initializeSocket() {
    // console.log("init socket");
    socket.on("connect", () => console.log("SocketIO Connected"));
    // socket.on("message", (msg) => {
    //   console.log("props at socketIO: ", props);
    //   console.log("SocketIO Message: ", msg);
    // });
  }

  function JoinAllProjects(projects, user) {
    projects.forEach((project) => {
      socket.emit("join", {
        project: project,
        username: user,
      });
      // console.log("SocketIO joined: ", project, ", as: ", user);
    });
  }
  function handleListeners() {
    socket.off("message");
    if (props.username) {
      socket.on("message", (msg) => {
        usersListener(msg);

        if (props.selectedProject) {
          rolesListener(msg);
          changeManagementListener(msg);
        }
      });
    }
  }
  function changeManagementListener(msg) {
    if (msg.update && msg.update === "Manager")
      if (isCurrentUser(msg.username, msg.pID)) {
        props.onFetchProjectsDetails(props.selectedProject.id, props.token);
        props.onFetchUserPrivileges(
          props.selectedProject.id,
          props.username,
          props.token
        );
        if (msg.message) alert(msg.message, msg.username, msg.pID);
      }
  }
  function rolesListener(msg) {
    if (msg.update && msg.update === "Role")
      //   why? the role could be modified without a specific user
      props.onFetchUserPrivileges(
        props.selectedProject.id,
        props.username,
        props.token
      );
    // if (isCurrentUser(msg.username, msg.pID))
    alert(msg.message, msg.username, msg.pID);
  }
  function usersListener(msg) {
    if (msg.update && msg.update === "User")
      if (isCurrentUser(msg.username, msg.pID)) {
        props.onFetchUsers(props.selectedProject.id, props.token);
        props.onFetchProjects(props.username, props.token);

        // if the user is removed
        if (msg.message) {
          alert(msg.message, msg.username, msg.pID);
          if (msg.pID === props.selectedProject.id)
            props.history.push("/main-page");
        }
      }
  }
  // Refactoring extracting a method ?
  function isCurrentUser(username, pID) {
    return username === props.username && pID === props.selectedProject.id;
  }

  function alert(msg, username, pID) {
    if (props.username === username && props.selectedProject.id === pID)
      props.onAlert(msg, "info");

    // props.history.replace({
    //   ...props.history.location,
    //   state: {
    //     alert: {
    //       msg: msg,
    //     },
    //   },
    // });
  }

  return null;
}

export function SocketIOLeaveProject(projectID, user) {
  socket.emit("leave", {
    project: projectID,
    username: user,
  });
}

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    token: state.auth.token,
    isAuthenticated: state.projects.token !== null,
    projects: state.projects.projects,
    selectedProject: state.projects.selectedProject,
    users: state.users.projectUsers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchProjects: (username, token) =>
      dispatch(projectsActions.fetchProjects(username, token)),
    onFetchUsers: (pID, token) =>
      dispatch(usersActions.fetchProjectUsers(pID, token)),
    onFetchRoles: (pID, token) =>
      dispatch(rolesActions.fetchProjectRoles(pID, token)),
    onFetchUserPrivileges: (pID, username, token) =>
      dispatch(changeUserRoleActions.fetchUserPrivileges(pID, username, token)),
    onFetchProjectsDetails: (pID, token) =>
      dispatch(projectDetailsActions.fetchProjectDetails(pID, token)),
    onAlert: (text, type) =>
      dispatch(alertActions.showAlertWithTimeout(text, "", type)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SocketIOHandler)
);
