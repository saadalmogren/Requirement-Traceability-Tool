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
  Fade,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { default as TraceabilityLinkIcon } from "@material-ui/icons/SettingsEthernet";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import { HashLink as Link } from "react-router-hash-link";
import Confirmation from "../components/Confirmation/Confirmation";
import { connect } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Copyright from "../components/Copyright/Copyright";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import * as artifactTypesActions from "../store/actions/artifactTypes";
import * as traceabilityLinkTypesActions from "../store/actions/traceabilityLinkTypes";
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

const predefienedTypes = [
  "Activity diagram",
  "Analysis class diagram",
  "Business need",
  "Class",
  "Deployment diagram",
  "Design Class diagram",
  "Feature",
  "Method",
  "Requirement",
  "Sequence diagram",
  "Source",
  "Test case",
  "Use case",
  "User interface",
];
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  table: {
    minWidth: 600,
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
  Alert: {
    marginBottom: theme.spacing(2),
  },
  formControl: {
    minWidth: 200,
  },
  miniTraceabilityLink: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(2),
  },
  disabledLink: {
    cursor: "default",
  },
}));

const modifyArtifactType = (type) => {
  console.log("Modifing type: ", type);
};

function ArtifactTypes(props) {
  const classes = useStyles();
  const [dependency, setDependency] = useState({
    artifactType: "",
    traceabilityLinkTypes: [],
    valid: false,
  });
  const [firstArtifactType, setFirstArtifactType] = useState("");
  const [secondArtifactType, setSecondArtifactType] = useState("");
  const [traceabilityLinkType, setTraceabilityLinkType] = useState("");
  const [enabledLink, setEnabledLink] = useState(false);

  useEffect(() => {
    props.onFetchArtifactTypes(props.selectedProject.id, props.token);
    props.onFetchTraceabilityLinkTypes(props.selectedProject.id, props.token);
    setDependency({
      artifactType: "",
      traceabilityLinkTypes: [],
      valid: false,
    });
  }, []);

  const handleTraceabilityLinkType = () => {
    setEnabledLink(!enabledLink);
  };
  const handleFirstArtifactChange = (e) => {
    setFirstArtifactType(e.target.value);
  };
  const handleSecondArtifactChange = (e) => {
    setSecondArtifactType(e.target.value);
  };
  const swapArtifactTypes = () => {
    const temp = firstArtifactType;
    setFirstArtifactType(secondArtifactType);
    setSecondArtifactType(temp);
  };

  const checkDependency = (typeID) => {
    var valid = true;
    const artifactTypeName = props.artifactTypes.find(
      (aType) => aType.id === typeID
    ).name;

    const type = props.traceabilityLinkTypes.filter(
      (t) =>
        t.first_artifact_type === artifactTypeName ||
        t.second_artifact_type === artifactTypeName
    );
    if (type.length > 0)
      setDependency({
        artifactType: artifactTypeName,
        traceabilityLinkTypes: type,
        valid: true,
      });
    if (type.length > 0) valid = false;

    return valid;
  };

  const deleteArtifactType = (typeID, name) => {
    if (!checkDependency(typeID)) return;
    console.log("Deleting type: ", typeID);

    props.onRemoveArtifactType(props.selectedProject.id, typeID, props.token);

    props.history.replace("/artifact-types", {
      ...props.history.state,
      alert: {
        name: name,
        msg: "The artifact type has been deleted successfully!",
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
          <strong>{dependency.artifactType}</strong> has a dependency on the
          following Traceability Link Types:{" "}
          <strong>
            {dependency.traceabilityLinkTypes.map((t, index) => (
              <React.Fragment>
                {index + 1 + "- "}
                <Link to={"/traceability-link-types#" + t.name}>
                  {t.name}
                </Link>{" "}
              </React.Fragment>
            ))}
          </strong>
        </Alert>
      );
  };

  const displayMiniCreateTraceabilityLink = () => {
    if (enabledLink) {
      return (
        <Grid container component="main" justify="center">
          <Paper className={classes.miniTraceabilityLink}>
            <Grid item container justify="center" direction="row">
              <Grid item>
                <FormControl className={classes.formControl} required>
                  <InputLabel id="firstArtifact">
                    First Artifact Type
                  </InputLabel>
                  <Select
                    labelId="firstArtifact"
                    id="firstArtifactSelect"
                    value={firstArtifactType}
                    onChange={handleFirstArtifactChange}
                  >
                    {props.artifactTypes.map((artifactType) => {
                      return (
                        <MenuItem key={artifactType.id} value={artifactType}>
                          {artifactType.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <Tooltip title="Swap artifacts">
                  <IconButton onClick={swapArtifactTypes}>
                    <SwapHorizIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <FormControl className={classes.formControl} required>
                  <InputLabel id="secondArtifact">
                    Second Artifact Type
                  </InputLabel>
                  <Select
                    labelId="secondArtifact"
                    id="secondArtifactSelect"
                    value={secondArtifactType}
                    onChange={handleSecondArtifactChange}
                  >
                    {props.artifactTypes.map((artifactTypes) => {
                      return (
                        <MenuItem key={artifactTypes.id} value={artifactTypes}>
                          {artifactTypes.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <Tooltip title="Create Traceability Link Type">
                  <span>
                    <Link
                      className={
                        firstArtifactType && secondArtifactType
                          ? classes.link
                          : classes.disabledLink
                      }
                      to={
                        firstArtifactType && secondArtifactType
                          ? {
                              pathname: "/create-traceability-link-type",
                              state: {
                                firstArtifactType: firstArtifactType,
                                secondArtifactType: secondArtifactType,
                              },
                            }
                          : ""
                      }
                    >
                      <IconButton
                        color="primary"
                        disabled={!firstArtifactType || !secondArtifactType}
                        disableFocusRipple
                        disableRipple
                        disablePadding
                      >
                        <AddIcon
                          color={
                            !firstArtifactType || !secondArtifactType
                              ? "disabled"
                              : "primary"
                          }
                          size="smalle"
                        />
                      </IconButton>
                    </Link>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      );

      //     <Link
      //           to={{
      //             pathname: "/create-traceability-link",
      //             state: {
      //               artifact: selected,
      //             },
      //           }}
      //         >
      // </Link>
    }
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
              Artifact Types
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
                      Artifact Types
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Artifact Description
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {/* <SettingsIcon /> */}
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.artifactTypes.map((type, index) => (
                    <StyledTableRow key={type.id}>
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
                            "Modify artifact type"
                          ) !== -1 ? (
                            <Link
                              to={{
                                pathname: "/modify-artifact-type",
                                state: {
                                  type: type.name,
                                  description: type.description,
                                  id: type.id,
                                },
                              }}
                              className={classes.link}
                            >
                              <Tooltip title="Modify">
                                <IconButton
                                  variant="text"
                                  onClick={() => modifyArtifactType(type.id)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            </Link>
                          ) : null
                        ) : null}
                        {!predefienedTypes.includes(type.name) ? (
                          props.userPrivileges.indexOf(
                            "Remove artifact type"
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
                                deleteArtifactType(type.id, type.name)
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
              {displayMiniCreateTraceabilityLink()}
              <Box mt={2} mr={2}>
                {props.userPrivileges.indexOf(
                  "Define new traceability link type"
                ) !== -1 ? (
                  <Tooltip title="Traceability Link Type">
                    <Button
                      variant="outlined"
                      onClick={handleTraceabilityLinkType}
                    >
                      <TraceabilityLinkIcon />
                    </Button>
                  </Tooltip>
                ) : null}
              </Box>
              <Box mt={2}>
                {props.userPrivileges.indexOf("Define new artifact type") !==
                -1 ? (
                  <Link to="/create-artifact-type" className={classes.link}>
                    <Button variant="contained" color="primary">
                      Create New Artifact Type <AddIcon />
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
    artifactTypes: state.artifactTypes.artifactTypes,
    traceabilityLinkTypes: state.traceabilityLinkTypes.traceabilityLinkTypes,
    selectedProject: state.projects.selectedProject,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onRemoveArtifactType: (pID, artifactTypeID, token) =>
      dispatch(
        artifactTypesActions.removeArtifactTypeFromProject(
          pID,
          artifactTypeID,
          token
        )
      ),
    onFetchArtifactTypes: (pID, token) =>
      dispatch(artifactTypesActions.fetchArtifactTypes(pID, token)),
    onFetchTraceabilityLinkTypes: (pID, token) =>
      dispatch(
        traceabilityLinkTypesActions.fetchTraceabilityLinkTypes(pID, token)
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ArtifactTypes);
