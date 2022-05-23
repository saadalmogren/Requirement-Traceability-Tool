import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Fade,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";
import Copyright from "../components/Copyright/Copyright";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ArtifactsTable from "../components/ProjectDetails/ArtifactsTable";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Users from "../components/ProjectDetails/Users";
import TraceabilityTable from "../components/ProjectDetails/TraceabilityTable";
import * as projectDetailsActions from "../store/actions/projectDetails";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as changeUserRoleActions from "../store/actions/changeUserRole";
import * as traceabilityLinksActions from "../store/actions/traceabilityLinks";
import * as artifactsActions from "../store/actions/artifacts";
import * as notificationsActions from "../store/actions/notifications";
import * as projectsActions from "../store/actions/projectActions";

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  root: {
    flexGrow: 1,
    paddingTop: theme.spacing(3),
  },
  divRoot: {
    width: "100%",
  },
  button: {
    margin: 10,
  },
  image: {
    marginTop: 20,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  backIcon: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  projectInfo: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    width: "100%",
  },
  link: {
    textDecoration: "none",
  },

  maxHeight: {
    flexGrow: 1,
    [theme.breakpoints.up("lg")]: {
      height: "101.5%",
    },
    [theme.breakpoints.down("md")]: {
      margin: theme.spacing(3),
    },
  },
}));

function ProjectDetails(props) {
  const classes = useStyles();

  const [value, setValue] = React.useState(
    props.location.state
      ? props.location.state.value
        ? props.location.state.value
        : 0
      : 0
  );

  // handle user force to enter link
  if (!props.selectedProject) props.history.goBack();

  useEffect(() => {
    props.onFetchProjectsDetails(props.selectedProject.id, props.token);
    props.onFetchUserPrivileges(
      props.selectedProject.id,
      props.username,
      props.token
    );
    props.onFetchTraceabilityLinks(props.selectedProject.id, props.token);
  }, []);

  useEffect(() => {
    if (props.location.state)
      if (props.location.state.value >= 0) setValue(props.location.state.value);
  }, [props.location.state]);

  useEffect(() => {
    if (props.isAuthenticated) {
      props.onFetchNotifications(props.selectedProject.id, props.token);
    }
  }, [props.onFetchNotifications]);

  // check if user exist in project or not
  useEffect(() => {
    props.onFetchProjects(props.username, props.token);
    if (
      props.projects
        .map((project) => project.id)
        .indexOf(props.selectedProject.id) === -1
    )
      props.history.push("/main-page");
  }, [props.projects.length]);

  const handleChange = (event, newValue) => {
    props.history.replace("/project-details", { value: newValue });
    setValue(newValue);
  };

  return (
    <div className={classes.divRoot}>
      <Grid container className={classes.root}>
        <Grid container item lg={2} justify="center" alignItems="baseline">
          <IconButton onClick={() => props.history.push("/main-page")}>
            <Avatar className={classes.backIcon}>
              <ArrowBackIcon fontSize="large" />
            </Avatar>
          </IconButton>
        </Grid>
        {/* <Box mb={2}> */}
        <Grid
          container
          item
          lg={8}
          justify="center"
          spacing={1}
          alignItems="center"
        >
          {/* <Grid > */}
          <Grid item lg={3}>
            <ButtonGroup
              variant="outlined"
              color="primary"
              aria-label="text primary button group"
              size="medium"
            >
              <Button
                color="primary"
                variant="outlined"
                onClick={() => props.history.push("/artifact-types")}
              >
                Artifact Types
              </Button>
              <Button
                color="primary"
                variant="outlined"
                onClick={() => props.history.push("/traceability-link-types")}
              >
                Traceability link Types
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item lg={5}>
            <ButtonGroup
              variant="outlined"
              color="primary"
              aria-label="text primary button group"
              size="medium"
            >
              <Button
                color="primary"
                variant="outlined"
                onClick={() => props.history.push("/impact-analysis")}
              >
                Impact Analysis
              </Button>

              <Button
                color="primary"
                variant="outlined"
                onClick={() =>
                  props.history.push("/elaboration-coverage-analysis")
                }
              >
                Elaboration Coverage Analysis
              </Button>
              <Button
                color="primary"
                variant="outlined"
                onClick={() => props.history.push("/test-coverage-analysis")}
              >
                Test Coverage Analysis
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item lg={3}>
            <ButtonGroup
              variant="outlined"
              color="primary"
              aria-label="text primary button group"
              size="medium"
            >
              <Button
                color="primary"
                variant="outlined"
                onClick={() => {
                  props.history.push("/visualization");
                }}
              >
                Visualization
              </Button>
              {value === 0 ? (
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    props.onExportArtifacts(
                      props.selectedProject.id,
                      props.token
                    );
                    // props.history.push("/export-traceability-information")
                  }}
                >
                  Export Artifacts
                </Button>
              ) : (
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    props.onExportTraceabilityLinks(
                      props.selectedProject.id,
                      props.token
                    );
                    // props.history.push("/export-traceability-information")
                  }}
                >
                  Export Traceability_Links
                </Button>
              )}
            </ButtonGroup>
          </Grid>
          {/* </Grid> */}
        </Grid>
        {/* </Box> */}
        <Grid lg={2}></Grid>
        <Grid
          container
          alignItems="flex-start"
          justify="center"
          direction="row"
        >
          <Grid container item lg={2}>
            <Paper variant="outlined" className={classes.projectInfo}>
              <Grid item className={classes.projectInfo}>
                <Typography component="h1" variant="h4">
                  {props.projectDetails.name}
                </Typography>
                <Box mt={5}>
                  <Typography component="h2" variant="h6">
                    Project Description:
                  </Typography>
                  <Typography variant="body2">
                    {props.projectDetails.description}
                  </Typography>
                </Box>
              </Grid>
            </Paper>
          </Grid>
          <Grid container item lg={8}>
            <br />
            <Paper square>
              <Tabs
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
                aria-label="disabled tabs example"
              >
                <Tab label="Artifacts" />
                <Tab label="Traceability Links" />
              </Tabs>
            </Paper>

            {props.loadingProject ? (
              <Grid
                container
                justify="center"
                alignContent="center"
                alignItems="center"
              >
                <CircularProgress />
              </Grid>
            ) : value === 0 ? (
              <ArtifactsTable />
            ) : (
              <TraceabilityTable />
            )}
            {/* <Grid container justify="flex-end" item lg={12}>
              <Box mt={2}>
                <Link to="/change-requests" className={classes.link}>
                  <Button color="primary" variant="contained">
                    View Change Requests
                  </Button>
                </Link>
              </Box>
            </Grid> */}
          </Grid>

          <Grid
            container
            item
            lg={2}
            justify="flex-end"
            spacing={2}
            className={classes.maxHeight}
          >
            <Grid container justify="center" alignItems="flex-start">
              {props.projectDetails.manager === props.username ? (
                <Link to="/change-management" className={classes.link}>
                  <Button color="primary" variant="contained">
                    Change management
                  </Button>
                </Link>
              ) : null}
            </Grid>

            <Grid container item lg={11} justify="center">
              {props.loadingProject ? <CircularProgress /> : <Users />}
            </Grid>
            <Grid
              container
              justify="flex-end"
              direction="column"
              alignItems="center"
            >
              <Grid item justify="center">
                <Link to="/change-requests" className={classes.link}>
                  <Button color="primary" variant="contained">
                    View Change Requests
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box mt={2}>
        <Copyright />
      </Box>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    token: state.auth.token,
    loadingProject: state.projectDetails.loading,
    selectedProject: state.projects.selectedProject,
    projectDetails: state.projectDetails.projectDetails,
    userPrivileges: state.changeUserRole.userPrivileges,
    projects: state.projects.projects,
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchProjects: (username, token) =>
      dispatch(projectsActions.fetchProjects(username, token)),
    onFetchProjectsDetails: (pID, token) =>
      dispatch(projectDetailsActions.fetchProjectDetails(pID, token)),
    onFetchUserPrivileges: (pID, username, token) =>
      dispatch(changeUserRoleActions.fetchUserPrivileges(pID, username, token)),
    onFetchTraceabilityLinks: (pID, token) =>
      dispatch(traceabilityLinksActions.fetchTraceabilityLinks(pID, token)),
    onExportTraceabilityLinks: (pID, token) =>
      dispatch(traceabilityLinksActions.exportTraceabilityLinks(pID, token)),
    onExportArtifacts: (pID, token) =>
      dispatch(artifactsActions.exportArtifacts(pID, token)),
    onFetchNotifications: (projectID, token) =>
      dispatch(notificationsActions.fetchNotifications(projectID, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetails);
