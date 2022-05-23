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

const artifacts = ["artifact1", "artifact2", "artifact3", "Requirements"];
const traceabilityTypes = [
  "Traceability Type1",
  "Traceability Type2",
  "Traceability Type3",
  "Depends on",
];

function CreateTraceabilityLink(props) {
  const classes = useStyles();

  const [name, setName] = useState({ value: "", valid: false, error: "" });
  const [description, setDescription] = useState({
    value: "",
    valid: false,
  });
  const [traceabilityType, setTraceabilityType] = useState(
    props.location.state ? props.location.state.traceabilityLinkType.id : ""
  );
  const [traceabilityTypeObj, setTraceabilityTypeObj] = useState(
    props.location.state ? props.location.state.traceabilityLinkType : ""
  );
  const [availableTypes, setAvailableTypes] = useState([]);
  const [firstArtifact, setFirstArtifact] = useState(
    props.location.state ? props.location.state.firstArtifact : ""
  );
  const [secondArtifact, setSecondArtifact] = useState(
    props.location.state ? props.location.state.secondArtifact : ""
  );

  useEffect(() => {
    props.onFetchTraceabilityLinkTypes(props.selectedProject.id, props.token);
  }, []);

  // useEffect(() => {
  //   const available = props.traceabilityLinkTypes.filter(
  //     (t) =>
  //       t.first_artifact_type === firstArtifact.artifact_type &&
  //       t.second_artifact_type === secondArtifact.artifact_type
  //   );
  //   console.log("available: ", available);
  // }, [firstArtifact, secondArtifact]);

  // useEffect(() => {
  //   if (props.location.state.artifact) {
  //     setFirstArtifact(props.location.state.artifact[0]);
  //     setSecondArtifact(props.location.state.artifact[1]);
  //   }
  // }, [props.location.state]);

  if (
    props.userPrivileges
      .map((p) => p.name)
      .indexOf("Create traceability link") === -1
  ) {
    console.error("You don't have the right PRIVILEGES");
    props.history.push("/project-details");
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
      setDescription({ value: textValue, valid: true });
    } else {
      setDescription({ value: textValue, valid: true });
    }
  };

  const handleTraceabilityType = (event) => {
    setTraceabilityType(event.target.value);
    setTraceabilityTypeObj(
      props.traceabilityLinkTypes.find(
        (element) => element.id == event.target.value
      )
    );

    setFirstArtifact("");
    setSecondArtifact("");
  };
  const handleFirstArtifact = (event) => {
    setFirstArtifact(event.target.value);
  };
  const handleSecondArtifact = (event) => {
    setSecondArtifact(event.target.value);
  };
  const goBack = () => {
    props.history.goBack();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (props.traceabilityLinks.map((t) => t.name).indexOf(name.value) !== -1) {
      setName({
        ...name,
        error: "Traceability Link Name Already exists",
        valid: false,
      });
      return;
    }
    props.onCreateTraceabilityLink(
      props.selectedProject.id,
      name.value,
      description.value,
      traceabilityType,
      props.username,
      firstArtifact.id,
      secondArtifact.id,
      props.token
    );
    // console.log(
    //   props.selectedProject.id,
    //   name.value,
    //   description.value,
    //   traceabilityType,
    //   props.username,
    //   firstArtifact.id,
    //   secondArtifact.id
    // );
    if (!props.error)
      props.history.push("/project-details", {
        alert: {
          name: name.value,
          msg: "The traceability link has been created successfully!",
        },
        value: 1,
      });
    else props.history.push("/project-details", { value: 1 });
  };

  const handleDisabled = () => {
    var invalid = true;
    if (name.valid && traceabilityType && firstArtifact && secondArtifact)
      invalid = false;
    else invalid = true;
    return invalid;
  };
  const displayFirstArtifacts = () => {
    if (traceabilityTypeObj) {
      const filteredArtifacts = props.artifacts.filter(
        (artifact) =>
          artifact.artifact_type === traceabilityTypeObj.first_artifact_type &&
          secondArtifact.id !== artifact.id
      );
      if (filteredArtifacts.length > 0)
        return filteredArtifacts.map((artifact) => {
          return (
            <MenuItem key={artifact.id} value={artifact}>
              {artifact.name}
            </MenuItem>
          );
        });
      else
        return (
          <MenuItem value={"Disabled"} disabled>
            {"The project does not have any artifact supported by this type "}"
            {traceabilityTypeObj.name}"
          </MenuItem>
        );
    } else return null;
  };

  const displaySecondArtifacts = () => {
    if (traceabilityTypeObj) {
      const filteredArtifacts = props.artifacts.filter((artifact) => {
        return (
          artifact.artifact_type === traceabilityTypeObj.second_artifact_type &&
          firstArtifact.id !== artifact.id
        );
      });
      if (filteredArtifacts.length > 0)
        return filteredArtifacts.map((artifact) => {
          return (
            <MenuItem key={artifact.id} value={artifact}>
              {artifact.name}
            </MenuItem>
          );
        });
      else
        return (
          <MenuItem value={"Disabled"} disabled>
            {"The project does not have any artifact supported by this type "}"
            {traceabilityTypeObj.name}"
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
              Create Traceability Link
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
                  value={traceabilityType}
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
                  value={firstArtifact}
                  onChange={handleFirstArtifact}
                  disabled={!Boolean(traceabilityTypeObj)}
                >
                  {displayFirstArtifacts()}
                </Select>
              </FormControl>
              <FormControl className={classes.formControl} fullWidth required>
                <InputLabel id="secondArtifact">Second Artifact </InputLabel>
                <Select
                  labelId="secondArtifact"
                  id="secondArtifactSelect"
                  value={secondArtifact}
                  onChange={handleSecondArtifact}
                  disabled={!Boolean(traceabilityTypeObj)}
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
                Create Traceability Link
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
    onCreateTraceabilityLink: (
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
        traceabilityLinksActions.createTraceabilityLinkInProject(
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
    onFetchTraceabilityLinkTypes: (pID, token) =>
      dispatch(
        traceabilityLinkTypesActions.fetchTraceabilityLinkTypes(pID, token)
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTraceabilityLink);
