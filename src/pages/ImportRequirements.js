import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Copyright from "../components/Copyright/Copyright";
import React, { useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import HelpIcon from "@material-ui/icons/Help";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  Grid,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  withStyles,
} from "@material-ui/core";
import { connect } from "react-redux";
import * as artifactActions from "../store/actions/artifacts";
import * as artifactsActions from "../store/actions/artifacts";
import * as artifactTypesActions from "../store/actions/artifactTypes";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "40%",
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
const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

const checkUserAuthority = (props) => {
  const createArtifactTypes =
    props.userPrivileges.map((p) => p.name).indexOf("Create artifact") === -1 &&
    props.userPrivileges
      .map((p) => p.name)
      .indexOf("Create artifact of a specific type") !== -1
      ? props.userPrivileges
          .filter((p) => p.name === "Create artifact of a specific type")
          .map((p) => {
            if (p.name === "Create artifact of a specific type")
              return props.artifactTypes.filter(
                (type) => type.id === p.type
              )[0];
          })
          .map((p) => p.name)
      : null;
  if (
    props.userPrivileges.map((p) => p.name).indexOf("Create artifact") === -1 &&
    createArtifactTypes !== null &&
    createArtifactTypes.indexOf("Requirement") === -1
  ) {
    console.error("You don't have the right PRIVILEGES");
    props.history.push("/project-details");
  }
};

function ImportRequirements(props) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const [file, setFile] = useState({
    file: "",
    value: "",
    valid: false,
    error: "",
  });
  const [requirements, setRequirements] = useState([]);
  const [duplicate, setDuplicate] = useState([]);
  const [submit, setSubmit] = useState(false);

  checkUserAuthority(props);

  useEffect(() => {
    props.onFetchArtifacts(props.selectedProject.id, props.token);
  }, []);
  const handleClickOpen = () => {
    if (!file.valid) return;
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fileInputHandler = (event) => {
    const f = event.target.files[0];
    if (!f) return;
    const fileName = f.name;
    var fileExt = fileName.split(".");
    fileExt = fileExt[fileExt.length - 1];

    if (["text", "txt", "csv"].indexOf(fileExt) === -1) {
      setFile({
        file: f,
        value: fileName,
        valid: false,
        error: "Wrong file format",
      });
    } else if (fileName === "") {
      setFile({ file: f, value: fileName, valid: false });
    } else {
      setFile({ file: f, value: fileName, valid: true });
    }
  };

  const readFile = async () => {
    var tempRequirements = [];
    var valid = true;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      var lines = text.split("\n");

      lines.map((line) => {
        if (line === "") return;

        if (line.split(",").length === 2) {
          tempRequirements.push({
            id: line.split(",")[0].trim(),
            description: line.split(",")[1].trim(),
          });
        } else if (line.split(",").length === 1)
          tempRequirements.push({
            id: line.split(",")[0].trim(),
          });
        else {
          setFile({ ...file, error: "Wrong format", valid: false });
          valid = false;
        }
      });
      const existArtifacts = props.artifacts.map((r2) => r2.name);
      const requirementsID = tempRequirements.map((r) => r.id);
      const tempDuplicate = requirementsID.filter(
        (r) => existArtifacts.indexOf(r) !== -1
      );
      setRequirements(tempRequirements);
      setDuplicate(tempDuplicate);
      if (valid) handleClickOpen();
    };
    reader.readAsText(file.file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await readFile();

    if (!file.valid) return;
  };

  const handleConfirm = () => {
    handleClose();
    if (file.error) return;

    const finalizedRequirements = requirements.filter(
      (p) => duplicate.indexOf(p.id) === -1
    );
    const artifactTypeID = props.artifactTypes.filter(
      (aType) => aType.name === "Requirement"
    )[0].id;

    finalizedRequirements.map((req) => {
      props.onCreateArtifact(
        props.selectedProject.id,
        req.id,
        req.description ? req.description : "",
        artifactTypeID,
        props.username,
        props.token
      );
    });

    setSubmit(true);
  };

  const handleRedirect = () => {
    if (submit)
      props.history.push("/project-details", {
        alert: {
          name:
            "Requirements total: " +
            requirements.filter((req) => duplicate.indexOf(req.id) === -1)
              .length,
          msg: "The requirements has been imported successfully!",
        },
      });
    // if (!props.loading)
    //   if (!props.isUserExist && !error)
    //     props.history.push("/project-details");
  };

  return (
    <React.Fragment>
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
                <AddIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Import Requirements{" "}
                <HtmlTooltip
                  placement="top"
                  title={
                    <React.Fragment>
                      <Typography color="inherit">
                        Accepted File Format
                      </Typography>
                      (.csv, .txt, .text)
                      <Typography color="inherit">Correct Format</Typography>
                      Requirement Name*,Requirement Description
                      <br />
                      <b>Example:</b>
                      <br />
                      req1,req1 description
                      <br />
                      req2,req2 description
                    </React.Fragment>
                  }
                >
                  <HelpIcon color="primary" />
                </HtmlTooltip>
                {/* <Tooltip
                title="Correct format: ID,Description "
                placeholder="top"
              >
                <HelpIcon color="primary" />
              </Tooltip> */}
              </Typography>
              <form className={classes.form} noValidate onSubmit={handleSubmit}>
                <Grid container item direction="row">
                  {file.value ? (
                    <TextField
                      fullWidth
                      error={file.error}
                      id="standard-read-only-input"
                      label="File name"
                      value={file.value}
                      helperText={file.error}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  ) : null}

                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    component="label"
                    className={classes.fileBtn}
                  >
                    Choose a File
                    <input
                      type="file"
                      accept=".csv, text/plain"
                      hidden
                      onChange={fileInputHandler}
                    />
                  </Button>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={!file.valid}
                >
                  Import
                </Button>
              </form>
            </div>
          </Grid>
          {handleRedirect()}
          <Grid item lg={2}></Grid>

          <Box mt={8}>
            <Copyright />
          </Box>
        </Grid>
      </Fade>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Import Requirement Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to import these requirements (
            {requirements.length}):
            <ol>
              {requirements.map((p, index) => (
                <li key={p.id + index}>
                  {p.id}{" "}
                  {duplicate.indexOf(p.id) !== -1 ? <b>(exists)</b> : null}
                </li>
              ))}
            </ol>
            {duplicate.length > 0 ? (
              <b>Already (exists) requirements will be discarded.</b>
            ) : null}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    token: state.auth.token,
    selectedProject: state.projects.selectedProject,
    artifacts: state.artifacts.artifacts,
    userPrivileges: state.changeUserRole.userPrivileges,
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
    onFetchArtifacts: (pID, token) =>
      dispatch(artifactsActions.fetchArtifacts(pID, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportRequirements);
