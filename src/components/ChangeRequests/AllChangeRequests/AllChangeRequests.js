import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Grid, Tab, Tabs, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import * as myArtifactChangeRequestsActions from "../../../store/actions/myArtifactChangeRequests";
import ArtifactChangeRequests from "./ArtifactChangeRequests";
import TraceabilityChangeRequests from "./TraceabilityChangeRequests";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: theme.spacing(5),
    width: "100%",
  },
  table: {
    minWidth: 600,
    maxHeight: 300,
  },
  link: {
    textDecoration: "none",
  },
  delBtn: {
    color: "red",
  },
  paper: {
    // marginTop: theme.spacing(3),
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
  redBtn: {
    color: "red",
  },
  tab: {
    marginTop: 1,
  },
}));
function AllChangeRequests(props) {
  const classes = useStyles();

  const [tabValue, setTabValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [changes, setChanges] = React.useState("");

  //   const handleClose = () => {
  //     setOpen(false);
  //     setRejectReason("");
  //   };
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleArtifactRequestsChange = () => {
    setChanges("Artifact change requests");
  };
  const handleTraceabilityRequestsChange = () => {
    setChanges("Traceability change requests");
  };

  const resetChanges = () => {
    setChanges("");
  };

  const displayChangeRequests = () => {
    if (
      props.userPrivileges.indexOf(
        "View, accept, and reject change request"
      ) !== -1
    ) {
      return (
        <Grid item lg={12}>
          <Typography
            component="h1"
            variant="h4"
            className={classes.header}
            align="center"
          >
            Incoming Change Requests
          </Typography>
          <Paper square>
            <Tabs
              value={tabValue}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleTabChange}
              aria-label="disabled tabs example"
              className={classes.paper}
            >
              <Tab label="Artifact Requests" />
              <Tab label="Traceability Links Requests" />
            </Tabs>
          </Paper>
          {tabValue === 0 ? (
            <ArtifactChangeRequests />
          ) : (
            <TraceabilityChangeRequests />
          )}
        </Grid>
      );
    } else return null;
  };

  return <div className={classes.root}>{displayChangeRequests()}</div>;
}

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    token: state.auth.token,
    userPrivileges: state.changeUserRole.userPrivileges.map((p) => p.name),
    artifactTypes: state.artifactTypes.artifactTypes,
    selectedProject: state.projects.selectedProject,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchMyArtifactChangeRequests: (projectID, token) =>
      dispatch(
        myArtifactChangeRequestsActions.fetchMyArtifactChangeRequests(
          projectID,
          token
        )
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllChangeRequests);
