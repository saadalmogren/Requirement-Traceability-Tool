import React, { useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
  Tooltip,
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import EditIcon from "@material-ui/icons/Edit";
import { Link, Redirect, withRouter } from "react-router-dom";
import Confirmation from "../Confirmation/Confirmation";
import { connect } from "react-redux";
import * as projectsActions from "../../store/actions/projectActions";
import * as usersActions from "../../store/actions/Users";
import { SocketIOLeaveProject } from "../SocketIO/SocketIOHandler";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.grey[50],
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  table: {
    // minWidth: 400,
  },
  link: {
    textDecoration: "none",
  },
  delBtn: {
    color: "red",
  },
  rootContent: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  projectList: {
    marginBottom: theme.spacing(2),
  },
}));

const modifyProject = (project) => {
  console.log("Modifying project: ", project);
};

const handleMouseHover = (e) => {
  e.target.style.cursor = "pointer";
};

function ProjectsList(props) {
  const classes = useStyles();
  const [redirect, setRedirect] = React.useState({ path: "", state: {} });

  useEffect(() => {
    props.onFetchProjects(props.username, props.token);
  }, [
    props.onFetchProjects,
    props.username,
    props.onExitFromProject,
    props.users,
  ]);

  // useEffect(() => {
  //   // join all projects in SocketIO that user have
  //   SocketIOJoinProjects(
  //     props.projects.map((p) => p.id),
  //     props.username
  //   );
  // }, [props.projects]);

  // console.log(
  //   "Debug:",
  //   props.projects.map((p) => p.id),
  //   props.username
  // );

  const deleteProject = (projectID, name) => {
    console.log("Deleting project: ", projectID);
    SocketIOLeaveProject(projectID, props.username);
    props.onRemoveProject(projectID, props.username, props.token);
    props.history.replace("/main-page", {
      alert: {
        name: name,
        msg: "The project has been deleted successfully!",
      },
    });
  };
  const viewProjectDetails = (project) => {
    console.log(project, " Selected");
    setRedirect({ path: "project-details" });
    props.onSelectProject(project);
  };
  const exitFromProject = (projectID, name) => {
    SocketIOLeaveProject(projectID, props.username);
    props.onExitFromProject(projectID, props.username, props.token);
    props.history.replace("/main-page", {
      alert: {
        name: name,
        msg: "You have left the project successfully!",
      },
    });
  };
  const redirected = () => {
    if (redirect.path) {
      const path = redirect.path;

      return <Redirect to={{ pathname: path, state: redirect.state }} />;
    } else return "";
  };
  return (
    <div className={classes.rootContent}>
      <Grid container item lg={12} justify="center">
        <Typography component="h1" variant="h4" className={classes.projectList}>
          Projects List
        </Typography>

        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">#</StyledTableCell>
                <StyledTableCell align="center">Project Name</StyledTableCell>
                <StyledTableCell align="center">
                  Project Description
                </StyledTableCell>
                <StyledTableCell align="center">
                  {/* <SettingsIcon  /> */}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.projects.length == 0 ? (
                <TableRow>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    align="center"
                    colSpan={4}
                  >
                    <Typography align="center">
                      You do not have any projects!
                    </Typography>
                  </StyledTableCell>
                </TableRow>
              ) : (
                props.projects.map((project, index) => (
                  <StyledTableRow
                    hover
                    key={project.name}
                    onMouseEnter={handleMouseHover}
                  >
                    <StyledTableCell
                      component="th"
                      scope="row"
                      align="center"
                      onClick={() => viewProjectDetails(project)}
                    >
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell
                      component="th"
                      scope="row"
                      align="center"
                      onClick={() => viewProjectDetails(project)}
                    >
                      {project.name}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      onClick={() => viewProjectDetails(project)}
                    >
                      {project.description}
                    </StyledTableCell>

                    <StyledTableCell
                      component="th"
                      scope="row"
                      align="center"
                      width="80"
                      height="80"
                      padding="checkbox"
                    >
                      {project.manager === props.username ? (
                        <Tooltip title="Modify">
                          <Link
                            to={{
                              pathname: "/modify-project",
                              state: {
                                projectName: project.name,
                                projectID: project.id,
                                projectDescription: project.description,
                              },
                            }}
                            className={classes.link}
                          >
                            <IconButton
                              variant="text"
                              onClick={() => modifyProject(project.name)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Link>
                        </Tooltip>
                      ) : null}

                      {project.manager === props.username ? (
                        <Confirmation
                          title="Delete Confirmation!"
                          description={
                            "Are you sure you want to delete " +
                            project.name +
                            "?"
                          }
                          variant="text"
                          onConfirm={() =>
                            deleteProject(project.id, project.name)
                          }
                          className={classes.delBtn}
                        >
                          <DeleteForeverIcon className={classes.delBtn} />
                        </Confirmation>
                      ) : null}
                      {project.manager === props.username ? null : (
                        <Confirmation
                          title="Exit Confirmation!"
                          tooltip="Leave"
                          description={
                            "Are you sure you want to exit from " +
                            project.name +
                            "?"
                          }
                          variant="text"
                          onConfirm={() =>
                            exitFromProject(project.id, project.name)
                          }
                          className={classes.delBtn}
                        >
                          <ExitToAppIcon className={classes.delBtn} />
                        </Confirmation>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container justify="flex-end">
          <Box mt={2}>
            <Link to="/create-project" className={classes.link}>
              <Button variant="contained" color="primary">
                Create project
              </Button>
            </Link>
          </Box>
        </Grid>
        {redirected()}
      </Grid>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    token: state.auth.token,
    loading: state.projects.loading,
    error: state.projects.error,
    isAuthenticated: state.projects.token !== null,
    isSignupSuccess: state.projects.success,
    projects: state.projects.projects,
    users: state.users.projectUsers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchProjects: (username, token) =>
      dispatch(projectsActions.fetchProjects(username, token)),
    onSelectProject: (project) =>
      dispatch(projectsActions.selectProject(project)),
    onRemoveProject: (pID, username, token) =>
      dispatch(projectsActions.removeProject(pID, username, token)),
    onExitFromProject: (pID, username, token) =>
      dispatch(usersActions.exitFromProject(pID, username, token)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProjectsList)
);
