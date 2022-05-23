import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Typography } from "@material-ui/core";
import Copyright from "../components/Copyright/Copyright";

import Imagg from "../assets/white.png";
import { Button } from "react-scroll";

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  root: {
    flexGrow: 1,
  },
  button: {
    margin: 10,
  },
  image: {
    marginTop: 20,
  },
  gridImage: {
    marginTop: 50,
  },
  my404: {
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
    backgroundColor: "rgba(0,0,0,.1)",
  },
  my404Content: {
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

export default function My404() {
  const classes = useStyles();

  return (
    <div>
      <Grid container className={classes.root}>
        <Grid item lg={2}></Grid>
        <Grid item lg={8}>
          <Paper
            className={classes.my404}
            style={{ backgroundImage: `url(${Imagg})` }}
          >
            {/* Increase the priority of the hero background image */}
            {<img style={{ display: "none" }} src={Imagg} alt="RTT1" />}
            <div className={classes.overlay} />
            <Grid container>
              <Grid container item md={12} justify="center">
                <div className={classes.my404Content}>
                  <Typography
                    component="h1"
                    variant="h3"
                    color="primary"
                    gutterBottom
                  >
                    Sorry we couldn't find the page you were looking for!
                    <Typography
                      component="h2"
                      variant="h2"
                      color="primary"
                      align="center"
                    >
                      <b>404</b>
                    </Typography>
                  </Typography>
                </div>
              </Grid>
              <Grid item lg={2}></Grid>
              <Grid item lg={8}>
                <Grid container justify={"center"} item lg={12}></Grid>
              </Grid>
              <Grid item lg={2}></Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item lg={2}></Grid>
        <Grid item lg={2}></Grid>
        <Grid item lg={8} className={classes.gridImage}></Grid>
        <Grid item lg={2}></Grid>
        <Grid item lg={12}>
          <Copyright />
        </Grid>
      </Grid>
    </div>
  );
}
