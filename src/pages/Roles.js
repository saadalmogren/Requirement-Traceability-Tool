import React, { useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {
  Box,
  Button,
  Fade,
  Grid,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import { Link, withRouter } from "react-router-dom";
import Confirmation from "../components/Confirmation/Confirmation";
import { connect } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Copyright from "../components/Copyright/Copyright";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import * as rolesActions from "../store/actions/roles";
// import SocketIO from "../components/SocketIO/SocketIO";

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
      backgroundColor: theme.palette.grey[100],
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  table: {
    minWidth: 500,
    maxHeight: 600,
  },
  link: {
    textDecoration: "none",
  },
  delBtn: {
    color: "red",
  },
  paper: {
    marginTop: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  backIcon: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  rootContent: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  header: {
    marginBottom: theme.spacing(2),
  },
}));

function Roles(props) {
  const classes = useStyles();
  const [redirect, setRedirect] = React.useState({ path: "", state: {} });

  useEffect(() => {
    // SocketIO.on("message", (msg) => {
    //   if (msg.update)
    //     if (msg.update === "Role") {
    //       props.onFetchRoles(props.selectedProject.id, props.token);
    //     }
    // });
    props.onFetchRoles(props.selectedProject.id, props.token);
  }, []);

  const deleteRole = (roleName) => {
    console.log("Deleting Role: ", roleName);
    props.onRemoveRole(props.selectedProject.id, roleName, props.token);
    props.history.replace("/roles", {
      alert: {
        name: roleName,
        msg: "The role has been deleted successfully!",
      },
    });
  };

  const modifyRole = (roleName) => {
    console.log("Modifing role: ", roleName);
  };

  return (
    <Fade in={true}>
      <Grid
        container
        component="main"
        justify="center"
        className={classes.root}
      >
        <Grid container item lg={2} justify="center" alignItems="baseline">
          <IconButton onClick={() => props.history.push("/project-details")}>
            <Avatar className={classes.backIcon}>
              <ArrowBackIcon fontSize="large" />
            </Avatar>
          </IconButton>
        </Grid>
        <Grid container item lg={8} justify="center">
          <CssBaseline />
          <div className={classes.paper}>
            <Typography component="h1" variant="h4" className={classes.header}>
              Roles
            </Typography>
            <TableContainer component={Paper} className={classes.table}>
              <Table
                className={classes.table}
                aria-label="customized table"
                stickyHeader
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">#</StyledTableCell>
                    <StyledTableCell align="center">
                      Project Roles
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {/* <SettingsIcon /> */}
                    </StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {props.roles.length == 0 ? (
                    <TableRow>
                      <StyledTableCell align="center">#</StyledTableCell>
                      <StyledTableCell align="center">
                        Project Roles
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {/* <SettingsIcon /> */}
                      </StyledTableCell>
                    </TableRow>
                  ) : null}
                </TableBody>

                <TableBody>
                  {props.roles.length == 0 ? (
                    <TableRow>
                      <StyledTableCell
                        component="th"
                        scope="row"
                        align="center"
                        colSpan={3}
                      >
                        <Typography align="center">
                          The project does not have any roles!
                        </Typography>
                      </StyledTableCell>
                    </TableRow>
                  ) : (
                    props.roles.map((role, index) => (
                      <StyledTableRow key={role.name}>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          align="center"
                        >
                          {index + 1}
                        </StyledTableCell>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          align="center"
                          colSpan={role.name == "Project Manager" ? 2 : null}
                        >
                          {role.name}
                        </StyledTableCell>

                        {role.name == "Project Manager" ? null : (
                          <StyledTableCell
                            component="th"
                            scope="row"
                            align="center"
                            width="80"
                            height="80"
                            padding="checkbox"
                          >
                            {props.projectDetails.manager === props.username ? (
                              <Link
                                to={{
                                  pathname: "/modify-role",
                                  state: {
                                    name: role.name,
                                    id: role.id,
                                  },
                                }}
                                className={classes.link}
                              >
                                <Tooltip title="Modify">
                                  <IconButton
                                    variant="text"
                                    onClick={() => modifyRole(role.name)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                              </Link>
                            ) : null}
                            {props.projectDetails.manager === props.username ? (
                              <Confirmation
                                title="Delete Confirmation!"
                                description={
                                  <div>
                                    {"Are you sure you want to delete "}
                                    <strong>{role.name}</strong> {"?"}
                                  </div>
                                }
                                variant="text"
                                onConfirm={() => deleteRole(role.name)}
                                className={classes.delBtn}
                              >
                                <DeleteForeverIcon className={classes.delBtn} />
                              </Confirmation>
                            ) : null}
                          </StyledTableCell>
                        )}
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid container justify="flex-end">
              <Box mt={2}>
                {props.projectDetails.manager === props.username ? (
                  <Link to="/create-role" className={classes.link}>
                    <Button variant="contained" color="primary">
                      Create New Role <AddIcon />
                    </Button>
                  </Link>
                ) : null}
              </Box>
            </Grid>
          </div>
        </Grid>
        <Grid item lg={2}></Grid>

        <Box mt={8}>
          <Copyright />
        </Box>
      </Grid>
    </Fade>
  );
}

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    token: state.auth.token,
    selectedProject: state.projects.selectedProject,
    users: state.users.projectUsers,
    roles: state.roles.projectRoles,
    userPrivileges: state.changeUserRole.userPrivileges.map((p) => p.name),
    projectDetails: state.projectDetails.projectDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchRoles: (pID, token) =>
      dispatch(rolesActions.fetchProjectRoles(pID, token)),
    onRemoveRole: (pID, roleName, token) =>
      dispatch(rolesActions.removeRoleFromProject(pID, roleName, token)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Roles));
