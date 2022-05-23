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
import AddIcon from "@material-ui/icons/Add";
import { Fade, Grid, IconButton } from "@material-ui/core";
import { connect } from "react-redux";
import * as artifactTypesActions from "../store/actions/artifactTypes";
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

function CreateArtifactType(props) {
  const classes = useStyles();
  const [error, setError] = useState("");
  const [submit, setSubmit] = useState(false);
  const oldType = props.location.state ? props.location.state.type : "";
  const oldDescription = props.location.state
    ? props.location.state.description
    : "";
  const id = props.location.state ? props.location.state.projectID : "";
  const [name, setName] = useState({ value: oldType, valid: false });
  const [description, setDescription] = useState({
    value: oldDescription,
    valid: false,
  });

  if (props.userPrivileges.indexOf("Define new artifact type") === -1) {
    console.error("You don't have the right PRIVILEGES");
    props.history.push("/artifact-types");
  }

  const nameInputHandler = (event) => {
    const textValue = event.target.value;
    if (textValue === "") {
      setName({ value: textValue, valid: false });
    } else {
      if (UserInputValidation(textValue).check) {
        setName({ value: textValue, valid: true });
        setError("");
      } else {
        setName({
          value: textValue,
          valid: false,
        });
        setError(UserInputValidation(textValue).error);
      }
    }
  };

  const descriptionInputHandler = (event) => {
    const textValue = event.target.value;
    if (textValue === "") {
      setDescription({ value: textValue, valid: false });
    } else {
      setDescription({ value: textValue, valid: true });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const artifactTypeNames = props.artifactTypes.map((type) => type.name);

    if (artifactTypeNames.indexOf(name.value) !== -1) {
      setError("Artifact type already exists in the project!");
      return;
    } else {
      setError("");
    }
    props.onCreateArtifactType(
      props.selectedProject.id,
      name.value,
      description.value,
      props.token
    );

    setSubmit(true);
  };

  const handleRedirect = () => {
    if (submit)
      if (!props.loading)
        if (!props.isArtifactTypeExist && !error)
          props.history.push("/artifact-types", {
            alert: {
              name: name.value,
              msg: "The artifact type has been created successfully!",
            },
          });
  };

  const handleDisabledBtn = () => {
    var valid = true;
    if (!name.valid) valid = false;
    if (error) valid = false;
    return valid;
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
          <IconButton onClick={props.history.goBack}>
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
              Create Artifact Type
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Artifact Type name"
                name="name"
                autoComplete="off"
                autoFocus
                onChange={nameInputHandler}
                value={name.value}
                error={error !== ""}
                helperText={error !== "" ? error : null}
              />
              <TextField
                variant="outlined"
                margin="normal"
                multiline
                fullWidth
                rows={6}
                name="description"
                label="Artifact Type description"
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
                disabled={!handleDisabledBtn()}
              >
                Create Artifact Type
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
    </Fade>
  );
}

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    token: state.auth.token,
    userPrivileges: state.changeUserRole.userPrivileges.map((p) => p.name),
    selectedProject: state.projects.selectedProject,
    artifactTypes: state.artifactTypes.artifactTypes,
    isArtifactTypeExist: state.artifactTypes.isArtifactTypeExist,
    loading: state.artifactTypes.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCreateArtifactType: (
      pID,
      artifactTypeName,
      artifactTypeDescription,
      token
    ) =>
      dispatch(
        artifactTypesActions.createArtifactTypeInProject(
          pID,
          artifactTypeName,
          artifactTypeDescription,
          token
        )
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateArtifactType);
