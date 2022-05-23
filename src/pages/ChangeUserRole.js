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
import { Fade, Grid, IconButton } from "@material-ui/core";
import { connect } from "react-redux";
// import * as projectActions from "../store/actions/projectActions";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import * as changeUserRoleActions from "../store/actions/changeUserRole";
import * as rolesActions from "../store/actions/roles";

const rows = [
  { roleID: "role1", checked: true },
  { roleID: "role2", checked: true },
  { roleID: "role3", checked: false },
  {
    roleID: "role4",
    checked: false,
  },
];

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
  },
}));

function ChangeUserRole(props) {
  const classes = useStyles();
  const [name, setName] = useState({
    value: props.location.state ? props.location.state.modifiedUser : "",
  });
  const [submit, setSubmit] = useState(false);

  const [roles, setRoles] = React.useState([]);

  if (props.projectDetails.manager !== props.username) {
    console.error("You don't have the right PRIVILEGES");
    props.history.push("/project-details");
  }

  useEffect(() => {
    props.onFetchUserRoles(props.selectedProject.id, name.value, props.token);
    props.onFetchRoles(props.selectedProject.id, props.token);
  }, []);

  useEffect(() => {
    const rows2 = [
      props.roles.map((role, index) => {
        return {
          roleID: role.name,
          checked: props.userRoles.indexOf(role.name) !== -1,
        };
      }),
    ];
    // arrays inside an array
    setRoles(rows2[0]);
  }, [props.userRoles, name.value, props.roles]);

  const handleBoxChange = (event) => {
    var tempRoles = [...roles];
    tempRoles.map((role, index) => {
      if (role.roleID === event.target.name) {
        tempRoles[index].checked = event.target.checked;
      }
    });
    setRoles(tempRoles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const priv = roles.filter((r) => r.checked).map((r) => r.roleID);
    const user = { name: name.value, roles: priv };

    const addedRoles = priv.filter((r) => props.userRoles.indexOf(r) === -1);
    // console.log("addedRoles", addedRoles);

    const removedRoles = props.userRoles.filter((r) => priv.indexOf(r) === -1);
    // console.log("removedRoles", removedRoles);

    if (addedRoles.length > 0) {
      props.onAddRolesToUser(
        props.selectedProject.id,
        name.value,
        addedRoles,
        props.token
      );
    }
    if (removedRoles.length > 0) {
      props.onRemoveRolesFromUser(
        props.selectedProject.id,
        name.value,
        removedRoles,
        props.token
      );
    }
    setSubmit(true);
  };
  const handleDisabledBtn = () => {
    const priv = roles.filter((r) => r.checked).map((r) => r.roleID);
    const addedRoles = priv.filter((r) => props.userRoles.indexOf(r) === -1);
    const removedRoles = props.userRoles.filter((r) => priv.indexOf(r) === -1);

    if (addedRoles.length > 0 || removedRoles.length > 0) return true;
  };

  const handleRedirect = () => {
    if (submit)
      if (!props.loading)
        if (!props.error)
          props.history.push("/project-details", {
            alert: {
              name: name.value,
              msg: "The user has been modified successfully!",
            },
          });
  };

  const displayRoles = () => {
    return (
      <React.Fragment>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Roles</FormLabel>
          <FormGroup>
            {roles.map((role, index) => {
              return role.roleID === "Project Manager" ? null : (
                <FormControlLabel
                  key={role.roleID + index}
                  control={
                    <Checkbox
                      checked={role.checked}
                      onChange={handleBoxChange}
                      name={role.roleID}
                    />
                  }
                  label={role.roleID}
                />
              );
            })}
          </FormGroup>

          {/* <FormHelperText>Be careful</FormHelperText> */}
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
            className={classes.paper}
            justify="center"
            lg={4}
            direction="column"
            alignItems="center"
          >
            <Avatar className={classes.avatar}>
              <EditIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Change User Role
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Username"
                name="name"
                autoComplete="off"
                autoFocus
                value={name.value}
                error={name.error ? true : false}
                helperText={name.error ? name.error : ""}
                disabled
              />
              <Grid item container justify="center">
                {displayRoles()}
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={!handleDisabledBtn()}
              >
                Change User Role
              </Button>
            </form>
          </Grid>
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
    users: state.users.projectUsers,
    selectedProject: state.projects.selectedProject,
    roles: state.roles.projectRoles,
    userRoles: state.changeUserRole.userRoles,
    userPrivileges: state.changeUserRole.userPrivileges.map((p) => p.name),
    projectDetails: state.projectDetails.projectDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchRoles: (pID, token) =>
      dispatch(rolesActions.fetchProjectRoles(pID, token)),
    onFetchUserRoles: (pID, username, token) =>
      dispatch(changeUserRoleActions.fetchUserRoles(pID, username, token)),
    onAddRolesToUser: (projectID, username, roles, token) =>
      dispatch(
        changeUserRoleActions.addRolesToUser(projectID, username, roles, token)
      ),
    onRemoveRolesFromUser: (projectID, username, roles, token) =>
      dispatch(
        changeUserRoleActions.removeRolesFromUser(
          projectID,
          username,
          roles,
          token
        )
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeUserRole);
