import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Grid, Tab, Tabs, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import * as myArtifactChangeRequestsActions from "../../../store/actions/myArtifactChangeRequests";
import MyArtifactChangeRequests from "./MyArtifactChangeRequests";
import MyTraceabilityChangeRequests from "./MyTraceabilityChangeRequests";
import { withRouter } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // padding: theme.spacing(3),
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

function MyChangeRequests(props) {
  const classes = useStyles();

  const [tabValue, setTabValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [changes, setChanges] = React.useState("");

  useEffect(() => {
    if (props.location.state && props.location.state.tableValue)
      setTabValue(props.location.state.tableValue);
  }, []);

  //   const handleClose = () => {
  //     setOpen(false);
  //     setRejectReason("");
  //   };
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    props.history.replace("/change-requests", {
      ...props.location.state,
      tableValue: newValue,
    });
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
      ) === -1 ||
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
            My Change Requests
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
          {
            tabValue === 0 ? (
              <MyArtifactChangeRequests />
            ) : (
              <MyTraceabilityChangeRequests />
            )
            // <MyTraceabilityChangeRequests
            //   onChange={handleTraceabilityRequestsChange}
            // />
          }
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MyChangeRequests)
);
