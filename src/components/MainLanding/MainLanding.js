import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Imagg from "../../assets/white.png";
import { withRouter } from "react-router-dom";
import { Link } from "react-scroll";

const useStyles = makeStyles((theme) => ({
  mainFeaturedPost: {
    position: "relative",
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,.3)",
  },
  mainFeaturedPostContent: {
    position: "relative",
    padding: theme.spacing(3),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(6),
      paddingRight: 0,
    },
  },
  button: {
    margin: 10,
  },
}));

function MainFeaturedPost(props) {
  const classes = useStyles();

  return (
    <Paper
      className={classes.mainFeaturedPost}
      style={{ backgroundImage: `url(${Imagg})` }}
    >
      {/* Increase the priority of the hero background image */}
      {<img style={{ display: "none" }} src={Imagg} alt="RTT1" />}
      <div className={classes.overlay} />
      <Grid container>
        <Grid item md={12}>
          <div className={classes.mainFeaturedPostContent}>
            <Typography
              component="h1"
              variant="h3"
              color="primary"
              gutterBottom
            >
              Requirements traceability tool
            </Typography>
            <Typography variant="h5" color="primary" paragraph>
              This tool is aimed to help software engineers. In general,
              software engineers usually have difficulties in software
              development life cycle like keep tracing of requirements, losing
              knowledge of requirements, losing control of changing, losing
              trace of development progress, poor impact analysis, and many more
              difficulties. This tool provides a potential solution to software
              engineers problems by maintaining an end-to-end traceability link
              between the artifacts in the software development life cycle
              (SDLC).
            </Typography>

            <Link
              activeClass="active"
              to="test1"
              spy={true}
              smooth={true}
              offset={50}
              duration={500}
            >
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
              >
                View system features!
              </Button>
            </Link>
          </div>
        </Grid>
        <Grid item lg={2}></Grid>
        <Grid item lg={8}>
          <Grid container justify={"center"} item lg={12}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => {
                props.history.push("/login");
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={() => {
                props.history.push("/register");
              }}
            >
              Register
            </Button>
          </Grid>
        </Grid>
        <Grid item lg={2}></Grid>
      </Grid>
    </Paper>
  );
}

MainFeaturedPost.propTypes = {
  post: PropTypes.object,
};

export default withRouter(MainFeaturedPost);
