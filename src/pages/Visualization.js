import {
  Avatar,
  Box,
  CssBaseline,
  Fade,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import Copyright from "../components/Copyright/Copyright";
import AssessmentIcon from "@material-ui/icons/Assessment";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import TraceabilityLinkResponsiveNetwork from "../components/Charts/TraceabilityLinkResponsiveNetwork";
import { connect } from "react-redux";
import TraceabilityLinkMatrix from "../components/Charts/TraceabilityLinkMatrix";

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
  table: {
    // width: "100%",

    maxHeight: 600,
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

function Visualization(props) {
  const classes = useStyles();

  const [selectedGraph, setSelectedGraph] = useState("");

  const handleChange = (event) => {
    setSelectedGraph(event.target.value);
  };
  const displayGraphs = () => {
    if (selectedGraph === "network")
      return (
        <TraceabilityLinkResponsiveNetwork
          nodes={props.artifacts}
          links={props.traceabilityLinks}
        />
      );
    else if (selectedGraph === "matrix")
      return (
        <TraceabilityLinkMatrix
          nodes={props.artifacts}
          links={props.traceabilityLinks}
        />
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
        <CssBaseline />
        <Grid
          item
          container
          lg={8}
          justify="center"
          direction="column"
          alignItems="center"
          className={classes.paper}
        >
          <Avatar className={classes.avatar}>
            <AssessmentIcon />
          </Avatar>
          <Typography component="h1" variant="h4">
            Visualization
          </Typography>

          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Graph Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedGraph}
              onChange={handleChange}
            >
              <MenuItem key={"network"} value={"network"}>
                {"Network graph"}
              </MenuItem>
              <MenuItem key={"matrix"} value={"matrix"}>
                {"Matrix graph"}
              </MenuItem>
            </Select>
          </FormControl>
          {displayGraphs()}
        </Grid>
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
    // userPrivileges: state.changeUserRole.userPrivileges.map((p) => p.name),
    // token: state.auth.token,
    selectedProject: state.projects.selectedProject,
    artifacts: state.artifacts.artifacts,
    traceabilityLinks: state.traceabilityLinks.traceabilityLinks,
  };
};
export default connect(mapStateToProps)(Visualization);
