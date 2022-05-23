import React, { useEffect, useState } from "react";
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
  Tooltip,
  Typography,
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import { HashLink as Link } from "react-router-hash-link";
import Fade from "@material-ui/core/Fade";
import Confirmation from "../components/Confirmation/Confirmation";
import { connect } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Copyright from "../components/Copyright/Copyright";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import * as traceabilityLinkTypesActions from "../store/actions/traceabilityLinkTypes";
import * as traceabilityLinksActions from "../store/actions/traceabilityLinks";
import { Alert, AlertTitle } from "@material-ui/lab";

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
    minWidth: 600,
    maxHeight: 520,
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
  Alert: {
    marginBottom: theme.spacing(2),
  },
}));

function TraceabilityLinkTypes(props) {
  const classes = useStyles();
  const [dependency, setDependency] = useState({
    traceabilityType: "",
    traceabilityLinks: [],
    valid: false,
  });

  const predefienedTypes = [
    "Depends on",
    "Is verified by",
    "Is origin of",
    "Is satisfied by",
    "Is implemented in",
  ];

  const checkDependency = (typeID) => {
    var valid = true;
    const traceabilityType = props.traceabilityLinkTypes.find(
      (tType) => tType.id === typeID
    );
    const traceabilityTypeName = traceabilityType.name;

    const dependents = props.traceabilityLinks.filter(
      (t) => t.traceability_Link_Type === traceabilityTypeName
    );
    if (dependents.length > 0)
      setDependency({
        traceabilityType: traceabilityType,
        traceabilityLinks: dependents,
        valid: true,
      });
    if (dependents.length > 0) valid = false;

    return valid;
  };

  useEffect(() => {
    props.onFetchTraceabilityLinkTypes(props.selectedProject.id, props.token);
    props.onFetchTraceabilityLinks(props.selectedProject.id, props.token);
  }, []);

  const deleteTraceabilityType = (typeID, name) => {
    if (!checkDependency(typeID)) return;

    console.log("Deleting type: ", typeID);
    props.onRemoveTraceabilityLinkType(
      props.selectedProject.id,
      typeID,
      props.token
    );

    props.history.replace("/traceability-link-types", {
      ...props.history.state,
      alert: {
        name: name,
        msg: "The traceability link type has been deleted successfully!",
      },
    });
  };

  const displayAlert = () => {
    if (dependency.valid)
      return (
        <Alert severity="error" className={classes.Alert}>
          <AlertTitle>Error</AlertTitle>
          Can't delete this artifact type
          <br />
          <strong>{dependency.traceabilityType.name}</strong> has a dependency
          on the following Traceability Links:{" "}
          <strong>
            {dependency.traceabilityLinks.map((t, index) => (
              <React.Fragment>
                {index + 1 + "- "}
                <Link
                  to={{
                    pathname: "/project-details",
                    hash: "#" + t.name,
                    state: { selected: dependency.traceabilityType, value: 1 },
                  }}
                >
                  {t.name}
                </Link>{" "}
              </React.Fragment>
            ))}
          </strong>
        </Alert>
      );
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
              Traceability Link Types
            </Typography>
            {displayAlert()}
            <TableContainer component={Paper} className={classes.table}>
              <Table
                className={classes.table}
                aria-label="customized table"
                stickyHeader
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">#</StyledTableCell>
                    <StyledTableCell align="left">
                      Traceability Link Types
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Traceability Link Description
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      First Artifact Type
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Second Artifact Type
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {/* <SettingsIcon /> */}
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.traceabilityLinkTypes.map((type, index) => (
                    <StyledTableRow key={type.name} id={type.name}>
                      <StyledTableCell
                        component="th"
                        scope="row"
                        align="center"
                      >
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row" align="left">
                        {type.name}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row" align="left">
                        {type.description}
                      </StyledTableCell>

                      <StyledTableCell component="th" scope="row" align="left">
                        {type.first_artifact_type}
                      </StyledTableCell>

                      <StyledTableCell component="th" scope="row" align="left">
                        {type.second_artifact_type}
                      </StyledTableCell>

                      <StyledTableCell
                        component="th"
                        scope="row"
                        align="center"
                        width="80"
                        height="80"
                        padding="checkbox"
                      >
                        {!predefienedTypes.includes(type.name) ? (
                          props.userPrivileges.indexOf(
                            "Modify traceability link type"
                          ) !== -1 ? (
                            <Link
                              to={{
                                pathname: "/modify-traceability-link-type",
                                state: {
                                  type: type.name,
                                  id: type.id,
                                  description: type.description,
                                  firstArtifact: type.first_artifact_type,
                                  secondArtifact: type.second_artifact_type,
                                },
                              }}
                              className={classes.link}
                            >
                              <Tooltip title="Modify">
                                <IconButton variant="text">
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            </Link>
                          ) : null
                        ) : null}
                        {!predefienedTypes.includes(type.name) ? (
                          props.userPrivileges.indexOf(
                            "Remove traceability link type"
                          ) !== -1 ? (
                            <Confirmation
                              title="Delete Confirmation!"
                              description={
                                <div>
                                  {"Are you sure you want to delete "}{" "}
                                  <strong>{type.name}</strong> {"?"}
                                </div>
                              }
                              variant="text"
                              onConfirm={() =>
                                deleteTraceabilityType(type.id, type.name)
                              }
                              className={classes.delBtn}
                            >
                              <DeleteForeverIcon className={classes.delBtn} />
                            </Confirmation>
                          ) : null
                        ) : null}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid container justify="flex-end">
              <Box mt={2}>
                {props.userPrivileges.indexOf(
                  "Define new traceability link type"
                ) !== -1 ? (
                  <Link
                    to="/create-traceability-link-type"
                    className={classes.link}
                  >
                    <Button variant="contained" color="primary">
                      Create New Traceability Link Type <AddIcon />
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
    userPrivileges: state.changeUserRole.userPrivileges.map((p) => p.name),
    traceabilityLinks: state.traceabilityLinks.traceabilityLinks,
    traceabilityLinkTypes: state.traceabilityLinkTypes.traceabilityLinkTypes,
    selectedProject: state.projects.selectedProject,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onRemoveTraceabilityLinkType: (pID, traceabilityLinkTypeID, token) =>
      dispatch(
        traceabilityLinkTypesActions.removeTraceabilityLinkTypeFromProject(
          pID,
          traceabilityLinkTypeID,
          token
        )
      ),
    onFetchTraceabilityLinkTypes: (pID, token) =>
      dispatch(
        traceabilityLinkTypesActions.fetchTraceabilityLinkTypes(pID, token)
      ),
    onFetchTraceabilityLinks: (pID, token) =>
      dispatch(traceabilityLinksActions.fetchTraceabilityLinks(pID, token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TraceabilityLinkTypes);
