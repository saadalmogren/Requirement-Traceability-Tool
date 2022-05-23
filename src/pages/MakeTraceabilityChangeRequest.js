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
import * as traceabilityLinkTypesActions from "../store/actions/traceabilityLinkTypes";
import * as myTraceabilityLinkChangeRequestsActions from "../store/actions/myTraceabilityLinkChangeRequests";
import * as traceabilityLinkChangeRequestsActions from "../store/actions/traceabilityLinkChangeRequests";
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

function MakeTraceabilityChangeRequest(props) {
  const classes = useStyles();

  const [id, setID] = useState({ value: "", valid: false, error: "" });
  const [name, setName] = useState({ value: "", valid: false, error: "" });
  const [description, setDescription] = useState({ value: "", valid: false });
  const [traceabilityType, setTraceabilityType] = useState({
    value: "",
    valid: false,
  });
  const [firstArtifact, setFirstArtifact] = useState({
    value: "",
    valid: false,
    error: "",
  });
  const [secondArtifact, setSecondArtifact] = useState({
    value: "",
    valid: false,
    error: "",
  });
  const [traceabilityTypeObj, setTraceabilityTypeObj] = useState(
    props.traceabilityLinkTypes.find(
      (element) => element.id == traceabilityType
    )
  );
  const [submit, setSubmit] = useState(false);

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
  useEffect(() => {
    props.onFetchTraceabilityLinkTypes(props.selectedProject.id, props.token);
    props.onFetchMyTraceabilityLinkChangeRequests(
      props.selectedProject.id,
      props.token
    );
  }, []);

  useEffect(() => {
    setID({ value: "", valid: false, error: "" });
    setName({ value: "", valid: false, error: "" });
    setDescription({ value: "", valid: false });
    setTraceabilityType({ value: "", valid: false });
    setFirstArtifact({ value: "", valid: false });
    setSecondArtifact({ value: "", valid: false });
    setTraceabilityTypeObj("");
  }, [requestType.value]);

  const idInputHandler = (event) => {
    const textValue = event.target.value;
    const oldTraceability = props.traceabilityLinks.find(
      (a) => a.id === textValue
    );
    const oldTraceabilityType = props.traceabilityLinkTypes.find(
      (traceabilityType) =>
        oldTraceability.traceability_Link_Type === traceabilityType.name
    );
    const firstArtifact = props.artifacts.find(
      (artifact) => artifact.name === oldTraceability.first_artifact
    );
    const secondArtifact = props.artifacts.find(
      (artifact) => artifact.name === oldTraceability.second_artifact
    );

    const alreadyExistRequest = props.myTraceabilityLinkChangeRequests
      .filter((request) => request.status === "Pending")
      .find((request) => request.traceability_link_id === textValue);

    if (textValue === "") {
      setID({ value: textValue, valid: false, error: "" });
    } else if (alreadyExistRequest) {
      setID({
        value: textValue,
        valid: false,
        error: "You already have a pending request on this traceability link",
      });
      setName({ value: oldTraceability.name, valid: false, error: "" });
      setDescription({
        value: oldTraceability.description,
        valid: false,
        error: "",
      });
      setTraceabilityType({
        value: oldTraceabilityType.id,
        valid: false,
        error: "",
      });
      setTraceabilityTypeObj(oldTraceabilityType);
      setFirstArtifact({ value: firstArtifact.id, valid: false });
      setSecondArtifact({ value: secondArtifact.id, valid: false });
    } else {
      setID({ value: textValue, valid: true, error: "" });
      setName({ value: oldTraceability.name, valid: false, error: "" });
      setDescription({
        value: oldTraceability.description,
        valid: false,
        error: "",
      });
      setTraceabilityType({
        value: oldTraceabilityType.id,
        valid: false,
        error: "",
      });
      setTraceabilityTypeObj(oldTraceabilityType);
      setFirstArtifact({ value: firstArtifact.id, valid: false });
      setSecondArtifact({ value: secondArtifact.id, valid: false });
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
    setTraceabilityType({ value: event.target.value, valid: true });
    setTraceabilityTypeObj(
      props.traceabilityLinkTypes.find(
        (element) => element.id == event.target.value
      )
    );
    setFirstArtifact({ value: "", valid: false });
    setSecondArtifact({ value: "", valid: false });
  };
  const handleFirstArtifact = (event) => {
    setFirstArtifact({ value: event.target.value, valid: true });
  };
  const handleSecondArtifact = (event) => {
    setSecondArtifact({ value: event.target.value, valid: true });
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
    const traceabilityLinksName = props.traceabilityLinks.map((p) => p.name);

    if (requestType.value === "Create Traceability Link") {
      if (traceabilityLinksName.indexOf(name.value) !== -1) {
        setName({
          ...name,
          valid: false,
          error: "Traceability link already exists.",
        });
        return;
      }
      props.onMakeTraceabilityLinkCreationRequest(
        requestTitle.value,
        requestDescription.value,
        requestType.value,
        props.selectedProject.id,
        name.value,
        description.value,
        traceabilityType.value,
        props.username,
        firstArtifact.value,
        secondArtifact.value,
        props.token
      );
    } else if (requestType.value === "Modify Traceability Link") {
      const oldTraceabilityLink = props.traceabilityLinks.find(
        (traceability) => traceability.id === id.value
      );
      if (
        traceabilityLinksName
          .filter((traceability) => traceability !== oldTraceabilityLink.name)
          .indexOf(name.value) !== -1
      ) {
        setName({
          ...name,
          valid: false,
          error: "Traceability link already exists.",
        });
        return;
      }

      props.onMakeTraceabilityLinkModificationRequest(
        requestTitle.value,
        requestDescription.value,
        requestType.value,
        props.selectedProject.id,
        id.value,
        name.value,
        description.value,
        traceabilityType.value,
        props.username,
        firstArtifact.value,
        secondArtifact.value,
        props.token
      );
    } else if (requestType.value === "Remove Traceability Link") {
      props.onMakeTraceabilityLinkDeletionRequest(
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
  };

  const handleRedirect = () => {
    if (submit)
      if (!props.loading)
        if (!props.error) {
          props.history.push("/project-details", {
            value: 1,
            alert: {
              name: requestTitle.value,
              msg:
                "The change request on traceability link has been created successfully!",
              to: "/change-requests",
              type: "traceability link",
            },
          });
        } else console.error("Error");
  };

  const handleDisabledBtn = () => {
    var valid = true;

    if (!requestTitle.valid || !requestType.valid) valid = false;
    if (requestType.value === "Create Traceability Link") {
      if (
        !name.valid ||
        !traceabilityType.valid ||
        !firstArtifact.valid ||
        !secondArtifact.valid
      )
        valid = false;
    } else if (requestType.value === "Modify Traceability Link") {
      if (name.error) valid = false;
      if (id.valid && firstArtifact.value && secondArtifact.value) {
        if (
          !name.valid &&
          !description.valid &&
          !traceabilityType.valid &&
          !firstArtifact.valid &&
          !secondArtifact.valid
        )
          valid = false;
      } else valid = false;

      // if (
      //   !id.valid ||
      //   !name.valid ||
      //   !traceabilityType.valid ||
      //   !firstArtifact.valid ||
      //   !secondArtifact.valid
      // )
      //   valid = false;
    } else if (requestType.value === "Remove Traceability Link") {
      if (!id.valid) valid = false;
    }
    return valid;
  };

  const goBack = () => {
    props.history.goBack();
  };

  const handleRequestType = () => {
    if (requestType.value === "Create Traceability Link")
      return (
        <Paper elevation={3} className={classes.paperContainer}>
          <Typography component="h2" variant="h5">
            {requestType.value}
          </Typography>
          {displayCreateTraceabilityLink()}
        </Paper>
      );
    else if (requestType.value === "Modify Traceability Link")
      return (
        <Paper elevation={3} className={classes.paperContainer}>
          <Typography component="h2" variant="h5">
            {requestType.value}
          </Typography>
          {displayModifyTraceabilityLink()}
        </Paper>
      );
    else if (requestType.value === "Remove Traceability Link")
      return (
        <Paper elevation={3} className={classes.paperContainer}>
          <Typography component="h2" variant="h5">
            {requestType.value}
          </Typography>
          {displayRemoveTraceabilityLink()}
        </Paper>
      );
  };
  const displayCreateTraceabilityLink = () => {
    const firstFilteredArtifacts = props.artifacts.filter(
      (artifact) =>
        artifact.artifact_type === traceabilityTypeObj.first_artifact_type &&
        secondArtifact.value !== artifact.id
    );
    const secondFilteredArtifacts = props.artifacts.filter(
      (artifact) =>
        artifact.artifact_type === traceabilityTypeObj.second_artifact_type &&
        firstArtifact.value !== artifact.id
    );
    return (
      <div>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Traceability Link name"
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
          label="Traceability Link description"
          type="description"
          id="description"
          onChange={descriptionInputHandler}
          value={description.value}
        />

        <FormControl required fullWidth>
          <InputLabel id="demo-simple-select-label">
            Traceability Link Type
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={traceabilityType.value}
            onChange={handleTypeChange}
          >
            {props.traceabilityLinkTypes.map((type) => {
              return (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl required fullWidth margin="normal">
          <InputLabel id="firstArtifact">First Artifact </InputLabel>
          <Select
            labelId="firstArtifact"
            id="firstArtifactSelect"
            value={firstArtifact.value}
            onChange={handleFirstArtifact}
            disabled={!Boolean(traceabilityTypeObj)}
          >
            {firstFilteredArtifacts.length === 0 ? (
              <MenuItem value={"empty artifact"} disabled>
                {"The project does not have artifact supported by this type " +
                  `"${traceabilityTypeObj.name}"`}
              </MenuItem>
            ) : traceabilityTypeObj ? (
              firstFilteredArtifacts.map((artifact) => {
                return (
                  <MenuItem key={artifact.id} value={artifact.id}>
                    {artifact.name}
                  </MenuItem>
                );
              })
            ) : null}
          </Select>
        </FormControl>
        <FormControl required fullWidth>
          <InputLabel id="secondArtifact" margin="normal">
            Second Artifact{" "}
          </InputLabel>
          <Select
            labelId="secondArtifact"
            id="secondArtifactSelect"
            value={secondArtifact.value}
            onChange={handleSecondArtifact}
            disabled={!Boolean(traceabilityTypeObj)}
          >
            {secondFilteredArtifacts.length === 0 ? (
              <MenuItem value={"empty artifact"} disabled>
                {"The project does not have artifact supported by this type " +
                  `"${traceabilityTypeObj.name}"`}
              </MenuItem>
            ) : traceabilityTypeObj ? (
              secondFilteredArtifacts.map((artifact) => {
                return (
                  <MenuItem key={artifact.id} value={artifact.id}>
                    {artifact.name}
                  </MenuItem>
                );
              })
            ) : null}
          </Select>
        </FormControl>
      </div>
    );
  };
  const displayModifyTraceabilityLink = () => {
    const firstFilteredArtifacts = props.artifacts.filter(
      (artifact) =>
        artifact.artifact_type === traceabilityTypeObj.first_artifact_type &&
        secondArtifact.value !== artifact.id
    );
    const secondFilteredArtifacts = props.artifacts.filter(
      (artifact) =>
        artifact.artifact_type === traceabilityTypeObj.second_artifact_type &&
        firstArtifact.value !== artifact.id
    );

    return (
      <div>
        <FormControl fullWidth margin="normal" required error={id.error}>
          <InputLabel id="traceability-link-select">
            Select Traceability Link
          </InputLabel>
          <Select
            labelId="traceability-link-select"
            id="traceability-link-simple-select"
            value={id.value}
            onChange={idInputHandler}
          >
            {props.traceabilityLinks.length === 0 ? (
              <MenuItem value={"Empty"} disabled>
                The project does not have Traceability Links!
              </MenuItem>
            ) : (
              props.traceabilityLinks.map((tLink) => {
                return (
                  <MenuItem key={tLink.id} value={tLink.id}>
                    {tLink.name}
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
          label="Traceability Link new name"
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
          label="Traceability Link description"
          type="description"
          id="description"
          onChange={descriptionInputHandler}
          value={description.value}
          disabled={!id.valid}
        />

        <FormControl fullWidth required disabled={!id.valid} margin="normal">
          <InputLabel id="demo-simple-select-label">
            Traceability Link Type
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={traceabilityType.value}
            onChange={handleTypeChange}
          >
            {props.traceabilityLinkTypes.map((type) => {
              return (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl required fullWidth margin="normal" disabled={!id.valid}>
          <InputLabel id="firstArtifact">First Artifact </InputLabel>
          <Select
            labelId="firstArtifact"
            id="firstArtifactSelect"
            value={firstArtifact.value}
            onChange={handleFirstArtifact}
            disabled={!Boolean(traceabilityTypeObj) || !id.valid}
          >
            {firstFilteredArtifacts.length === 0 ? (
              <MenuItem value={"empty artifact"} disabled>
                {
                  "The project does not have any artifact supported by this type "
                }
                "{traceabilityTypeObj.name}"{" "}
              </MenuItem>
            ) : traceabilityTypeObj ? (
              firstFilteredArtifacts.map((artifact) => {
                return (
                  <MenuItem key={artifact.id} value={artifact.id}>
                    {artifact.name}
                  </MenuItem>
                );
              })
            ) : null}
          </Select>
        </FormControl>
        <FormControl required fullWidth margin="normal" disabled={!id.valid}>
          <InputLabel id="secondArtifact">Second Artifact </InputLabel>
          <Select
            labelId="secondArtifact"
            id="secondArtifactSelect"
            value={secondArtifact.value}
            onChange={handleSecondArtifact}
            disabled={!Boolean(traceabilityTypeObj) || !id.valid}
          >
            {secondFilteredArtifacts.length === 0 ? (
              <MenuItem value={"empty artifact"} disabled>
                {
                  "The project does not have any artifact supported by this type "
                }
                "{traceabilityTypeObj.name}"{" "}
              </MenuItem>
            ) : traceabilityTypeObj ? (
              secondFilteredArtifacts.map((artifact) => {
                return (
                  <MenuItem key={artifact.id} value={artifact.id}>
                    {artifact.name}
                  </MenuItem>
                );
              })
            ) : null}
          </Select>
        </FormControl>
      </div>
    );
  };
  const displayRemoveTraceabilityLink = () => {
    return (
      <FormControl
        className={classes.formControl}
        fullWidth
        margin="normal"
        required
        error={id.error}
      >
        <InputLabel id="traceability-link-select">
          Traceability Link Name
        </InputLabel>
        <Select
          labelId="traceability-link-select"
          id="traceability-link-simple-select"
          value={id.value}
          onChange={idInputHandler}
          fullWidth
        >
          {props.traceabilityLinks.length === 0 ? (
            <MenuItem value={"Empty"} disabled>
              The project does not have Traceability Links!
            </MenuItem>
          ) : (
            props.traceabilityLinks.map((t) => {
              return (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              );
            })
          )}
        </Select>
        <FormHelperText>{id.error}</FormHelperText>
      </FormControl>
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
              Create Traceability Link Change Request
            </Typography>

            <form
              className={classes.form}
              noValidate
              onSubmit={handleSubmit}
              className={classes.formControl}
            >
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
                    Traceability Link Request Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={requestType.value}
                    onChange={requestTypeInputHandler}
                  >
                    <MenuItem value={"Create Traceability Link"}>
                      Create Traceability Link
                    </MenuItem>
                    <MenuItem value={"Modify Traceability Link"}>
                      Modify Traceability Link
                    </MenuItem>
                    <MenuItem value={"Remove Traceability Link"}>
                      Remove Traceability Link
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
    loading: state.myTraceabilityLinkChangeRequests.loading,
    artifactTypes: state.artifactTypes.artifactTypes,
    traceabilityLinks: state.traceabilityLinks.traceabilityLinks,
    traceabilityLinkTypes: state.traceabilityLinkTypes.traceabilityLinkTypes,
    myTraceabilityLinkChangeRequests:
      state.myTraceabilityLinkChangeRequests.myTraceabilityLinkChangeRequests,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchTraceabilityLinkTypes: (pID, token) =>
      dispatch(
        traceabilityLinkTypesActions.fetchTraceabilityLinkTypes(pID, token)
      ),

    onMakeTraceabilityLinkCreationRequest: (
      title,
      description,
      requestType,
      projectID,
      traceabilityLinkName,
      traceabilityLinkDescription,
      traceabilityLinkType,
      username,
      firstArtifact,
      secondArtifact,
      token
    ) =>
      dispatch(
        myTraceabilityLinkChangeRequestsActions.createCreationTraceabilityLinkChangeRequest(
          title,
          description,
          requestType,
          projectID,
          traceabilityLinkName,
          traceabilityLinkDescription,
          traceabilityLinkType,
          username,
          firstArtifact,
          secondArtifact,
          token
        )
      ),
    onMakeTraceabilityLinkModificationRequest: (
      title,
      description,
      requestType,
      projectID,
      traceabilityLinkID,
      traceabilityLinkName,
      traceabilityLinkDescription,
      traceabilityLinkType,
      username,
      firstArtifact,
      secondArtifact,
      token
    ) =>
      dispatch(
        myTraceabilityLinkChangeRequestsActions.createModificationTraceabilityLinkChangeRequest(
          title,
          description,
          requestType,
          projectID,
          traceabilityLinkID,
          traceabilityLinkName,
          traceabilityLinkDescription,
          traceabilityLinkType,
          username,
          firstArtifact,
          secondArtifact,
          token
        )
      ),
    onMakeTraceabilityLinkDeletionRequest: (
      title,
      description,
      requestType,
      projectID,
      traceabilityLinkID,
      username,
      token
    ) =>
      dispatch(
        myTraceabilityLinkChangeRequestsActions.createDeletionTraceabilityLinkChangeRequest(
          title,
          description,
          requestType,
          projectID,
          traceabilityLinkID,
          username,
          token
        )
      ),
    onFetchMyTraceabilityLinkChangeRequests: (projectID, token) =>
      dispatch(
        myTraceabilityLinkChangeRequestsActions.fetchMyTraceabilityLinkChangeRequests(
          projectID,
          token
        )
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MakeTraceabilityChangeRequest);
