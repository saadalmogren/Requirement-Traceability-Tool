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
import * as traceabilityLinksActions from "../store/actions/traceabilityLinks";
import * as traceabilityLinkTypesActions from "../store/actions/traceabilityLinkTypes";
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

const artifacts = ["Artifact1", "Artifact12", "Artifact3", "Requirements"];
const traceabilityTypes = [
  "Traceability Type1",
  "TraceabilityLink",
  "Traceability Type2",
  "Traceability Type3",
  "Depends on",
];

function ModifyTraceabilityLink(props) {
  const classes = useStyles();

  useEffect(() => {
    props.onFetchTraceabilityLinkTypes(props.selectedProject.id, props.token);
  }, []);

  const [oldTraceabilityLink, setOldTraceabilityLink] = useState(
    props.location.state ? props.location.state.traceabilityLink[0] : ""
  );

  if (!oldTraceabilityLink) props.history.push("/project-details");

  if (
    props.userPrivileges
      .map((p) => p.name)
      .indexOf("Modify traceability link") === -1
  ) {
    console.error("You don't have the right PRIVILEGES");
    props.history.push("/project-details");
  }

  const [name, setName] = useState({
    value: oldTraceabilityLink.name,
    valid: false,
  });
  const [description, setDescription] = useState({
    value: oldTraceabilityLink.description,
    valid: false,
  });
  const [traceabilityType, setTraceabilityType] = useState(
    props.traceabilityLinkTypes.find(
      (element) => element.name == oldTraceabilityLink.traceability_Link_Type
    )
  );
  const [firstArtifact, setFirstArtifact] = useState({
    value: props.artifacts.find(
      (element) => element.name == oldTraceabilityLink.first_artifact
    ),
    valid: false,
  });
  const [secondArtifact, setSecondArtifact] = useState({
    value: props.artifacts.find(
      (element) => element.name == oldTraceabilityLink.second_artifact
    ),
    valid: false,
  });

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

  const handleTraceabilityType = (event) => {
    const newValue = props.traceabilityLinkTypes.find(
      (element) => element.id == event.target.value
    );
    setTraceabilityType(newValue);
    setFirstArtifact({ value: "", valid: false });
    setSecondArtifact({ value: "", valid: false });
  };
  const handleFirstArtifact = (event) => {
    const newValue = props.artifacts.find(
      (element) => element.id == event.target.value
    );
    setFirstArtifact({ value: newValue, valid: true });
  };
  const handleSecondArtifact = (event) => {
    const newValue = props.artifacts.find(
      (element) => element.id == event.target.value
    );
    setSecondArtifact({ value: newValue, valid: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      props.traceabilityLinks.map((t) => t.name).indexOf(name.value) !== -1 &&
      oldTraceabilityLink.name !== name.value
    ) {
      setName({
        ...name,
        error: "Traceability Link Name Already exists",
        valid: false,
      });
      return;
    }
    props.onModifyTraceabilityLink(
      props.selectedProject.id,
      name.value,
      description.value,
      traceabilityType.id,
      oldTraceabilityLink.id,
      props.username,
      firstArtifact.value.id,
      secondArtifact.value.id,
      props.token
    );

    if (!props.error)
      props.history.push("/project-details", {
        alert: {
          name: name.value,
          msg: "The traceability link has been modified successfully!",
        },
        value: 1,
      });
    else props.history.push("/project-details", { value: 1 });
  };

  const handleDisabled = () => {
    var invalid = true;

    if (!name.error)
      if (firstArtifact.value && secondArtifact.value)
        if (
          name.valid ||
          description.valid ||
          firstArtifact.valid ||
          secondArtifact.valid
        )
          invalid = false;
    return invalid;
  };

  const displayFirstArtifacts = () => {
    if (traceabilityType) {
      const filteredArtifacts = props.artifacts.filter(
        (artifact) =>
          artifact.artifact_type === traceabilityType.first_artifact_type &&
          secondArtifact.value.id !== artifact.id
      );
      if (filteredArtifacts.length > 0)
        return filteredArtifacts.map((artifact) => {
          return (
            <MenuItem key={artifact.id} value={artifact.id}>
              {artifact.name}
            </MenuItem>
          );
        });
      else
        return (
          <MenuItem value={"Disabled"} disabled>
            {"The project does not have any artifact supported by this type "}"
            {traceabilityType.name}"
          </MenuItem>
        );
    } else return null;
  };

  const displaySecondArtifacts = () => {
    if (traceabilityType) {
      const filteredArtifacts = props.artifacts.filter(
        (artifact) =>
          artifact.artifact_type === traceabilityType.second_artifact_type &&
          firstArtifact.value.id !== artifact.id
      );

      if (filteredArtifacts.length > 0)
        return filteredArtifacts.map((artifact) => {
          return (
            <MenuItem key={artifact.id} value={artifact.id}>
              {artifact.name}
            </MenuItem>
          );
        });
      else
        return (
          <MenuItem value={"Disabled"} disabled>
            {"The project does not have any artifact supported by this type "}"
            {traceabilityType.name}"
          </MenuItem>
        );
    } else return null;
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
              Modify Traceability Link
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
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
              <FormControl className={classes.formControl} fullWidth required>
                <InputLabel id="traceabilityType">
                  Traceability Link Type{" "}
                </InputLabel>
                <Select
                  labelId="traceabilityType"
                  id="traceabilityTypeSelect"
                  value={traceabilityType.id}
                  onChange={handleTraceabilityType}
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
              <FormControl className={classes.formControl} fullWidth required>
                <InputLabel id="firstArtifact">First Artifact </InputLabel>
                <Select
                  labelId="firstArtifact"
                  id="firstArtifactSelect"
                  value={firstArtifact.value.id}
                  onChange={handleFirstArtifact}
                  disabled={!Boolean(traceabilityType)}
                >
                  {displayFirstArtifacts()}
                </Select>
              </FormControl>
              <FormControl className={classes.formControl} fullWidth required>
                <InputLabel id="secondArtifact">Second Artifact </InputLabel>
                <Select
                  labelId="secondArtifact"
                  id="secondArtifactSelect"
                  value={secondArtifact.value.id}
                  onChange={handleSecondArtifact}
                  disabled={!Boolean(traceabilityType)}
                >
                  {displaySecondArtifacts()}
                </Select>
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={handleDisabled()}
              >
                Modify Traceability Link
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
    traceabilityLinks: state.traceabilityLinks.traceabilityLinks,
    isTraceabilityLinkExist: state.traceabilityLinks.isTraceabilityLinkExist,
    loading: state.traceabilityLinks.loading,
    traceabilityLinkTypes: state.traceabilityLinkTypes.traceabilityLinkTypes,
    artifacts: state.artifacts.artifacts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onModifyTraceabilityLink: (
      projectID,
      traceabilityLinkName,
      traceabilityLinkDescription,
      traceabilityLinkType,
      traceabilityLinkID,
      username,
      firstArtifact,
      secondArtifact,
      token
    ) =>
      dispatch(
        traceabilityLinksActions.modifyTraceabilityLinkInProject(
          projectID,
          traceabilityLinkName,
          traceabilityLinkDescription,
          traceabilityLinkType,
          traceabilityLinkID,
          username,
          firstArtifact,
          secondArtifact,
          token
        )
      ),
    onFetchTraceabilityLinkTypes: (pID, token) =>
      dispatch(
        traceabilityLinkTypesActions.fetchTraceabilityLinkTypes(pID, token)
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModifyTraceabilityLink);
