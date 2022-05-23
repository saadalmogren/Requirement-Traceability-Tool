import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Copyright from "../components/Copyright/Copyright";
import React, { useEffect, useState } from "react";
import EditIcon from "@material-ui/icons/Edit";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Fade, Grid, IconButton } from "@material-ui/core";
import { connect } from "react-redux";
import * as artifactTypesActions from "../store/actions/artifactTypes";
import { Alert, AlertTitle } from "@material-ui/lab";
import { HashLink as Link } from "react-router-hash-link";
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

function ModifyArtifactType(props) {
  const classes = useStyles();
  const [error, setError] = useState("");
  const [submit, setSubmit] = useState(false);
  const oldType = props.location.state ? props.location.state.type : "";
  const aID = props.location.state ? props.location.state.id : "";
  const oldDescription = props.location.state
    ? props.location.state.description
    : "";
  const id = props.location.state ? props.location.state.projectID : "";
  const [name, setName] = useState({ value: oldType, valid: false });
  const [description, setDescription] = useState({
    value: oldDescription,
    valid: false,
  });

  const [dependency, setDependency] = useState({
    artifactType: "",
    traceabilityLinkTypes: [],
    valid: false,
  });
  useEffect(() => {
    checkDependency(props.location.state.id);
  }, []);

  const checkDependency = (typeID) => {
    var valid = true;
    const artifactTypeName = props.artifactTypes.find(
      (aType) => aType.id === typeID
    ).name;

    const type = props.traceabilityLinkTypes.filter(
      (t) =>
        t.first_artifact_type === artifactTypeName ||
        t.second_artifact_type === artifactTypeName
    );
    if (type.length > 0)
      setDependency({
        artifactType: artifactTypeName,
        traceabilityLinkTypes: type,
        valid: true,
      });
    if (type.length > 0) valid = false;

    return valid;
  };

  if (!oldType) props.history.push("/artifact-types");
  if (props.userPrivileges.indexOf("Modify artifact type") === -1) {
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

    if (
      name.value !== oldType &&
      artifactTypeNames.indexOf(name.value) !== -1
    ) {
      setError("Artifact type already exists in the project!");
      return;
    } else {
      props.onModifyArtifactType(
        props.selectedProject.id,
        name.value,
        description.value,
        aID,
        props.token
      );
      setError("");
      setSubmit(true);
    }
  };

  const handleRedirect = () => {
    if (submit)
      if (!props.loading)
        if (!props.isArtifactTypeExist && !error)
          props.history.push("/artifact-types", {
            alert: {
              name: name.value,
              msg: "The artifact type has been modified successfully!",
            },
          });
  };

  const handleDisabledBtn = () => {
    var invalid = true;
    if (!error) {
      if (name.valid || description.valid) invalid = false;
    }

    return invalid;
  };

  const displayAlert = () => {
    if (dependency.valid)
      return (
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          Can't modify this artifact type name.
          <br />
          <strong>{dependency.artifactType}</strong> has a dependency on the
          following Traceability Link Types:{" "}
          <strong>
            {dependency.traceabilityLinkTypes.map((t, index) => (
              <React.Fragment>
                {index + 1 + "- "}
                <Link to={"/traceability-link-types#" + t.name}>
                  {t.name}
                </Link>{" "}
              </React.Fragment>
            ))}
          </strong>
        </Alert>
      );
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
              <EditIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Modify Artifact Type
            </Typography>

            {displayAlert()}

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
                disabled={dependency.valid}
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
                disabled={handleDisabledBtn()}
              >
                Modify Artifact Type
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
    traceabilityLinkTypes: state.traceabilityLinkTypes.traceabilityLinkTypes,
    isArtifactTypeExist: state.artifactTypes.isArtifactTypeExist,
    loading: state.artifactTypes.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onModifyArtifactType: (
      pID,
      artifactTypeName,
      artifactTypeDescription,
      artifactTypeID,
      token
    ) =>
      dispatch(
        artifactTypesActions.modifyArtifactTypeInProject(
          pID,
          artifactTypeName,
          artifactTypeDescription,
          artifactTypeID,
          token
        )
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModifyArtifactType);
