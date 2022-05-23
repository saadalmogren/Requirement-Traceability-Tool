import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Copyright from "../components/Copyright/Copyright";
import React, { useState } from "react";
import EditIcon from "@material-ui/icons/Edit";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Fade, Grid, IconButton } from "@material-ui/core";
import { connect } from "react-redux";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as changeUserRoleActions from "../store/actions/changeUserRole";
import * as projectDetailsActions from "../store/actions/projectDetails";
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
    margin: theme.spacing(3),
    minWidth: 250,
  },
  redBtn: {
    color: "red",
  },
}));

function ChangeManagement(props) {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [submit, setSubmit] = useState(false);

  if (props.projectDetails.manager !== props.username) {
    console.error("You don't have the right PRIVILEGES");
    props.history.push("/project-details");
  }

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpen(false);
    props.onChangeManagement(
      props.selectedProject.id,
      props.username,
      name,
      props.token
    );
    props.onFetchProjectsDetails(props.selectedProject.id, props.token);
    setSubmit(true);
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleRedirect = () => {
    if (submit)
      if (!props.loading)
        props.history.push("/project-details", {
          alert: {
            name: name,
            msg: "The management has been changed successfully to",
          },
        });
  };

  const displayAlertDialog = () => {
    return (
      <Grid item container>
        <Button
          variant="contained"
          type="submit"
          color="primary"
          fullWidth
          onClick={handleClickOpen}
          disabled={!name}
          className={classes.submit}
        >
          Change Management
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Change Management!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to change management to{" "}
              <strong>{name} </strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              color="primary"
              className={classes.redBtn}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
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
          <Grid
            item
            container
            lg={4}
            justify="center"
            direction="column"
            alignItems="center"
            className={classes.paper}
          >
            <Avatar className={classes.avatar}>
              <EditIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Change Management
            </Typography>

            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Username </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={name.value}
                onChange={handleChange}
              >
                {props.users.map((user) => {
                  if (user !== props.username) {
                    return (
                      <MenuItem key={user} value={user}>
                        {user}
                      </MenuItem>
                    );
                  } else if (props.users.length <= 1)
                    return (
                      <MenuItem
                        key={"You don't have any users in the project"}
                        value={"You don't have any users in the project"}
                        disabled
                      >
                        {"You don't have any users in the project"}
                      </MenuItem>
                    );
                })}
              </Select>
            </FormControl>

            {displayAlertDialog()}
          </Grid>
        </Grid>
        <Grid item lg={2}></Grid>

        <Box mt={8}>
          <Copyright />
        </Box>
        {handleRedirect()}
      </Grid>
    </Fade>
  );
}

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    token: state.auth.token,
    users: state.users.projectUsers,
    selectedProject: state.projects.selectedProject,
    userPrivileges: state.changeUserRole.userPrivileges.map((p) => p.name),
    projectDetails: state.projectDetails.projectDetails,
    loading: state.projectDetails.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeManagement: (projectID, oldUsername, newUsername, token) =>
      dispatch(
        changeUserRoleActions.changeManagement(
          projectID,
          oldUsername,
          newUsername,
          token
        )
      ),
    onFetchProjectsDetails: (pID, token) =>
      dispatch(projectDetailsActions.fetchProjectDetails(pID, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeManagement);
