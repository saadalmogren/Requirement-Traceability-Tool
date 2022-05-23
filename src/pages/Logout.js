import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "../store/actions/auth";
import * as alertActions from "../store/actions/alert";

function Logout(props) {
  useEffect(() => {
    props.onAlert("You have been logged out successfully");
    props.onLogout();
  });

  return <Redirect to="/login" />;
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(actions.authLogout()),
    onAlert: (text, name) =>
      dispatch(alertActions.showAlertWithTimeout(text, name, "")),
  };
};

export default connect(null, mapDispatchToProps)(Logout);
