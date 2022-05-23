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
  Fade,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@material-ui/core";
import { connect } from "react-redux";
import { HashLink as Link } from "react-router-hash-link";
// import * as projectActions from "../store/actions/projectActions";
import * as artifactActions from "../store/actions/artifacts";
import * as artifactTypesActions from "../store/actions/artifactTypes";
import * as myArtifactChangeRequestsActions from "../store/actions/myArtifactChangeRequests";
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
  paperContainer: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(3),
  },
}));

function MakeArtifactChangeRequest(props) {
  const classes = useStyles();

  const [id, setID] = useState({ value: "", valid: false, error: "" });
  const [name, setName] = useState({ value: "", valid: false, error: "" });
  const [description, setDescription] = useState({ value: "", valid: false });
  const [aType, setaType] = useState({ value: "", valid: false });

  const [requestTitle, setRequestTitle] = useState({
    value: "",
    valid: false,
    error: "",
  });
  const [requestDescription, setRequestDescription] = useState({
    value: "",
    valid: false,
    error: "",
  });
  const [requestType, setRequestType] = useState({
    value: "",
    valid: false,
    error: "",
  });

  const [dependency, setDependency] = useState({
    artifact: "",
    traceabilityLinks: [],
    valid: false,
  });
  const [dependentsArtifacts, setDependentsArtifacts] = React.useState([]);

  const checkDependency = (artifactID) => {
    var valid = true;

    const tempArtifact = props.artifacts.find(
      (artifact) => artifact.id === artifactID
    );

    if (!tempArtifact) return false;
    const artifactName = tempArtifact.name;

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
    else setDependency({ artifact: "", traceabilityLinks: [], valid: false });

    if (dependents.length > 0) valid = false;

    return valid;
  };

  useEffect(() => {
    props.onFetchArtifactTypes(props.selectedProject.id, props.token);
    props.onFetchMyArtifactChangeRequests(
      props.selectedProject.id,
      props.token
    );
  }, []);
  useEffect(() => {
    setID({ value: "", valid: false, error: "" });
    setName({ value: "", valid: false, error: "" });
    setDescription({ value: "", valid: false });
    setaType({ value: "", valid: false });
    setDependency({ artifact: "", traceabilityLinks: [], valid: false });
  }, [requestType.value]);
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    if (id.valid) {
      checkDependency(id.value);
    }
  }, [id]);

  const idInputHandler = (event) => {
    const textValue = event.target.value;
    const oldArtifact = props.artifacts.find((a) => a.id === textValue);
    const oldAType = props.artifactTypes.find(
      (at) => at.name === oldArtifact.artifact_type
    ).id;

    const alreadyExistRequest = props.myArtifactChangeRequests
      .filter((request) => request.status === "Pending")
      .find((request) => request.artifact_id === textValue);

    if (textValue === "") {
      setID({ value: textValue, valid: false, error: "" });
    } else if (alreadyExistRequest) {
      setID({
        value: textValue,
        valid: false,
        error: "You already have a pending request on this artifact",
      });
      setName({ value: oldArtifact.name, valid: true, error: "" });
      setDescription({
        value: oldArtifact.description,
        valid: true,
        error: "",
      });
    } else {
      setID({ value: textValue, valid: true, error: "" });
      setName({ value: oldArtifact.name, valid: false, error: "" });
      setDescription({
        value: oldArtifact.description,
        valid: false,
        error: "",
      });
      setaType({ value: oldAType, valid: false, error: "" });
    }
  };

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

  const requestTitleInputHandler = (event) => {
    const textValue = event.target.value;
    if (textValue === "") {
      setRequestTitle({ value: textValue, valid: false, error: "" });
    } else {
      if (UserInputValidation(textValue).check)
        setRequestTitle({ value: textValue, valid: true });
      else
        setRequestTitle({
          value: textValue,
          valid: false,
          error: UserInputValidation(textValue).error,
        });
    }
  };
  const requestDescriptionInputHandler = (event) => {
    const textValue = event.target.value;
    if (textValue === "") {
      setRequestDescription({ value: textValue, valid: true });
    } else {
      setRequestDescription({ value: textValue, valid: true });
    }
  };

  const requestTypeInputHandler = (event) => {
    setRequestType({ value: event.target.value, valid: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    var data = {};
    const artifactsName = props.artifacts.map((p) => p.name);
    if (requestType.value === "Create Artifact") {
      if (artifactsName.indexOf(name.value) !== -1) {
        setName({ ...name, valid: false, error: "Artifact already exists." });
        return;
      }
      data = {
        requestTitle: requestTitle.value,
        requestDescription: requestDescription.value,
        requestType: requestType.value,
        artifactName: name.value,
        artifactDescription: description.value,
        artifactType: aType.value,
      };

      props.onMakeArtifactCreationRequest(
        requestTitle.value,
        requestDescription.value,
        requestType.value,
        props.selectedProject.id,
        name.value,
        description.value,
        aType.value,
        props.username,
        props.token
      );
    } else if (requestType.value === "Modify Artifact") {
      const oldArtifact = props.artifacts.filter(
        (artifact) => artifact.id === id.value
      )[0];
      if (
        artifactsName
          .filter((artifact) => artifact !== oldArtifact.name)
          .indexOf(name.value) !== -1
      ) {
        setName({ ...name, valid: false, error: "Artifact already exists." });
        return;
      }
      data = {
        requestTitle: requestTitle.value,
        requestDescription: requestDescription.value,
        requestType: requestType.value,
        oldArtifactID: id.value,
        artifactName: name.value,
        artifactDescription: description.value,
        artifactType: aType.value,
      };

      props.onMakeArtifactModificationRequest(
        requestTitle.value,
        requestDescription.value,
        requestType.value,
        props.selectedProject.id,
        name.value,
        id.value,
        description.value,
        aType.value,
        props.username,
        props.token
      );
    } else if (requestType.value === "Remove Artifact") {
      if (dependency.valid) return;
      data = {
        requestTitle: requestTitle.value,
        requestDescription: requestDescription.value,
        requestType: requestType.value,
        artifactID: id.value,
      };
      props.onMakeArtifactDeletionRequest(
        requestTitle.value,
        requestDescription.value,
        requestType.value,
        props.selectedProject.id,
        id.value,
        props.username,
        props.token
      );
    }
    setSubmit(true);
    // props.history.push("/project-details", {
    //   value: 0,
    //   alert: {
    //     name: requestTitle.value,
    //     msg: "The change request on artifact has been created successfully!",
    //     to: "/change-requests",
    //     type: "artifact",
    //   },
    // });
  };
  const handleRedirect = () => {
    if (submit)
      if (!props.loading)
        if (!props.error) {
          props.history.push("/project-details", {
            value: 0,
            alert: {
              name: requestTitle.value,
              msg:
                "The change request on artifact has been created successfully!",
              to: "/change-requests",
              type: "artifact",
            },
          });
        } else console.error("Error");
  };

  const handleDisabledBtn = () => {
    var valid = true;

    if (!requestTitle.valid || !requestType.valid) valid = false;
    if (requestType.value === "Create Artifact") {
      if (!name.valid || !aType.valid) valid = false;
    } else if (requestType.value === "Modify Artifact") {
      if (id.valid) {
        if (name.error) valid = false;
        if (!name.valid && !description.valid && !aType.valid) valid = false;
      } else valid = false;
    } else if (requestType.value === "Remove Artifact") {
      if (!id.valid) valid = false;
      if (dependency.valid) valid = false;
    }
    return valid;
  };

  const goBack = () => {
    props.history.goBack();
  };

  const handleRequestType = () => {
    if (requestType.value === "Create Artifact")
      return (
        <Paper elevation={3} className={classes.paperContainer}>
          <Typography component="h2" variant="h5">
            {requestType.value}
          </Typography>
          {displayCreateArtifact()}
        </Paper>
      );
    else if (requestType.value === "Modify Artifact")
      return (
        <Paper elevation={3} className={classes.paperContainer}>
          <Typography component="h2" variant="h5">
            {requestType.value}
          </Typography>
          {displayModifyArtifact()}
        </Paper>
      );
    else if (requestType.value === "Remove Artifact")
      return (
        <Paper elevation={3} className={classes.paperContainer}>
          <Typography component="h2" variant="h5">
            {requestType.value}
          </Typography>
          {displayRemoveArtifact()}
        </Paper>
      );
  };
  const displayCreateArtifact = () => {
    return (
      <div>
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
          <InputLabel id="demo-simple-select-label">Artifact Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={aType.value}
            onChange={handleTypeChange}
          >
            {props.artifactTypes.map((type) => {
              return (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
    );
  };
  const displayModificationAlert = () => {
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
  const displayRemovalAlert = () => {
    if (dependency.valid)
      return (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Can't Delete this Artifact.
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
  const displayModifyArtifact = () => {
    return (
      <div>
        {displayModificationAlert()}
        <FormControl fullWidth margin="normal" required error={id.error}>
          <InputLabel id="artifact-select">Select Artifact</InputLabel>
          <Select
            labelId="artifact-select"
            id="artifact-simple-select"
            value={id.value}
            onChange={idInputHandler}
            error={id.error}
          >
            {props.artifacts.length === 0 ? (
              <MenuItem key={"none"} value={"none"} disabled>
                {"There project does not have Artifacts!"}
              </MenuItem>
            ) : (
              props.artifacts.map((artifact) => {
                return (
                  <MenuItem key={artifact.id} value={artifact.id}>
                    {artifact.name}
                  </MenuItem>
                );
              })
            )}
          </Select>
          <FormHelperText>{id.error}</FormHelperText>
        </FormControl>

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Artifact new name"
          name="name"
          autoComplete="off"
          autoFocus
          onChange={nameInputHandler}
          value={name.value}
          error={name.error ? true : false}
          helperText={name.error ? name.error : ""}
          disabled={!id.valid}
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
          disabled={!id.valid}
        />

        <FormControl fullWidth margin="normal" required disabled={!id.valid}>
          <InputLabel id="demo-simple-select-label">Artifact Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={aType.value}
            onChange={handleTypeChange}
            disabled={dependency.valid || !id.valid}
          >
            {props.artifactTypes.map((type) => {
              return (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
    );
  };
  const displayRemoveArtifact = () => {
    return (
      <React.Fragment>
        {displayRemovalAlert()}
        <FormControl
          className={classes.formControl}
          fullWidth
          margin="normal"
          required
          error={id.error}
        >
          <InputLabel id="artifact-select">Artifact Name</InputLabel>
          <Select
            labelId="artifact-select"
            id="artifact-simple-select"
            value={id.value}
            onChange={idInputHandler}
            fullWidth
          >
            {props.artifacts.length === 0 ? (
              <MenuItem key={"none"} value={"none"} disabled>
                {"There project does not have Artifacts!"}
              </MenuItem>
            ) : (
              props.artifacts.map((artifact) => {
                return (
                  <MenuItem key={artifact.id} value={artifact.id}>
                    {artifact.name}
                  </MenuItem>
                );
              })
            )}
          </Select>
          <FormHelperText>{id.error}</FormHelperText>
        </FormControl>
      </React.Fragment>
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
              Create Artifact Change Request
            </Typography>

            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <Paper elevation={3} className={classes.paperContainer}>
                <Typography component="h2" variant="h5">
                  {"Change Request"}
                </Typography>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="title"
                  label="Request title"
                  name="title"
                  autoComplete="off"
                  autoFocus
                  onChange={requestTitleInputHandler}
                  value={requestTitle.value}
                  error={requestTitle.error ? true : false}
                  helperText={requestTitle.error ? requestTitle.error : ""}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  multiline
                  fullWidth
                  rows={6}
                  name="request description"
                  label="Request description"
                  type="description"
                  id="requestDescription"
                  onChange={requestDescriptionInputHandler}
                  value={requestDescription.value}
                />

                <FormControl
                  className={classes.formControl}
                  fullWidth
                  margin="normal"
                  required
                >
                  <InputLabel id="demo-simple-select-label">
                    Artifact Request Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={requestType.value}
                    onChange={requestTypeInputHandler}
                  >
                    <MenuItem value={"Create Artifact"}>
                      Create Artifact
                    </MenuItem>
                    <MenuItem value={"Modify Artifact"}>
                      Modify Artifact
                    </MenuItem>
                    <MenuItem value={"Remove Artifact"}>
                      Remove Artifact
                    </MenuItem>
                  </Select>
                </FormControl>
              </Paper>
              {handleRequestType()}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={!handleDisabledBtn()}
              >
                Make Change Request
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
    isArtifactExist: state.artifacts.isArtifactExist,
    loading: state.myArtifactChangeRequests.loading,
    artifactTypes: state.artifactTypes.artifactTypes,
    traceabilityLinks: state.traceabilityLinks.traceabilityLinks,
    myArtifactChangeRequests:
      state.myArtifactChangeRequests.myArtifactChangeRequests,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchArtifactTypes: (pID, token) =>
      dispatch(artifactTypesActions.fetchArtifactTypes(pID, token)),
    onMakeArtifactCreationRequest: (
      title,
      description,
      requestType,
      projectID,
      artifactName,
      artifactDescription,
      artifactType,
      username,
      token
    ) =>
      dispatch(
        myArtifactChangeRequestsActions.createCreationArtifactChangeRequest(
          title,
          description,
          requestType,
          projectID,
          artifactName,
          artifactDescription,
          artifactType,
          username,
          token
        )
      ),
    onMakeArtifactModificationRequest: (
      title,
      description,
      requestType,
      projectID,
      artifactName,
      artifactID,
      artifactDescription,
      artifactType,
      username,
      token
    ) =>
      dispatch(
        myArtifactChangeRequestsActions.createModificationArtifactChangeRequest(
          title,
          description,
          requestType,
          projectID,
          artifactName,
          artifactID,
          artifactDescription,
          artifactType,
          username,
          token
        )
      ),
    onMakeArtifactDeletionRequest: (
      title,
      description,
      requestType,
      projectID,
      artifactID,
      username,
      token
    ) =>
      dispatch(
        myArtifactChangeRequestsActions.createDeletionArtifactChangeRequest(
          title,
          description,
          requestType,
          projectID,
          artifactID,
          username,
          token
        )
      ),
    onFetchMyArtifactChangeRequests: (projectID, token) =>
      dispatch(
        myArtifactChangeRequestsActions.fetchMyArtifactChangeRequests(
          projectID,
          token
        )
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MakeArtifactChangeRequest);
