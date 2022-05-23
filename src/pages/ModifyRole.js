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
import {
  Fade,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { connect } from "react-redux";
import * as rolesActions from "../store/actions/roles";
import * as modifyRoleActions from "../store/actions/modifyRole";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { UserInputValidation } from "../components/Validation/UserInputValidation";

// to loop through and render type input
const specificTypes = [
  "Create artifact of a specific type",
  "Modify artifact of a specific type",
  "Remove artifact of a specific type",
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

function ModifyRole(props) {
  const classes = useStyles();

  const [name, setName] = useState({
    value: props.location.state ? props.location.state.name : "",
    valid: false,
  });
  const [id, setID] = useState({
    value: props.location.state ? props.location.state.id : "",
    valid: false,
  });
  const [error, setError] = useState("");
  const [submit, setSubmit] = useState(false);
  const [artifactTypes, setArtifactTypes] = useState([]);
  const [roles, setRoles] = React.useState([]);
  const uniquePrivileges = [
    "Modify project information",
    "Remove project",
    "View project roles",
    "Create new role",
    "Modify role",
    "Remove role",
    "Change user role",
    "Change management",
  ];
  useEffect(() => {
    props.onFetchRolePrivileges(
      props.selectedProject.id,
      name.value,
      props.token
    );
    props.onFetchPrivileges(props.token);
  }, []);

  useEffect(() => {
    const privilegesNames = props.rolePrivileges.map((priv) => priv.name);
    const privilegesTypes = props.rolePrivileges.map((priv) => priv.type);

    const rows2 = props.privileges.map((privilege, index) => {
      return {
        roleID: privilege,
        checked: privilegesNames.indexOf(privilege) !== -1,
        type: privilegesTypes[privilegesNames.indexOf(privilege)],
      };
    });

    console.log("Rows2 at ModifyRole", rows2);

    // arrays inside an array + filter the unwanted unique priv
    setRoles(rows2.filter((r) => uniquePrivileges.indexOf(r.roleID) === -1));
    setArtifactTypes(props.artifactTypes);
  }, [props.rolePrivileges]);

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

  const handleBoxChange = (event) => {
    var tempRoles = [...roles];
    tempRoles.map((role, index) => {
      if (role.roleID === event.target.name) {
        tempRoles[index].checked = event.target.checked;
      }
    });
    setRoles(tempRoles);
  };
  const handleTypeChange = (event) => {
    var tempRoles = [...roles];
    const { value, name } = event.target;

    if (specificTypes.indexOf(name) !== -1) {
      tempRoles.map((r) => {
        if (r.roleID === name) r.type = value;
      });
      setRoles(tempRoles);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const priv = roles.filter((r) => r.checked).map((r) => r.roleID);
    const specificType = roles

      .filter((r) => r.checked)
      .map((r) => (r.type ? r.type : ""));

    const data = roles
      .filter((r) => r.checked)
      .map((r) => {
        return {
          name: r.roleID,
          type: r.type ? r.type : null,
        };
      });

    console.log("Modified data: ", data);

    const dataNames = data.map((p) => p.name);
    const dataType = data.map((p) => p.type);
    const rolePrivilegesNames = props.rolePrivileges.map((p) => p.name);
    const rolePrivilegesTypes = props.rolePrivileges.map((p) => p.type);
    const roleSpecificTypes = props.rolePrivileges.filter((p) =>
      specificTypes.indexOf(p.name)
    );
    console.log("roleSpecificTypes", roleSpecificTypes);

    const addedPrivileges = data.filter(
      (p) => rolePrivilegesNames.indexOf(p.name) === -1
    );
    console.log("addedPrivileges", addedPrivileges);

    const removedPrivileges = rolePrivilegesNames.filter(
      (p) => dataNames.indexOf(p) === -1
    );
    console.log("removedPrivileges", removedPrivileges);

    const rolesNames = props.projectRoles.map((role) => role.name);

    if (
      rolesNames.indexOf(name.value) !== -1 &&
      name.value !== props.location.state.name
    ) {
      setError("Role already exists in the project!");
    } else {
      setError("");

      if (
        rolesNames.indexOf(name.value) === -1 &&
        name.value !== props.location.state.name
      ) {
        props.onModifyRole(
          props.selectedProject.id,
          name.value,
          id.value,
          props.token
        );
      }

      if (removedPrivileges.length > 0) {
        props.onRemovePrivilegesFromRole(
          props.selectedProject.id,
          id.value,
          removedPrivileges,
          props.token
        );
      }
      if (addedPrivileges.length > 0) {
        props.onAddPrivilegesToRole(
          props.selectedProject.id,
          id.value,
          addedPrivileges,
          props.token
        );
      }
    }
    setSubmit(true);
  };

  const handleRedirect = () => {
    if (submit)
      if (!props.loading)
        if (!props.isRoleExist && !error)
          props.history.push("/roles", {
            alert: {
              name: name.value,
              msg: "The role has been modified successfully!",
            },
          });
  };

  const handleDisabledBtn = () => {
    var valid = true;
    if (error) valid = false;
    if (!name.value) valid = false;

    roles
      .filter((r) => specificTypes.indexOf(r.roleID) !== -1 && r.checked)
      .map((r) => {
        if (!r.type) valid = false;
      });

    const priv = roles.filter((r) => r.checked).map((r) => r.roleID);

    if (priv.length == 0) valid = false;
    return valid;
  };

  const displaySpecificTypeInput = (checked, id, type, error) => {
    if (checked && specificTypes.indexOf(id) !== -1)
      return (
        <FormControl required error={Boolean(error)}>
          <InputLabel id="demo-simple-select-label">Artifact Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name={id}
            value={type}
            onChange={handleTypeChange}
          >
            {artifactTypes.length > 0 ? (
              artifactTypes.map((type) => {
                return (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                );
              })
            ) : (
              <MenuItem key={"Disabled"} disabled>
                {"Project doesn't have any artifact types"}
              </MenuItem>
            )}
          </Select>
          <FormHelperText>{error}</FormHelperText>
        </FormControl>
      );
  };

  const displayPrivileges = () => {
    return (
      <React.Fragment>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Role Privileges</FormLabel>
          <FormGroup>
            {roles.map((role, index) => {
              if (index < roles.length / 2)
                return (
                  <React.Fragment>
                    <FormControlLabel
                      key={role.roleID}
                      control={
                        <Checkbox
                          checked={role.checked}
                          onChange={handleBoxChange}
                          name={role.roleID}
                        />
                      }
                      label={role.roleID}
                    />
                    {displaySpecificTypeInput(
                      role.checked,
                      role.roleID,
                      role.type,
                      role.error
                    )}
                  </React.Fragment>
                );
              else return null;
            })}
          </FormGroup>

          {/* <FormHelperText>Be careful</FormHelperText> */}
        </FormControl>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormGroup>
            {roles.map((role, index) => {
              if (index >= roles.length / 2)
                return (
                  <React.Fragment>
                    <FormControlLabel
                      key={role.roleID}
                      control={
                        <Checkbox
                          checked={role.checked}
                          onChange={handleBoxChange}
                          name={role.roleID}
                        />
                      }
                      label={role.roleID}
                    />
                    {displaySpecificTypeInput(
                      role.checked,
                      role.roleID,
                      role.type,
                      role.error
                    )}
                  </React.Fragment>
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
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <EditIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Modify Role
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Role name"
                name="name"
                autoComplete="off"
                autoFocus
                onChange={nameInputHandler}
                value={name.value}
                error={error != ""}
                helperText={error != "" ? error : null}
              />

              <Grid container item>
                {displayPrivileges()}
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={!handleDisabledBtn()}
              >
                Modify Role
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
  );
}

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    token: state.auth.token,
    selectedProject: state.projects.selectedProject,
    privileges: state.roles.privileges,
    projectRoles: state.roles.projectRoles,
    rolePrivileges: state.modifyRole.rolePrivileges,
    artifactTypes: state.artifactTypes.artifactTypes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchPrivileges: (token) => dispatch(rolesActions.fetchPrivileges(token)),
    onFetchRolePrivileges: (pID, roleName, token) =>
      dispatch(modifyRoleActions.fetchRolePrivileges(pID, roleName, token)),
    onModifyRole: (projectID, roleName, roleID, token) =>
      dispatch(
        modifyRoleActions.modifyRole(projectID, roleName, roleID, token)
      ),
    onAddPrivilegesToRole: (projectID, roleID, privileges, token) =>
      dispatch(
        modifyRoleActions.addPrivilegesToRole(
          projectID,
          roleID,
          privileges,
          token
        )
      ),
    onRemovePrivilegesFromRole: (projectID, roleID, privileges, token) =>
      dispatch(
        modifyRoleActions.removePrivilegesFromRole(
          projectID,
          roleID,
          privileges,
          token
        )
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModifyRole);
