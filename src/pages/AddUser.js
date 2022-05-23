import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Copyright from "../components/Copyright/Copyright";
import React, { useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Fade, Grid, IconButton } from "@material-ui/core";
import * as usersActions from "../store/actions/Users";
import Users from "../components/ProjectDetails/Users";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  backIcon: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function AddUser(props) {
  const classes = useStyles();
  const [username, setUsername] = useState({ value: "", valid: false });
  const [error, setError] = useState("");
  const [submit, setSubmit] = useState(false);

  if (props.userPrivileges.indexOf("Add user to project") === -1) {
    console.error("You don't have the right PRIVILEGES");
    props.history.push("/project-details");
  }
  const usernameInputHandler = (event) => {
    const textValue = event.target.value;
    if (textValue === "") {
      setUsername({ value: textValue, valid: false });
    } else {
      setUsername({ value: textValue, valid: true });
    }
  };

  const handleSumbit = (e) => {
    e.preventDefault();

    props.onAddUser(props.selectedProject.id, username.value, props.token);
    if (props.users.indexOf(username.value) !== -1) {
      setError("User already exists in the project!");
    } else {
      setError("");
    }
    setSubmit(true);
    // if (!props.isUserExist && !props.loading) {
    //   props.history.push("/project-details");

    // }
  };
  const handleRedirect = () => {
    if (submit)
      if (!props.loading)
        if (!props.isUserExist && !error)
          props.history.push("/project-details", {
            alert: {
              name: username.value,
              msg: "The user has been added successfully!",
            },
          });
  };

  // useEffect(() => {
  //   props.onLoadAddUser();
  // }, [props.onLoadAddUser]);

  // useEffect(() => {
  //   if (!props.isUserExist&&!props.loading) {
  //     props.history.push('/project-details');
  //   }
  // },[props.isUserExist,props.loading])

  return (
    <Fade in={true}>
      <Grid
        container
        component="main"
        justify="center"
        className={classes.root}
      >
        <Grid container item lg={2} justify="center" alignItems="baseline">
          <IconButton onClick={() => props.history.goBack()}>
            <Avatar className={classes.backIcon}>
              <ArrowBackIcon fontSize="large" />
            </Avatar>
          </IconButton>
        </Grid>
        <Grid container item lg={8} justify="center">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <AddIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Add User
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleSumbit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="off"
                autoFocus
                onChange={usernameInputHandler}
                value={username.value}
                error={props.isUserExist ? props.isUserExist : error}
                helperText={
                  error
                    ? error
                    : props.isUserExist
                    ? "User doesn't exists in the system!"
                    : ""
                }
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={!username.valid}
              >
                Add
              </Button>
            </form>
          </div>
        </Grid>
        {handleRedirect()}
        <Grid item lg={2}></Grid>

        <Box mt={8}>
          <Copyright />
        </Box>
      </Grid>
    </Fade>
  );
}

const mapStateToProps = (state) => {
  // console.log("State: ", state);
  return {
    username: state.auth.username,
    token: state.auth.token,
    selectedProject: state.projects.selectedProject,
    projectDetails: state.projectDetails.projectDetails,
    isUserExist: state.users.isUserExist,
    loading: state.users.loading,
    users: state.users.projectUsers,
    userPrivileges: state.changeUserRole.userPrivileges.map((p) => p.name),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddUser: (pID, username, token) =>
      dispatch(usersActions.addUserToProject(pID, username, token)),
    onLoadAddUser: () => dispatch(usersActions.addUserStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddUser);
