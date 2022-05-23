import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Copyright from "../components/Copyright/Copyright";
import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {
  CircularProgress,
  Fade,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { connect } from "react-redux";
// import * as projectActions from "../store/actions/projectActions";
import * as artifactActions from "../store/actions/artifacts";
import * as artifactTypesActions from "../store/actions/artifactTypes";
import { Alert } from "@material-ui/lab";
import SystemAlert from "../components/Alert/SystemAlert";
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
  formControl: {
    minWidth: 300,
  },
}));

function CreateArtifact(props) {
  const classes = useStyles();
  const [name, setName] = useState({ value: "", valid: false, error: "" });
  const [description, setDescription] = useState({ value: "", valid: false });
  const [aType, setaType] = useState({ value: "", valid: false });
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    props.onFetchArtifactTypes(props.selectedProject.id, props.token);
  }, []);

  if (
    props.userPrivileges.map((p) => p.name).indexOf("Create artifact") === -1 &&
    props.userPrivileges
      .map((p) => p.name)
      .indexOf("Create artifact of a specific type") === -1
  ) {
    console.error("You don't have the right PRIVILEGES");
    props.history.push("/project-details");
  }

  const artifactTypes =
    props.userPrivileges.map((p) => p.name).indexOf("Create artifact") !== -1
      ? props.artifactTypes.map((type) => {
          return type;
        })
      : props.userPrivileges
          .filter((p) => p.name === "Create artifact of a specific type")
          .map((p) => {
            if (p.name === "Create artifact of a specific type")
              return props.artifactTypes.filter(
                (type) => type.id === p.type
              )[0];
          });

  const artifactsName = props.artifacts.map((p) => p.name);

  const nameInputHandler = (event) => {
    const textValue = event.target.value;
    if (textValue === "") {
      setName({ value: textValue, valid: false, error: "" });
    } else {
      if (UserInputValidation(textValue).check)
        setName({ value: textValue, valid: true });
      else
        setName({
          value: textValue,
          valid: false,
          error: UserInputValidation(textValue).error,
        });
    }
  };

  const descriptionInputHandler = (event) => {
    const textValue = event.target.value;
    if (textValue === "") {
      setDescription({ value: textValue, valid: true });
    } else {
      setDescription({ value: textValue, valid: true });
    }
  };
  const handleTypeChange = (event) => {
    setaType({ value: event.target.value, valid: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (artifactsName.indexOf(name.value) !== -1) {
      setName({ ...name, valid: false, error: "Artifact already exists." });
      return;
    }
    // handle artifactTypes change using socketIO
    if (artifactTypes.map((at) => at.id).indexOf(aType.value) === -1) {
      setaType({ value: "", valid: false });
      return;
    }
    props.onCreateArtifact(
      props.selectedProject.id,
      name.value,
      description.value,
      aType.value,
      props.username,
      props.token
    );

    setSubmit(true);
  };

  const handleRedirect = () => {
    if (submit)
      if (!props.loading)
        if (!props.error) {
          props.history.push("/project-details", {
            alert: {
              name: name.value,
              msg: "The artifact has been created successfully!",
            },
          });
        } else console.error("Error");
  };

  const goBack = () => {
    props.history.goBack();
  };

  const loading = () => {
    console.log("loading: ", props.loading);
    if (props.loading && submit)
      return <CircularProgress className={classes.loading} />;
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
          <IconButton onClick={goBack}>
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
              Create Artifact
            </Typography>
            {/* {loading()} */}
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Artifact name"
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
                label="Artifact description"
                type="description"
                id="description"
                onChange={descriptionInputHandler}
                value={description.value}
              />

              <FormControl
                className={classes.formControl}
                fullWidth
                margin="normal"
                required
              >
                <InputLabel id="demo-simple-select-label">
                  Artifact Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={aType.value}
                  onChange={handleTypeChange}
                >
                  {artifactTypes.map((type) => {
                    return (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={!name.valid || !aType.valid}
              >
                Create Artifact
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
    selectedProject: state.projects.selectedProject,
    userPrivileges: state.changeUserRole.userPrivileges,
    artifacts: state.artifacts.artifacts,
    loading: state.artifacts.loading,
    error: state.artifacts.error,
    isArtifactExist: state.artifacts.isArtifactExist,
    loading: state.artifacts.loading,
    artifactTypes: state.artifactTypes.artifactTypes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCreateArtifact: (
      projectID,
      artifactName,
      artifactDescription,
      artifactType,
      username,
      token
    ) =>
      dispatch(
        artifactActions.createArtifactInProject(
          projectID,
          artifactName,
          artifactDescription,
          artifactType,
          username,
          token
        )
      ),
    onFetchArtifactTypes: (pID, token) =>
      dispatch(artifactTypesActions.fetchArtifactTypes(pID, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateArtifact);
