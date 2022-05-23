import { Fade, makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useEffect } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: theme.spacing(3),
  },
  divRoot: {
    width: "100%",
  },
  alert: {
    width: "100%",
    justifyContent: "center",
  },
}));

function SystemAlert(props) {
  const classes = useStyles();
  const [alert, setAlert] = React.useState(true);

  // hide alert and never show it again.
  useEffect(() => {
    if (props.location.state && props.location.state.alert) {
      setAlert(true);
      setTimeout(() => {
        const state = { ...props.history.location.state };
        delete state.alert;
        setAlert(false);
        setTimeout(() => props.history.replace({ state }), 350);
      }, 3500);
    }
  }, [props.location.state]);

  const displayAlert = () => {
    if (props.location.state && props.location.state.alert)
      return (
        <Fade in={alert}>
          <Alert severity="success" className={classes.alert}>
            {props.location.state.alert.msg}{" "}
            {props.location.state.alert.name ? (
              <span>
                (<strong>{props.location.state.alert.name}</strong>)
              </span>
            ) : null}
            {props.location.state.alert.to ? (
              <span>
                {" "}
                click{" "}
                <Link
                  to={{
                    pathname: props.location.state.alert.to,
                    state: {
                      tableValue:
                        props.location.state.alert.type === "traceability link"
                          ? 1
                          : 0,
                    },
                  }}
                >
                  here
                </Link>{" "}
                to view.
              </span>
            ) : null}
          </Alert>
        </Fade>
      );
  };

  return <React.Fragment>{displayAlert()}</React.Fragment>;
}

export default withRouter(SystemAlert);
