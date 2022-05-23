import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Copyright from "../components/Copyright/Copyright";
import React, { useState, useEffect } from "react";
import EditIcon from "@material-ui/icons/Edit";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {
  Fade,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { HashLink as Link } from "react-router-hash-link";
import { connect } from "react-redux";
// import * as projectActions from "../store/actions/projectActions";
import * as artifactActions from "../store/actions/artifacts";
import * as artifactTypesActions from "../store/actions/artifactTypes";
import { Alert, AlertTitle } from "@material-ui/lab";
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

function ModifyArtifact(props) {
  const classes = useStyles();

  const [dependency, setDependency] = useState({
    artifact: "",
    traceabilityLinks: [],
    valid: false,
  });

  useEffect(() => {
    props.onFetchArtifactTypes(props.selectedProject.id, props.token);
    checkDependency(oldArtifact.id);
    console.log("oldArtifact.id", oldArtifact.id);
  }, []);

  const oldArtifact = props.location.state
    ? props.location.state.artifact[0]
    : "";
  if (!oldArtifact) props.history.goBack();

  const checkDependency = (artifactID) => {
    var valid = true;
    const artifactName = props.artifacts.find(
      (artifact) => artifact.id === artifactID
    ).name;

    const dependents = props.traceabilityLinks.filter(
      (t) =>
        t.first_artifact === artifactName || t.second_artifact === artifactName
    );
    if (dependents.length > 0)
      setDependency({
        artifact: artifactName,
        traceabilityLinks: dependents,
        valid: true,
      });
    if (dependents.length > 0) valid = false;

    return valid;
  };

  if (
    props.userPrivileges.map((p) => p.name).indexOf("Modify artifact") === -1 &&
    props.userPrivileges
      .map((p) => p.name)
      .indexOf("Modify artifact of a specific type") === -1
  ) {
    console.error("You don't have the right PRIVILEGES");
    props.history.push("/project-details");
  }

  const artifactTypes =
    props.userPrivileges.map((p) => p.name).indexOf("Modify artifact") !== -1
      ? props.artifactTypes.map((type) => {
          return type;
        })
      : props.userPrivileges
          .filter((p) => p.name === "Modify artifact of a specific type")
          .map((p) => {
            if (p.name === "Modify artifact of a specific type")
              return props.artifactTypes.filter(
                (type) => type.id === p.type
              )[0];
          });

  // validate user specific type privilege
  if (
    props.userPrivileges.map((p) => p.name).indexOf("Modify artifact") === -1 &&
    props.userPrivileges
      .map((p) => p.name)
      .indexOf("Modify artifact of a specific type") !== -1
  ) {
    if (
      artifactTypes.map((a) => a.name).indexOf(oldArtifact.artifact_type) === -1
    ) {
      console.error("You don't have the right PRIVILEGES");
      props.history.push("/project-details");
    }
  }

  const [name, setName] = useState({ value: oldArtifact.name, valid: false });
  const [description, setDescription] = useState({
    value: oldArtifact.description,
    valid: false,
  });

  const [aType, setaType] = useState({
    value:
      artifactTypes.map((t) => t.name).indexOf(oldArtifact.artifact_type) !== -1
        ? artifactTypes[
            artifactTypes.map((t) => t.name).indexOf(oldArtifact.artifact_type)
          ].id
        : "",
    valid: false,
  });
  const artifactsName = props.artifacts.map((p) => p.name);
  // console.log(aType);
  // setaType();
  const nameInputHandler = (event) => {
    const textValue = event.target.value;
    if (textValue === "") {
      setName({ value: textValue, valid: false });
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

    if (
      artifactsName.indexOf(name.value) !== -1 &&
      name.value !== oldArtifact.name
    ) {
      setName({ ...name, valid: false, error: "Artifact already exists." });
      console.log("Name:", name);
      return;
    }
    // handle artifactTypes change using socketIO
    console.log(artifactTypes, aType.value);
    if (artifactTypes.map((a) => a.id).indexOf(aType.value) === -1) {
      setaType({ value: "", valid: false });
      return;
    }
    props.onModifyArtifact(
      props.selectedProject.id,
      name.value,
      description.value,
      aType.value,
      oldArtifact.id,
      props.username,
      props.token
    );
    if (!props.error)
      props.history.push("/project-details", {
        alert: {
          name: name.value,
          msg: "The artifact has been modified successfully!",
        },
      });
    else props.history.push("/project-details");
  };

  const displayAlert = () => {
    if (dependency.valid)
      return (
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          Can't modify this Artifact's type.
          <br />
          <strong>{dependency.artifact}</strong> has a dependency on the
          following Traceability Links:{" "}
          <strong>
            {dependency.traceabilityLinks.map((t, index) => (
              <React.Fragment>
                {index + 1 + "- "}
                <Link
                  to={{
                    pathname: "/project-details",
                    hash: "#" + t.name,
                    state: { selected: dependency.traceabilityType, value: 1 },
                  }}
                >
                  {t.name}
                </Link>{" "}
              </React.Fragment>
            ))}
          </strong>
        </Alert>
      );
  };
  const handleDisabledBtn = () => {
    var invalid = true;
    if (!name.error)
      if (name.valid || description.valid || aType.valid) invalid = false;

    return invalid;
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
              Modify Artifact
            </Typography>
            {displayAlert()}
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
                  onChange={handleTypeChange}
                  value={aType.value}
                  disabled={dependency.valid}
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
                disabled={handleDisabledBtn()}
              >
                Modify Artifact
              </Button>
            </form>
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
    selectedProject: state.projects.selectedProject,
    userPrivileges: state.changeUserRole.userPrivileges,
    artifacts: state.artifacts.artifacts,
    traceabilityLinks: state.traceabilityLinks.traceabilityLinks,
    isArtifactExist: state.artifacts.isArtifactExist,
    loading: state.artifacts.loading,
    artifactTypes: state.artifactTypes.artifactTypes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onModifyArtifact: (
      projectID,
      artifactName,
      artifactDescription,
      artifactType,
      artifactID,
      username,
      token
    ) =>
      dispatch(
        artifactActions.modifyArtifactInProject(
          projectID,
          artifactName,
          artifactDescription,
          artifactType,
          artifactID,
          username,
          token
        )
      ),
    onFetchArtifactTypes: (pID, token) =>
      dispatch(artifactTypesActions.fetchArtifactTypes(pID, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModifyArtifact);
