import React from "react";
import Typography from "@material-ui/core/Typography";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

function Copyright(props) {
  let redirectPath = null;
  props.isAuthenticated ? (redirectPath = "/main-page") : (redirectPath = "/");
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link to={redirectPath} style={{ textDecoration: "none" }}>
        RTT
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};
export default connect(mapStateToProps)(Copyright);
