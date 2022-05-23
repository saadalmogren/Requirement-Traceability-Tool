import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Copyright from "../components/Copyright/Copyright";
import React, { useEffect, useState } from "react";
import AssessmentIcon from "@material-ui/icons/Assessment";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {
  CircularProgress,
  Fade,
  Grid,
  IconButton,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import { connect } from "react-redux";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import axios from "axios";
import HelpIcon from "@material-ui/icons/Help";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.grey[100],
    },
  },
}))(TableRow);

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

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
    maxHeight: 300,
  },
  tableHead: {
    marginTop: theme.spacing(2),
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

function ElaborationCoverageAnalysis(props) {
  const classes = useStyles();

  const [coveredPercentage, setCoveredPercentage] = useState("");
  const [coveredArtifacts, setCoveredArtifacts] = useState("");
  const [uncoveredArtifacts, setUncoveredArtifacts] = useState("");
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `/project/elaboration_coverage_analysis?pID=${props.selectedProject.id}`,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setCoveredArtifacts(res.data.covered_artifacts);
        setCoveredPercentage(res.data.covered_artifacts_percentage);
        setUncoveredArtifacts(res.data.uncovered_artifacts);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      });
    console.log("pID: ", props.selectedProject.id);
  }, []);

  const displayCoveredArtifactsTable = () => {
    return (
      <React.Fragment>
        <Typography align="center" variant="h5" className={classes.tableHead}>
          Covered Business Needs
        </Typography>
        <TableContainer className={classes.table}>
          <Table aria-label="customized table" stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">#</StyledTableCell>
                <StyledTableCell align="left">
                  Business Need Name
                </StyledTableCell>
                <StyledTableCell align="left">Requirement Name</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {console.log(Boolean(coveredArtifacts))}
              {coveredArtifacts.length > 0 ? (
                coveredArtifacts.map((artifact, index) => (
                  <StyledTableRow key={artifact.name}>
                    <StyledTableCell component="th" scope="row" align="left">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" align="left">
                      {artifact.business_need}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" align="left">
                      {artifact.requirements.map((req, index) => {
                        if (index + 1 === artifact.requirements.length)
                          return req;
                        else return req + ", ";
                      })}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableCell
                  component="th"
                  scope="row"
                  align="center"
                  colSpan="4"
                >
                  There are no covered business needs in the project
                </StyledTableCell>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography>
          Elaboration coverage percentage: {coveredPercentage}%
        </Typography>
      </React.Fragment>
    );
  };
  const displayUncoveredArtifactsTable = () => {
    return (
      <React.Fragment>
        <Typography align="center" variant="h5" className={classes.tableHead}>
          Uncovered Business Needs{" "}
        </Typography>
        <TableContainer className={classes.table}>
          <Table aria-label="customized table" stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">#</StyledTableCell>
                <StyledTableCell align="center">
                  Business Need Name
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {uncoveredArtifacts.length > 0 ? (
                uncoveredArtifacts.map((artifact, index) => (
                  <StyledTableRow key={artifact.name}>
                    <StyledTableCell component="th" scope="row" align="center">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" align="center">
                      {artifact}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableCell
                  component="th"
                  scope="row"
                  align="center"
                  colSpan="4"
                >
                  There are no uncovered business needs in the project
                </StyledTableCell>
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
            Elaboration Coverage Analysis
            <HtmlTooltip
              placement="top"
              title={
                <React.Fragment>
                  <Typography color="inherit">Analysis Description</Typography>
                  This analysis will trace business need to requirement to
                  verify that all business needs covered by a requirements.
                </React.Fragment>
              }
            >
              <HelpIcon color="primary" />
            </HtmlTooltip>
          </Typography>

          {/* {loading ? <CircularProgress /> : null} */}
          {displayCoveredArtifactsTable()}
          {displayUncoveredArtifactsTable()}
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
    username: state.auth.username,
    token: state.auth.token,
    selectedProject: state.projects.selectedProject,
    userPrivileges: state.changeUserRole.userPrivileges.map((p) => p.name),
    artifacts: state.artifacts.artifacts,
  };
};

export default connect(mapStateToProps)(ElaborationCoverageAnalysis);
