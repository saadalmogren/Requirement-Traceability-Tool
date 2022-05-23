import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { Grid, Box, Paper, Typography, Avatar, IconButton } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import * as authActions from '../store/actions/auth';
import * as notificationsActions from '../store/actions/notifications';
import { connect } from 'react-redux';
import Copyright from "../components/Copyright/Copyright";
import Notification from '../components/Notifications/Notifications';

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    paper: {
        paddingTop: 30,
        paddingBottom: 30,
        paddingLeft: 10,
        paddingRight: 10,
        margin: '20px 0px',
        width: '100%'
    },
    title: {
        fontWeight: 'bold'
    },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        marginBottom: 100
    },
    backIcon: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
      },
}));



function NotificationsPage(props) {
    const classes = useStyles();

    useEffect(() => {
        props.onFetchNotifications(props.selectedProject.id, props.token);
    }, [props.onFetchNotifications])

    return (
        <Grid container spacing={1}>
            <Grid item lg={12} md={8} sm={9}>
                <main className={classes.content}>
                    <Toolbar />
                    <IconButton onClick={() => props.history.push("/project-details")}>
                        <Avatar className={classes.backIcon}>
                            <ArrowBackIcon fontSize="large" />
                        </Avatar>
                    </IconButton>
                    {props.isAuthenticated ?
                        (<Grid container spacing={1}>
                            <Grid item lg={2}>
                            </Grid>
                            <Grid item lg={8}>
                                <Paper className={classes.paper} elevation={10}>
                                    <Typography align="center" variant="h4" className={classes.title} >
                                        My Notifications
          </Typography>
                                    {props.numOfNotifications === 0 ? <Typography variant='h5' className={classes.empty} align='center'>You didn't receive any notification!</Typography> : null}
                                    {props.notifications.map((item) => {
                                        //item.username == props.username? null : 
                                        return <Notification notification={item} />;
                                    })}
                                </Paper>
                            </Grid>
                        </Grid>) : <Redirect to='/login' />}

                    <Grid item lg={12}>
                        <Box mt={8}>
                            <Copyright />
                        </Box>
                    </Grid>
                </main>
            </Grid>
        </Grid>
    );
}

const mapStateToProps = state => {
    return {
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        username: state.auth.username,
        notifications: state.notifications.notifications,
        numOfNotifications: state.notifications.numOfNotifications,
        selectedProject: state.projects.selectedProject,
        token: state.auth.token,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, password) =>
            dispatch(authActions.authSignIn(username, password)),
        onInit: () =>
            dispatch(authActions.authInitite()),
        onFetchNotifications: (projectID, token) =>
            dispatch(notificationsActions.fetchNotifications(projectID, token))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NotificationsPage);
