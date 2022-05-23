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
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import axios from "axios";
import HelpIcon from "@material-ui/icons/Help";
import TraceabilityLinkResponsiveNetwork from "../components/Charts/TraceabilityLinkResponsiveNetwork";

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
  graph: {
    marginTop: theme.spacing(3),
  },
}));

function ImpactAnalysis(props) {
  const classes = useStyles();

  const [selectedRequirement, setSelectedRequirement] = useState("");
  const [affected, setAffected] = useState("");
  const [directArtifacts, setDirectArtifacts] = useState([]);
  const [inDirectArtifacts, setInDirectArtifacts] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.location.state && props.location.state.artifact)
      setSelectedRequirement(props.location.state.artifact);
  }, []);

  useEffect(() => {
    if (selectedRequirement) {
      setLoading(true);
      axios
        .get(
          `/project/impact_analysis?pID=${props.selectedProject.id}&aID=${selectedRequirement}`,
          {
            headers: {
              Authorization: `Bearer ${props.token}`,
            },
          }
        )
        .then((res) => {
          setAffected(res.data.affected_artifacts_percentage);
          setDirectArtifacts(res.data.direct_artifacts);
          setInDirectArtifacts(res.data.indirect_artifacts);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err);
        });
    }
  }, [selectedRequirement]);
  // privilege check
  // if (props.projectDetails.manager !== props.username) {
  //     console.error("You don't have the right PRIVILEGES");
  //     props.history.push("/project-details");
  //   }
  const handleChange = (event) => {
    setSelectedRequirement(event.target.value);
  };
  const displayDirectArtifacts = () => {
    if (directArtifacts) {
      if (directArtifacts.length > 0) {
        return directArtifacts.map((artifact, index) => (
          <StyledTableRow key={artifact.name}>
            <StyledTableCell component="th" scope="row" align="left">
              {index + 1}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row" align="left">
              {artifact.name}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row" align="left">
              {artifact.Traceability_Link_Type}
            </StyledTableCell>

            <StyledTableCell component="th" scope="row" align="left">
              Direct
            </StyledTableCell>
          </StyledTableRow>
        ));
      } else
        return (
          <StyledTableCell
            component="th"
            scope="row"
            align="center"
            colSpan="4"
          >
            There is no impact on this artifact
          </StyledTableCell>
        );
    }
  };
  const displayIndirectArtifacts = () => {
    if (inDirectArtifacts) {
      if (inDirectArtifacts.length > 0) {
        return inDirectArtifacts.map((artifact, index) => (
          <StyledTableRow key={artifact.id}>
            <StyledTableCell component="th" scope="row" align="left">
              {index + 1 + directArtifacts.length}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row" align="left">
              {artifact}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row" align="left">
              -
            </StyledTableCell>

            <StyledTableCell component="th" scope="row" align="left">
              Indirect
            </StyledTableCell>
          </StyledTableRow>
        ));
      }
    }
  };

  const displayTable = () => {
    if (selectedRequirement)
      return (
        <React.Fragment>
          <TableContainer className={classes.table}>
            <Table
              className={classes.table}
              aria-label="customized table"
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">#</StyledTableCell>
                  <StyledTableCell align="left">Artifact Name</StyledTableCell>
                  <StyledTableCell align="left">
                    Traceability Link Type
                  </StyledTableCell>
                  <StyledTableCell align="left">Type</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <StyledTableCell
                    component="th"
                    scope="row"
                    align="center"
                    colSpan={5}
                  >
                    <CircularProgress />
                  </StyledTableCell>
                ) : (
                  <React.Fragment>
                    {displayDirectArtifacts()} {displayIndirectArtifacts()}{" "}
                  </React.Fragment>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {!loading ? (
            <Typography>Affected artifacts percentage: {affected}%</Typography>
          ) : null}
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
            Impact Analysis{" "}
            <HtmlTooltip
              placement="top"
              title={
                <React.Fragment>
                  <Typography color="inherit">Analysis Description</Typography>
                  This analysis will assess the impact of proposed change of an
                  artifact. helps expose dependencies and "hidden" costs of
                  change.
                </React.Fragment>
              }
            >
              <HelpIcon color="primary" />
            </HtmlTooltip>
          </Typography>

          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Artifact</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedRequirement}
              onChange={handleChange}
            >
              {props.artifacts.map((artifact) => {
                if (props.artifacts.length > 0) {
                  return (
                    <MenuItem key={artifact.id} value={artifact.id}>
                      {artifact.name}
                    </MenuItem>
                  );
                } else
                  return (
                    <MenuItem
                      key={"You don't have any artifact in the project"}
                      value={"You don't have any artifact in the project"}
                      disabled
                    >
                      {"You don't have any artifact in the project"}
                    </MenuItem>
                  );
              })}
            </Select>
          </FormControl>
          {displayTable()}
          {/* {console.log(
            props.artifacts
              .filter(
                (artifact) =>
                  directArtifacts
                    .map((dArtifact) => dArtifact.name)
                    .concat(inDirectArtifacts)
                    .indexOf(artifact.name) !== -1
              )
              .concat(
                props.artifacts.filter(
                  (artifact) => artifact.id === selectedRequirement
                )
              )
          )} */}
          {selectedRequirement ? (
            <TraceabilityLinkResponsiveNetwork
              className={classes.graph}
              nodes={props.artifacts
                .filter(
                  (artifact) =>
                    directArtifacts
                      .map((dArtifact) => dArtifact.name)
                      .concat(inDirectArtifacts)
                      .indexOf(artifact.name) !== -1
                )
                .concat(
                  props.artifacts.filter(
                    (artifact) => artifact.id === selectedRequirement
                  )
                )}
              links={props.traceabilityLinks}
            />
          ) : null}
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
    traceabilityLinks: state.traceabilityLinks.traceabilityLinks,
  };
};
// const mapDispatchToProps = (dispatch) => {
//   return {
//
//   };
// };

export default connect(mapStateToProps)(ImpactAnalysis);
