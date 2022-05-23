import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import {
  Avatar,
  Box,
  ButtonGroup,
  Grid,
  IconButton,
  Slide,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import SettingsIcon from "@material-ui/icons/Settings";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import Confirmation from "../Confirmation/Confirmation";
import { Link, withRouter } from "react-router-dom";
import * as projectDetailsActions from "../../store/actions/projectDetails";
import * as usersActions from "../../store/actions/Users";
// import SocketIO from "../SocketIO/SocketIO";

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
  table: { maxWidth: 400, maxHeight: 400 },
  delBtn: {
    color: "red",
  },
  link: {
    textDecoration: "none",
  },
  root: {
    height: 180,
  },
  rootDiv: {
    width: "100%",
  },
  table: {
    maxWidth: 400,
    width: "100%",
  },
  wrapper: {
    width: 100 + theme.spacing(2),
  },
  paper: {
    zIndex: 1,
    position: "relative",
    margin: theme.spacing(1),
  },

  icon: {
    marginRight: theme.spacing(1),
    width: 25,
    height: 25,
    backgroundColor: theme.palette.common.white,
  },
}));

function Users(props) {
  const classes = useStyles();
  const [showUsers, setShowUsers] = React.useState("1");

  // if (!props.selectedProject) props.history.push("/main-page");

  useEffect(() => {
    props.onFetchUsers(props.selectedProject.id, props.token);
  }, [props.onFetchUsers, props.selectedProject.id]);

  // handle if user not exist in the project anymore
  // useEffect(() => {
  //   props.onFetchUsers(props.selectedProject.id, props.token);
  //   if (
  //     !props.loadingUsers &&
  //     props.users.length > 0 &&
  //     props.users.indexOf(props.username) === -1
  //   )
  //     props.history.push("/main-page");
  // }, [props.users.length]);

  // useEffect(() => {
  //   SocketIO.on("message", (msg) => {
  //     if (msg.update)
  //       if (msg.update === "User") {
  //         props.onFetchUsers(props.selectedProject.id, props.token);
  //       }
  //   });
  // }, []);

  const handleClick = () => {
    setShowUsers((prev) => !prev);
  };
  const deleteUser = (username) => {
    console.log(
      "Deleted user: ",
      username,
      " from: ",
      props.selectedProject.id
    );
    props.onRemoveUser(props.selectedProject.id, username, props.token);
    props.history.replace("/project-details", {
      alert: {
        name: username,
        msg: "The user has been removed successfully!",
      },
    });
  };

  const renderUsers = () => {
    return (
      <Slide direction="left" in={showUsers} mountOnEnter unmountOnExit>
        <Grid container justify="center">
          <TableContainer component={Paper} className={classes.table}>
            <Table
              stickyHeader
              className={classes.table}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">
                    <Tooltip title="Hide users">
                      <IconButton onClick={handleClick} size="small">
                        <Avatar className={classes.icon} sizes="small">
                          <KeyboardArrowRightIcon color="primary" />
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                    Users
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {/* <SettingsIcon /> */}
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.users.map((user) => (
                  <StyledTableRow key={user}>
                    {props.username === user || user === props.manager ? (
                      <TableCell
                        component="th"
                        scope="row"
                        align="center"
                        colSpan={2}
                      >
                        {user}{" "}
                        {props.username === user ? (
                          <b> (me)</b>
                        ) : (
                          <b> (manager)</b>
                        )}
                      </TableCell>
                    ) : (
                      <TableCell component="th" scope="row" align="center">
                        {user}
                      </TableCell>
                    )}
                    {props.username === user ||
                    user === props.manager ? null : (
                      <TableCell component="th" scope="row" align="center">
                        <ButtonGroup
                          color="primary"
                          aria-label="outlined primary button group"
                          disableElevation
                        >
                          {props.userPrivileges.indexOf(
                            "Remove user from project"
                          ) !== -1 ? (
                            user === props.manager ? null : (
                              <Confirmation
                                title="Delete Confirmation!"
                                tooltip="Remove"
                                description={
                                  <div>
                                    {"Are you sure you want to delete "}{" "}
                                    <strong>{user}</strong> {"?"}
                                  </div>
                                }
                                variant="text"
                                onConfirm={() => deleteUser(user)}
                              >
                                <DeleteForeverIcon className={classes.delBtn} />
                              </Confirmation>
                            )
                          ) : null}
                          {props.projectDetails.manager === props.username ? (
                            user === props.manager ? null : (
                              <Link
                                to={{
                                  pathname: "/change-user-role",
                                  state: { modifiedUser: user },
                                }}
                                className={classes.link}
                              >
                                <Tooltip title="Change user role">
                                  <IconButton>
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                              </Link>
                            )
                          ) : null}
                        </ButtonGroup>
                      </TableCell>
                    )}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container item lg={12}>
            <Grid container item justify="center">
              <Box mt={2}>
                {props.userPrivileges.indexOf("Add user to project") !== -1 ? (
                  <Link to="/add-user" className={classes.link}>
                    <Button variant="contained" color="primary">
                      Add user <AddIcon />
                    </Button>
                  </Link>
                ) : null}
              </Box>
            </Grid>
            <Grid container item justify="center">
              <Box mt={5}>
                {props.projectDetails.manager === props.username ? (
                  <Link to="/roles" className={classes.link}>
                    <Button variant="contained" color="primary">
                      Roles manager
                    </Button>
                  </Link>
                ) : null}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Slide>
    );
  };
  const renderUsersShowBtn = () => {
    if (!showUsers)
      return (
        <Slide direction="left" in={!showUsers} mountOnEnter unmountOnExit>
          <Grid container justify="flex-end">
            <Button color="primary" variant="contained" onClick={handleClick}>
              <KeyboardArrowLeftIcon />
              Show Users
            </Button>
          </Grid>
        </Slide>
      );
  };
  return (
    <div className={classes.rootDiv}>
      {renderUsersShowBtn()} {renderUsers()}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    token: state.auth.token,
    loadingUsers: state.users.loading,
    selectedProject: state.projects.selectedProject,
    projectDetails: state.projectDetails.projectDetails,
    users: state.users.projectUsers,
    userPrivileges: state.changeUserRole.userPrivileges.map((p) => p.name),
    manager: state.projectDetails.projectDetails.manager,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchUsers: (pID, token) =>
      dispatch(usersActions.fetchProjectUsers(pID, token)),
    onRemoveUser: (pID, username, token) =>
      dispatch(usersActions.removeUserFromProject(pID, username, token)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Users));
