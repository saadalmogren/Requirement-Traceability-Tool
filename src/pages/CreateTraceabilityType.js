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
import AddIcon from "@material-ui/icons/Add";
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

function CreateTraceabilityType(props) {
  const classes = useStyles();
  const [error, setError] = useState("");
  const [submit, setSubmit] = useState(false);
  const id = props.location.state ? props.location.state.projectID : "";
  const [name, setName] = useState({ value: "", valid: false });
  const [description, setDescription] = useState({
    value: "",
    valid: false,
  });
  const [firstArtifact, setFirstArtifact] = useState("");
  const [secondArtifact, setSecondArtifact] = useState("");

  useEffect(() => {
    props.onFetchArtifactTypes(props.selectedProject.id, props.token);
  }, []);

  useEffect(() => {
    if (props.location.state)
      if (
        props.location.state.firstArtifactType &&
        props.location.state.secondArtifactType
      ) {
        setFirstArtifact(props.location.state.firstArtifactType.id);
        setSecondArtifact(props.location.state.secondArtifactType.id);
        console.log("State: ", props.location.state);
      }
  }, [props.location.state]);

  if (
    props.userPrivileges.indexOf("Define new traceability link type") === -1
  ) {
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
    setFirstArtifact(event.target.value);
  };
  const handleSecondArtifact = (event) => {
    setSecondArtifact(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      props.traceabilityLinkTypes.map((tl) => tl.name).indexOf(name.value) !==
      -1
    ) {
      setName({
        ...name,
        error: "Traceability Link Type Name already exists in the project",
        valid: false,
      });
      return;
    }
    props.onCreateTraceabilityLinkType(
      props.selectedProject.id,
      name.value,
      description.value,
      firstArtifact,
      secondArtifact,
      props.token
    );

    const TraceabilityLinkTypeNames = props.traceabilityLinkTypes.map(
      (type) => type.name
    );

    if (TraceabilityLinkTypeNames.indexOf(name.value) !== -1) {
      setError("Traceability link type already exists in the project!");
    } else {
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
              msg: "The traceability link type has been created successfully!",
            },
          });
  };

  const handleDisabled = () => {
    var invalid = true;
    if (name.valid && firstArtifact && secondArtifact) invalid = false;
    else invalid = true;
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
              Create Traceability Link Type
            </Typography>
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
                <InputLabel id="firstArtifact">First Artifact Type</InputLabel>
                <Select
                  labelId="firstArtifact"
                  id="firstArtifactSelect"
                  value={firstArtifact}
                  onChange={handleFirstArtifact}
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
                  Second Artifact Type
                </InputLabel>
                <Select
                  labelId="secondArtifact"
                  id="secondArtifactSelect"
                  value={secondArtifact}
                  onChange={handleSecondArtifact}
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
                Create Traceability Link Type
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
    traceabilityLinkTypes: state.traceabilityLinkTypes.traceabilityLinkTypes,
    isTraceabilityLinkTypeExist:
      state.traceabilityLinkTypes.isTraceabilityLinkTypeExist,
    loading: state.traceabilityLinkTypes.loading,
    artifactTypes: state.artifactTypes.artifactTypes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCreateTraceabilityLinkType: (
      pID,
      traceabilityLinkTypeName,
      traceabilityLinkTypeDescription,
      firstArtifactType,
      secondArtifactType,
      token
    ) =>
      dispatch(
        traceabilityLinkTypesActions.createTraceabilityLinkTypeInProject(
          pID,
          traceabilityLinkTypeName,
          traceabilityLinkTypeDescription,
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
)(CreateTraceabilityType);
