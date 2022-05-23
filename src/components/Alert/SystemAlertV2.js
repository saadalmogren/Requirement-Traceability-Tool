import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Alert } from "@material-ui/lab";
import { Fade, makeStyles } from "@material-ui/core";
import * as alertActions from "../../store/actions/alert";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    justifyContent: "center",
  },
  divRoot: {
    width: "100%",
  },
  alert: {
    width: "100%",
    position: "absolute",
  },
}));

function SystemAlertV2(props) {
  const classes = useStyles();

  useEffect(() => {
    //   combine the old SystemAlert with the new one
    if (props.location.state && props.location.state.alert) {
      const state = { ...props.history.location.state };
      props.onAlert(
        props.location.state.alert.msg,
        props.location.state.alert.name
      );
      delete state.alert;
      props.history.replace({ state });
    }
  }, [props.location.state]);

  return (
    <Fade in={Boolean(props.alertMSG)} className={classes.root}>
      <Alert
        severity={props.alertType ? props.alertType : "success"}
        className={classes.alertMSG}
      >
        {console.log("AlertType: ", props.alertType)}
        {props.alertMSG}{" "}
        {props.alertName ? (
          <span>
            (<strong>{props.alertName}</strong>)
          </span>
        ) : null}
      </Alert>
    </Fade>
  );
}
const mapStateToProps = (state) => {
  console.log("state at Alert:", state.alert);
  return {
    alertMSG: state.alert.text,
    alertName: state.alert.name,
    alertType: state.alert.alertType,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onAlert: (msg, name) =>
      dispatch(alertActions.showAlertWithTimeout(msg, name)),
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SystemAlertV2)
);
