import React, { useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
  Box,
  Button,
  Fade,
  Grid,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { connect } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Copyright from "../components/Copyright/Copyright";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import SentChangeRequests from "../components/ChangeRequests/MyChangeRequests/MyArtifactChangeRequests";
import ArtifactChangeRequests from "../components/ChangeRequests/AllChangeRequests/ArtifactChangeRequests";
import TraceabilityChangeRequests from "../components/ChangeRequests/AllChangeRequests/TraceabilityChangeRequests";
import * as myArtifactChangeRequestsActions from "../store/actions/myArtifactChangeRequests";
import { Link } from "react-router-dom";
import MyChangeRequests from "../components/ChangeRequests/MyChangeRequests/MyChangeRequests";
import AllChangeRequests from "../components/ChangeRequests/AllChangeRequests/AllChangeRequests";
import * as notificationsActions from '../store/actions/notifications';

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

function ChangeRequests(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [deletedRequest, setDeletedRequest] = React.useState("");
  const [rejectReason, setRejectReason] = React.useState("");
  const [tabValue, setTabValue] = React.useState(0);
  const [changes, setChanges] = React.useState("");

  useEffect(()=>{
    if(props.projectDetails.manager === props.username || props.userPrivileges.map((p) => p.name).indexOf("View, accept, and reject change request") != -1){
      props.notifications.map((notification)=>{
        props.onDeleteNotification(notification.id,props.selectedProject.id,props.token)
      })
    }
  },[]);

  const handleRejectInput = (event) => {
    setRejectReason(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
    setRejectReason("");
  };
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  // const handleReject = () => {
  //   handleClose();
  //   console.log(
  //     "Rejected request:",
  //     deletedRequest,
  //     ", Reason: ",
  //     rejectReason
  //   );
  //   setRejectReason("");
  // };

  const handleArtifactRequestsChange = () => {
    setChanges("Artifact change requests");
  };
  const handleTraceabilityRequestsChange = () => {
    setChanges("Traceability change requests");
  };

  const resetChanges = () => {
    setChanges("");
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
            {/* <SentChangeRequests changes={changes} onReset={resetChanges} /> */}
            <MyChangeRequests />

            <AllChangeRequests />
            <Grid container item justify="flex-end">
              <Box mt={3}>
                <Link to="change-requests-history" className={classes.link}>
                  <Button
                    variant="contained"
                    color="primary"
                    to="/change-requests-history"
                  >
                    Change Requests History
                  </Button>
                </Link>
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
    selectedProject: state.projects.selectedProject,
    notifications: state.notifications.notifications,
    projectDetails: state.projectDetails.projectDetails,
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
    onDeleteNotification: (notifyId,projectID,token) =>
      dispatch(notificationsActions.deleteNotification(notifyId,projectID,token)),  
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeRequests);
