import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Grid, Typography, Button, } from '@material-ui/core';
import { connect } from 'react-redux';
import * as notificationsActions from '../../store/actions/notifications';
import { withRouter } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
      width: '100%'
    },

  },
  paper: {
    padding: 30,
    margin: '20px 0px',
    width: '100%'
  },
  accountButton: {
    marginLeft: theme.spacing(2),

  },
  span: {
    fontWeight: 'bold',
    marginLeft: 10
  },
  rateSection: {

    marginTop: 10,
    marginBottom: 10
  }
}));

function Rating(props) {
    

    const classes = useStyles();

    

  return (
    <div className={classes.root}>
      <Paper variant="outlined"  className={classes.paper}>

        <Grid container spacing={1}>
          
          <Grid item lg={8}>
            <Typography variant="h5">{props.projectDetails.manager === props.username || props.userPrivileges.map((p) => p.name).indexOf("View, accept, and reject change request") != -1 ? 'You recevie a new change request!' : 'Your change request has been processed'}</Typography>
          </Grid>

          
            <Grid item lg={4}>
              <Button
                 variant="contained"
                 color="primary"
                edge="start"
                className={classes.accountButton}
                aria-label="open drawer"
                onClick={()=> {
                  props.projectDetails.manager === props.username || props.userPrivileges.map((p) => p.name).indexOf("View, accept, and reject change request") != -1 ? 
                  props.history.push("/change-requests") : props.history.push("/change-requests-history");
                  props.onDeleteNotification(props.notification.id,props.selectedProject.id,props.token);
                }}
              >
                view request
              </Button>
              <Button
                 variant="contained"
                 color="secondary"
                edge="start"
                className={classes.accountButton}
                aria-label="open drawer"
                onClick={()=> props.onDeleteNotification(props.notification.id,props.selectedProject.id,props.token)}
              >
                Dismiss Notification
              </Button>
            </Grid> 
          

        </Grid>


      </Paper>
    </div>
  );
}


const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    username: state.auth.username,
    loading: state.notifications.loading,
    selectedProject: state.projects.selectedProject,
    token: state.auth.token,
    projectDetails: state.projectDetails.projectDetails,
    userPrivileges: state.changeUserRole.userPrivileges,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onDeleteNotification: (notifyId,projectID,token) =>
      dispatch(notificationsActions.deleteNotification(notifyId,projectID,token)),

  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Rating));
