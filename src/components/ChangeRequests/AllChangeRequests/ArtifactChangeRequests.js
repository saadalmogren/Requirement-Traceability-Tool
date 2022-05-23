import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  withStyles,
  TableCell,
  IconButton,
  Typography,
  Tooltip,
  Button,
  ButtonGroup,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import React, { useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";
import AssessmentIcon from "@material-ui/icons/Assessment";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
// import SettingsIcon from "@material-ui/icons/Settings";
import RejectForm from "../RejectForm";
import * as changeRequestsActions from "../../../store/actions/artifactChangeRequests";
import * as artifactsActions from "../../../store/actions/artifacts";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";

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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  table: {
    minWidth: 600,
    maxHeight: 300,
    width: "100%",
  },
  link: {
    textDecoration: "none",
  },
  delBtn: {
    color: "red",
  },
  paper: {
    marginTop: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  tab: {
    marginTop: 1,
  },
  oldData: {
    color: "red",
  },
  newData: {
    color: "green",
  },
  btn: {
    textTransform: "none",
  },
  selected: {
    // color: "white",
    backgroundColor: "rgba(26,35,126,0.2)",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "rgba(26,35,126,0.3)",
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  sortableHead: {
    cursor: "pointer",
    userSelect: "none",
    "&:hover": {
      color: "rgba(255, 255, 255, 0.6)",
    },
  },
  sortIcon: {
    width: "1rem",
    height: "1rem",
    verticalAlign: "middle",
    display: "inline-flex",
  },
}));

function ArtifactChangeRequests(props) {
  const classes = useStyles();
  const [deletedRequest, setDeletedRequest] = React.useState("");
  const [filteredRequest, setFilteredRequest] = React.useState([]);
  const [selectedButton, setSelectedButton] = React.useState("ALL");
  const [sortType, setSortType] = React.useState({
    prop: "title",
    order: "asc",
  });

  var tempFiltered = props.artifactChangeRequests.filter(
    (request) => request.status === "Pending"
  );
  useEffect(() => {
    props.onFetchArtifacts(props.selectedProject.id, props.token);
    props.onFetchArtifactChangeRequests(props.selectedProject.id, props.token);
    setFilteredRequest(tempFiltered);
  }, [props.myArtifactChangeRequests.length, tempFiltered.length]);

  const handleSort = (sort) => {
    if (sortType.prop === sort) {
      if (sortType.order === "asc") setSortType({ ...sortType, order: "desc" });
      else setSortType({ ...sortType, order: "asc" });
    } else setSortType({ prop: sort, order: "asc" });
  };

  useEffect(() => {
    if (filteredRequest.length > 0)
      setFilteredRequest([
        ...filteredRequest.sort(compareValues(sortType.prop, sortType.order)),
      ]);
  }, [sortType]);

  function compareValues(key, order = "asc") {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === "desc" ? comparison * -1 : comparison;
    };
  }

  const acceptRequest = (request, title) => {
    props.onAcceptArtifactChangeRequest(
      props.selectedProject.id,
      request,
      props.token
    );
    props.onFetchArtifacts(props.selectedProject.id, props.token);
    props.onFetchArtifactChangeRequests(props.selectedProject.id, props.token);

    props.history.replace("/change-requests", {
      ...props.location.state,
      alert: {
        name: title,
        msg: "The artifact change request has been accepted successfully!",
      },
    });
  };

  const handleRejectClick = (request) => {
    setDeletedRequest(request);
  };

  const handleReject = (rejectReason) => {
    props.onRejectArtifactChangeRequest(
      props.selectedProject.id,
      deletedRequest.id,
      rejectReason,
      props.token
    );
    props.onFetchArtifacts(props.selectedProject.id, props.token);
    props.onFetchArtifactChangeRequests(props.selectedProject.id, props.token);

    props.history.replace("/change-requests", {
      ...props.location.state,
      alert: {
        name: deletedRequest.title,
        msg: "The artifact change request has been rejected successfully!",
      },
    });
  };
  const displayArtifactChangeRequests = () => {
    if (filteredRequest.length > 0) {
      return filteredRequest.map((request, index) => {
        var previousArtifact = null;
        if (request.request_type === "Modify Artifact")
          previousArtifact = props.artifacts.find(
            (artifact) => artifact.id === request.artifact_id
          );
        var dateString = request.creation_date;
        dateString = new Date(dateString).toUTCString();
        dateString = dateString.split(" ").slice(0, 4).join(" ");
        return (
          <StyledTableRow key={request.id}>
            <StyledTableCell component="th" scope="row" align="center">
              {index + 1}
            </StyledTableCell>

            <StyledTableCell component="th" scope="row" align="left">
              {request.title}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row" align="left">
              {request.description}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row" align="left">
              {request.request_type}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row" align="left">
              {previousArtifact !== null &&
              request.artifact_name !== previousArtifact.name ? (
                <div>
                  <span className={classes.oldData}>
                    {previousArtifact.name}
                  </span>{" "}
                  <ArrowRightIcon fontSize="small" />{" "}
                  <span className={classes.newData}>
                    {request.artifact_name}
                  </span>
                </div>
              ) : (
                request.artifact_name
              )}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row" align="left">
              {previousArtifact !== null &&
              request.artifact_description !== previousArtifact.description ? (
                <div>
                  <span className={classes.oldData}>
                    {previousArtifact.description}
                  </span>{" "}
                  <ArrowRightIcon fontSize="small" />{" "}
                  <span className={classes.newData}>
                    {request.artifact_description}
                  </span>
                </div>
              ) : (
                request.artifact_description
              )}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row" align="left">
              {previousArtifact !== null &&
              request.artifact_type !== previousArtifact.artifact_type ? (
                <div>
                  <span className={classes.oldData}>
                    {previousArtifact.artifact_type}
                  </span>{" "}
                  <ArrowRightIcon fontSize="small" />{" "}
                  <span className={classes.newData}>
                    {request.artifact_type}
                  </span>
                </div>
              ) : (
                request.artifact_type
              )}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row" align="left">
              {request.created_by}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row" align="left">
              {dateString}
            </StyledTableCell>

            <StyledTableCell
              component="th"
              scope="row"
              align="center"
              padding="checkbox"
            >
              <ButtonGroup>
                <Grid item>
                  <Tooltip title="Accept">
                    <IconButton
                      variant="text"
                      color="primary"
                      onClick={() => acceptRequest(request.id, request.title)}
                    >
                      <CheckIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <RejectForm
                  request={request}
                  onClick={handleRejectClick}
                  onConfirm={handleReject}
                >
                  <CloseIcon className={classes.delBtn} />
                </RejectForm>

                <Tooltip title="Impact Analysis">
                  <Link
                    to={{
                      pathname: "/impact-analysis",
                      state: { artifact: request.artifact_id },
                    }}
                  >
                    <IconButton
                      aria-label="Traceability Link"
                      color="secondary"
                    >
                      <AssessmentIcon />
                    </IconButton>
                  </Link>
                </Tooltip>
              </ButtonGroup>
            </StyledTableCell>
          </StyledTableRow>
        );
      });
    } else
      return (
        <StyledTableRow>
          <StyledTableCell
            component="th"
            scope="row"
            align="center"
            colSpan={10}
          >
            <strong>
              The project does not have any artifact change requests
            </strong>
          </StyledTableCell>
        </StyledTableRow>
      );
  };

  const renderArrow = (type) => {
    if (sortType.prop === type)
      if (sortType.order === "asc")
        return <ArrowUpwardIcon className={classes.sortIcon} />;
      else return <ArrowDownwardIcon className={classes.sortIcon} />;
  };
  return (
    <div className={classes.tab}>
      {/* <Paper>{sortMenu()}</Paper> */}
      <TableContainer component={Paper} className={classes.table}>
        <Table
          className={classes.table}
          aria-label="customized table"
          stickyHeader
        >
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">#</StyledTableCell>
              <StyledTableCell
                align="left"
                className={classes.sortableHead}
                onClick={() => handleSort("title")}
              >
                Request Title
                {renderArrow("title")}
              </StyledTableCell>
              <StyledTableCell
                align="left"
                className={classes.sortableHead}
                onClick={() => handleSort("description")}
              >
                Request Description
                {renderArrow("description")}
              </StyledTableCell>
              <StyledTableCell
                align="left"
                className={classes.sortableHead}
                onClick={() => handleSort("request_type")}
              >
                Request Type
                {renderArrow("request_type")}
              </StyledTableCell>
              <StyledTableCell
                align="left"
                className={classes.sortableHead}
                onClick={() => handleSort("artifact_name")}
              >
                Artifact Name
                {renderArrow("artifact_name")}
              </StyledTableCell>
              <StyledTableCell
                align="left"
                className={classes.sortableHead}
                onClick={() => handleSort("artifact_description")}
              >
                Artifact Description
                {renderArrow("artifact_description")}
              </StyledTableCell>
              <StyledTableCell
                align="left"
                className={classes.sortableHead}
                onClick={() => handleSort("artifact_type")}
              >
                Artifact Type
                {renderArrow("artifact_type")}
              </StyledTableCell>
              <StyledTableCell
                align="left"
                className={classes.sortableHead}
                onClick={() => handleSort("created_by")}
              >
                Created By
                {renderArrow("created_by")}
              </StyledTableCell>
              <StyledTableCell
                align="left"
                className={classes.sortableHead}
                onClick={() => handleSort("creation_date")}
              >
                Creation Date
                {renderArrow("creation_date")}
              </StyledTableCell>
              <StyledTableCell align="left">
                {/* <SettingsIcon /> */}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{displayArtifactChangeRequests()}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    token: state.auth.token,
    userPrivileges: state.changeUserRole.userPrivileges.map((p) => p.name),
    artifactTypes: state.artifactTypes.artifactTypes,
    artifacts: state.artifacts.artifacts,
    selectedProject: state.projects.selectedProject,
    artifactChangeRequests: state.artifactChangeRequests.artifactChangeRequests,
    myArtifactChangeRequests:
      state.myArtifactChangeRequests.myArtifactChangeRequests,
    isLoading: state.artifactChangeRequests.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchArtifactChangeRequests: (projectID, token) =>
      dispatch(
        changeRequestsActions.fetchArtifactChangeRequests(projectID, token)
      ),
    onAcceptArtifactChangeRequest: (projectID, requestID, token) =>
      dispatch(
        changeRequestsActions.acceptArtifactChangeRequest(
          projectID,
          requestID,
          token
        )
      ),
    onRejectArtifactChangeRequest: (
      projectID,
      requestID,
      rejectReason,
      token
    ) =>
      dispatch(
        changeRequestsActions.rejectArtifactChangeRequest(
          projectID,
          requestID,
          rejectReason,
          token
        )
      ),
    onFetchArtifacts: (pID, token) =>
      dispatch(artifactsActions.fetchArtifacts(pID, token)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ArtifactChangeRequests)
);
