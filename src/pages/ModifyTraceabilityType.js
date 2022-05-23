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
import Fade from "@material-ui/core/Fade";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { HashLink as Link } from "react-router-hash-link";
import {
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { connect } from "react-redux";
import * as traceabilityLinkTypesActions from "../store/actions/traceabilityLinkTypes";
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
    maxWidth: 650,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    marginBottom: theme.spacing(3),
    minWidth: 250,
  },
}));

const artifacts = ["artifact1", "artifact2", "artifact3", "Requirements"];

function ModifyTraceabilityType(props) {
  const classes = useStyles();
  const [error, setError] = useState("");
  const [submit, setSubmit] = useState(false);
  const oldType = props.location.state
    ? {
        name: props.location.state.type,
        description: props.location.state.description,
        firstArtifact: props.location.state.firstArtifact,
        secondArtifact: props.location.state.secondArtifact,
        id: props.location.state.id,
      }
    : "";

  const [dependency, setDependency] = useState({
    traceabilityType: "",
    traceabilityLinks: [],
    valid: false,
  });

  const checkDependency = (typeID) => {
    var valid = true;
    const traceabilityType = props.traceabilityLinkTypes.find(
      (tType) => tType.id === typeID
    );
    const traceabilityTypeName = traceabilityType.name;

    const dependents = props.traceabilityLinks.filter(
      (t) => t.traceability_Link_Type === traceabilityTypeName
    );
    if (dependents.length > 0)
      setDependency({
        traceabilityType: traceabilityType,
        traceabilityLinks: dependents,
        valid: true,
      });
    if (dependents.length > 0) valid = false;

    return valid;
  };

  useEffect(() => {
    props.onFetchArtifactTypes(props.selectedProject.id, props.token);
    checkDependency(oldType.id);
  }, []);
  const [name, setName] = useState({ value: oldType.name, valid: false });
  const [description, setDescription] = useState({
    value: oldType.description,
    valid: false,
  });

  const [firstArtifact, setFirstArtifact] = useState(
    props.artifactTypes.find((element) => element.name == oldType.firstArtifact)
  );
  const [secondArtifact, setSecondArtifact] = useState(
    props.artifactTypes.find(
      (element) => element.name == oldType.secondArtifact
    )
  );
  const [tID, setTID] = useState(oldType.id);
  if (!oldType) props.history.push("/traceability-link-types");

  if (props.userPrivileges.indexOf("Modify traceability link type") === -1) {
    console.error("You don't have the right PRIVILEGES");
    props.history.push("/traceability-link-types");
  }

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
      setDescription({ value: textValue, valid: false });
    } else {
      setDescription({ value: textValue, valid: true });
    }
  };

  const handleFirstArtifact = (event) => {
    const newValue = props.artifactTypes.find(
      (element) => element.id == event.target.value
    );
    setFirstArtifact(newValue);
  };
  const handleSecondArtifact = (event) => {
    const newValue = props.artifactTypes.find(
      (element) => element.id == event.target.value
    );
    setSecondArtifact(newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const TraceabilityLinkTypeNames = props.traceabilityLinkTypes.map(
      (type) => type.name
    );

    if (
      TraceabilityLinkTypeNames.indexOf(name.value) !== -1 &&
      oldType.name !== name.value
    ) {
      setName({
        ...name,
        error: "Traceability Link Type Name already exists in the project",
        valid: false,
      });
      return;
    }
    if (
      name.value !== oldType.name &&
      TraceabilityLinkTypeNames.indexOf(name.value) !== -1
    ) {
      console.log("flaaaaag");
      setError("Traceability link type already exists in the project!");
    } else {
      props.onModifyTraceabilityLinkType(
        props.selectedProject.id,
        name.value,
        description.value,
        tID,
        firstArtifact.id,
        secondArtifact.id,
        props.token
      );
      setError("");
    }
    setSubmit(true);
  };

  const handleRedirect = () => {
    if (submit)
      if (!props.loading)
        if (!props.isArtifactTypeExist && !error)
          props.history.push("/traceability-link-types", {
            alert: {
              name: name.value,
              msg: "The traceability link type has been modified successfully!",
            },
          });
  };

  const handleDisabled = () => {
    var invalid = true;
    if (!name.error) {
      if (
        name.valid ||
        description.valid ||
        firstArtifact.name !== oldType.firstArtifact ||
        secondArtifact.name !== oldType.secondArtifact
      )
        invalid = false;
    }

    return invalid;
  };

  // const handleDisabled = () => {
  //   var invalid = true;

  //   if (
  //     name.valid &&
  //     (description.valid ||
  //       firstArtifact.name !== oldType.firstArtifact ||
  //       secondArtifact.name !== oldType.secondArtifact)
  //   )
  //     invalid = false;
  //   else invalid = true;
  //   return invalid;
  // };

  const displayAlert = () => {
    if (dependency.valid)
      return (
        <Alert severity="warning" className={classes.Alert}>
          <AlertTitle>Warning</AlertTitle>
          Can't modify this Traceability Link Type First Artifact and Second
          Artifact
          <br />
          <strong>{dependency.traceabilityType.name}</strong> has a dependency
          on the following Traceability Links:{" "}
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
              Modify Traceability Link Type
            </Typography>
            {displayAlert()}
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Traceability Link Type name"
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
                label="Traceability Link Type description"
                type="description"
                id="description"
                onChange={descriptionInputHandler}
                value={description.value}
              />
              <FormControl className={classes.formControl} fullWidth required>
                <InputLabel id="firstArtifact">First Artifact Type </InputLabel>
                <Select
                  labelId="firstArtifact"
                  id="firstArtifactSelect"
                  value={firstArtifact.id}
                  onChange={handleFirstArtifact}
                  disabled={dependency.valid}
                >
                  {props.artifactTypes.map((artifact) => {
                    return (
                      <MenuItem key={artifact.id} value={artifact.id}>
                        {artifact.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl className={classes.formControl} fullWidth required>
                <InputLabel id="secondArtifact">
                  Second Artifact Type{" "}
                </InputLabel>
                <Select
                  labelId="secondArtifact"
                  id="secondArtifactSelect"
                  value={secondArtifact.id}
                  onChange={handleSecondArtifact}
                  disabled={dependency.valid}
                >
                  {props.artifactTypes.map((artifact) => {
                    return (
                      <MenuItem key={artifact.id} value={artifact.id}>
                        {artifact.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              {console.log("status: ", !name.valid, !description.valid)}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={handleDisabled()}
              >
                Modify Traceability Link Type
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
    traceabilityLinks: state.traceabilityLinks.traceabilityLinks,
    traceabilityLinkTypes: state.traceabilityLinkTypes.traceabilityLinkTypes,
    isTraceabilityLinkTypeExist:
      state.traceabilityLinkTypes.isTraceabilityLinkTypeExist,
    loading: state.traceabilityLinkTypes.loading,
    artifactTypes: state.artifactTypes.artifactTypes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onModifyTraceabilityLinkType: (
      pID,
      traceabilityLinkTypeName,
      traceabilityLinkTypeDescription,
      traceabilityLinkTypeID,
      firstArtifactType,
      secondArtifactType,
      token
    ) =>
      dispatch(
        traceabilityLinkTypesActions.modifyTraceabilityLinkTypeInProject(
          pID,
          traceabilityLinkTypeName,
          traceabilityLinkTypeDescription,
          traceabilityLinkTypeID,
          firstArtifactType,
          secondArtifactType,
          token
        )
      ),
    onFetchArtifactTypes: (pID, token) =>
      dispatch(artifactTypesActions.fetchArtifactTypes(pID, token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModifyTraceabilityType);
