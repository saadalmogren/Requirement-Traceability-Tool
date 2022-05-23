import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  withStyles,
  TableCell,
  Grid,
  Box,
  IconButton,
  Avatar,
  Fade,
  CssBaseline,
} from "@material-ui/core";
import React, { useEffect } from "react";

// import SettingsIcon from "@material-ui/icons/Settings";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import * as myArtifactChangeRequestsActions from "../store/actions/myArtifactChangeRequests";
import * as artifactChangeRequestsActions from "../store/actions/artifactChangeRequests";
import { connect } from "react-redux";
import Confirmation from "../components/Confirmation/Confirmation";
import Copyright from "../components/Copyright/Copyright";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AllRequestsHistory from "../components/RequestsHistory/AllRequestsHistory/AllRequestsHistory";
import MyRequestsHistory from "../components/RequestsHistory/MyRequestsHistory/MyRequestsHistory";
import * as notificationsActions from '../store/actions/notifications';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
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
    marginTop: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
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
function ChangeRequestsHistory(props) {
  const classes = useStyles();

  useEffect(() => {
    props.onFetchMyArtifactChangeRequests(
      props.selectedProject.id,
      props.token
    );
  }, []);

  useEffect(()=>{
    if(!(props.projectDetails.manager === props.username || props.userPrivileges.map((p) => p.name).indexOf("View, accept, and reject change request") != -1)){
      props.notifications.map((notification)=>{
        props.onDeleteNotification(notification.id,props.selectedProject.id,props.token)
      })
    }
  },[]);

  return (
    <Fade in={true}>
      <Grid
        container
        component="main"
        justify="center"
        className={classes.root}
      >
        <Grid container item lg={2} justify="center" alignItems="baseline">
          <IconButton onClick={() => props.history.push("/change-requests")}>
            <Avatar className={classes.backIcon}>
              <ArrowBackIcon fontSize="large" />
            </Avatar>
          </IconButton>
        </Grid>
        <Grid container item lg={8} justify="center">
          <CssBaseline />
          <div className={classes.paper}>
            <Typography component="h1" variant="h4" className={classes.header}>
              Change Requests History
            </Typography>
            {props.userPrivileges.indexOf(
              "View, accept, and reject change request"
            ) !== -1 ? (
              <AllRequestsHistory />
            ) : (
              <MyRequestsHistory />
            )}
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
    selectedProject: state.projects.selectedProject,
    artifactChangeRequests: state.artifactChangeRequests.artifactChangeRequests,
    myArtifactChangeRequests:
      state.myArtifactChangeRequests.myArtifactChangeRequests,
    notifications: state.notifications.notifications,  
    projectDetails: state.projectDetails.projectDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchArtifactChangeRequests: (projectID, token) =>
      dispatch(
        artifactChangeRequestsActions.fetchArtifactChangeRequests(
          projectID,
          token
        )
      ),
    onFetchMyArtifactChangeRequests: (projectID, token) =>
      dispatch(
        myArtifactChangeRequestsActions.fetchMyArtifactChangeRequests(
          projectID,
          token
        )
      ),
    onDeleteNotification: (notifyId,projectID,token) =>
      dispatch(notificationsActions.deleteNotification(notifyId,projectID,token)),  
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeRequestsHistory);
