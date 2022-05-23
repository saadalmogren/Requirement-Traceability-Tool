import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Copyright from "../components/Copyright/Copyright";
import React, { useState } from "react";
import EditIcon from "@material-ui/icons/Edit";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Grid, IconButton } from "@material-ui/core";
import { connect } from "react-redux";
import * as projectActions from "../store/actions/projectActions";
import { UserInputValidation } from "../components/Validation/UserInputValidation";

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

function ModifyProject(props) {
  const classes = useStyles();
  const oldProject = props.location.state
    ? props.location.state.projectName
    : "";
  const oldDescription = props.location.state
    ? props.location.state.projectDescription
    : "";
  const id = props.location.state ? props.location.state.projectID : "";
  const [name, setname] = useState({ value: oldProject, valid: false });
  const [description, setdescription] = useState({
    value: oldDescription,
    valid: false,
  });
  const [submit, setSubmit] = useState(false);

  const nameInputHandler = (event) => {
    const textValue = event.target.value;
    if (textValue === "") {
      setname({ value: textValue, valid: false });
    } else {
      if (UserInputValidation(textValue).check)
        setname({ value: textValue, valid: true });
      else
        setname({
          value: textValue,
          valid: false,
          error: UserInputValidation(textValue).error,
        });
    }
  };

  const descriptionInputHandler = (event) => {
    const textValue = event.target.value;
    if (textValue === "") {
      setdescription({ value: textValue, valid: false });
    } else {
      setdescription({ value: textValue, valid: true });
    }
  };

  const handleSumbit = (e) => {
    e.preventDefault();
    props.onModifyProject(
      id,
      name.value,
      description.value,
      props.username,
      props.token
    );
    setSubmit(true);
  };
  const handleRedirect = () => {
    if (submit)
      if (!props.loading)
        if (!props.error)
          props.history.push("/main-page", {
            alert: {
              name: name.value,
              msg: "The project has been modified successfully!",
            },
          });
  };

  return (
    <Grid container component="main" justify="center" className={classes.root}>
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
            <EditIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Modify project
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSumbit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Project name"
              name="name"
              autoComplete="off"
              autoFocus
              onChange={nameInputHandler}
              value={name.value}
              error={name.error ? true : false}
              helperText={name.error ? name.error : ""}
            />
            <TextField
              variant="outlined"
              margin="normal"
              multiline
              fullWidth
              rows={6}
              name="description"
              label="Project description"
              type="description"
              id="description"
              onChange={descriptionInputHandler}
              value={description.value}
            />
            {console.log("status: ", !name.valid, !description.valid)}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={!name.valid && !description.valid}
            >
              Modify project
            </Button>
          </form>
        </div>
      </Grid>
      <Grid item lg={2}></Grid>
      {handleRedirect()}
      <Box mt={8}>
        <Copyright />
      </Box>
    </Grid>
  );
}

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    token: state.auth.token,
    loading: state.projects.loading,
    error: state.projects.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onModifyProject: (pID, pName, pDescreption, username, token) =>
      dispatch(
        projectActions.modifyProject(pID, pName, pDescreption, username, token)
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModifyProject);
