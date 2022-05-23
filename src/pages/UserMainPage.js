import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import Copyright from "../components/Copyright/Copyright";
import Avatar from "@material-ui/core/Avatar";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ProjectsList from "../components/Projects/ProjectsList";
import { connect } from 'react-redux';
const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
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
  paperUsername: {
    padding: theme.spacing(1)
  }
}));

function UserMainPage(props) {
  const classes = useStyles();

  return (
    <div>
      <Grid container className={classes.root}>
        <Grid item lg={2}></Grid>
        <Grid container lg={8}>
          <Grid xs={1}>
            <Avatar className={classes.avatar}>
              <AccountCircleIcon />
            </Avatar>
          </Grid>

          <Grid item xs={2}>
            <Typography align='left'><strong>Username: </strong>{props.username}</Typography>


          </Grid>
        </Grid>
        <Grid item lg={2}></Grid>
        <Grid item lg={2}></Grid>
        <Grid item lg={8}>
          <ProjectsList />
        </Grid>
        <Grid item lg={2}></Grid>
      </Grid>
      <Copyright />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    username: state.auth.username,
    email: state.auth.email,
  };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserMainPage);