import React, {useEffect} from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { fade, makeStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Button, Hidden, List, Badge } from "@material-ui/core";
import { NavLink, Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import * as authActions from "../../store/actions/auth";
import * as notificationsActions from "../../store/actions/notifications";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(8),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  accountButton: {
    marginLeft: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
    color: "white",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

function NavigationBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    setAnchorEl(null);
    props.history.push("/modify-account-info");
  };


  let redirectPath = null;
  props.isAuthenticated ? (redirectPath = "/main-page") : (redirectPath = "/");
  return (
    <div className={classes.root}>
      <AppBar
      // position="static"
      >
        <Toolbar>
          <div className={classes.title}>
            <Link to={redirectPath} style={{ textDecoration: "none" }}>
              <Button>
                <Typography className={classes.title} variant="h6" noWrap>
                  RT Tool
                </Typography>
              </Button>
            </Link>
          </div>

          {props.isAuthenticated ? (
            <List>
              <Hidden xsDown>
                {window.location.pathname.includes('main-page') || window.location.pathname.includes('modify-account-info') || window.location.pathname.includes('create-project') || window.location.pathname.includes('modify-project')? null :
              <Tooltip title="Notifications">
                <IconButton
                  onClick={() => {
                    props.history.push("/notifications");
                  }}
                  edge="start"
                  className={classes.accountButton}
                  aria-label="open drawer"
                >
                  <Badge
                    badgeContent={props.numNotifications}
                    color="secondary"
                  >
                    <NotificationsIcon style={{ color: "white" }} />
                  </Badge>
                </IconButton>
                  </Tooltip>
}
                  <Tooltip title="Logout">
                  <IconButton
                  onClick={() => {
                    props.history.push("/logout");
                  }}
                  edge="start"
                  className={classes.accountButton}
                  color="inherit"
                  aria-label="open drawer"
                >
                  <ExitToAppIcon style={{ color: "white" }} />
                </IconButton>
                  </Tooltip>

              </Hidden>

              <NavLink
                to={props.isAuthenticated ? props.location.pathname : "/login"}
                activeStyle={{ color: "white" }}
              >
                <IconButton
                  edge="start"
                  className={classes.accountButton}
                  aria-label="open drawer"
                  onClick={handleClick}
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                >
                  <AccountCircleIcon style={{ color: "white" }} />
                </IconButton>
              </NavLink>

              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>{props.username}</MenuItem>
                <MenuItem onClick={handleProfile}>Modify Profile</MenuItem>
              </Menu>
            </List>
          ) : (
            <NavLink to="/login" activeStyle={{ color: "white" }}>
              <IconButton
                edge="start"
                className={classes.accountButton}
                aria-label="open drawer"
              >
                <AccountCircleIcon style={{ color: "white" }} />
              </IconButton>
            </NavLink>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedProject: state.projects.selectedProject,
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    username: state.auth.username,
    token: state.auth.token,
    numNotifications: state.notifications.numOfNotifications
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(authActions.authLogout()),
    onInit: () => dispatch(authActions.authInitite()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NavigationBar)
);
