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
  Tooltip,
  Button,
  ButtonGroup,
  Grid,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import React, { useEffect } from "react";
// import SettingsIcon from "@material-ui/icons/Settings";
import CloseIcon from "@material-ui/icons/Close";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import RejectForm from "../RejectForm";
import * as traceabilityLinkChangeRequestsActions from "../../../store/actions/traceabilityLinkChangeRequests";
import * as traceabilityLinksActions from "../../../store/actions/traceabilityLinks";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import { connect } from "react-redux";
import { withRouter } from "react-router";

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
function TraceabilityChangeRequests(props) {
  const classes = useStyles();
  const [deletedRequest, setDeletedRequest] = React.useState("");
  const [filteredRequests, setFilteredRequests] = React.useState([]);
  const [selectedButton, setSelectedButton] = React.useState("ALL");
  const [sortType, setSortType] = React.useState({
    prop: "title",
    order: "asc",
  });

  var tempFiltered = props.traceabilityLinkChangeRequests.filter(
    (request) => request.status === "Pending"
  );
  useEffect(() => {
    props.onFetchTraceabilityLinks(props.selectedProject.id, props.token);
    props.onFetchTraceabilityLinkChangeRequests(
      props.selectedProject.id,
      props.token
    );

    setFilteredRequests(tempFiltered);
  }, [props.myTraceabilityLinkChangeRequests.length, tempFiltered.length]);

  useEffect(() => {
    if (filteredRequests.length > 0)
      setFilteredRequests([
        ...filteredRequests.sort(compareValues(sortType.prop, sortType.order)),
      ]);
  }, [sortType]);

  const handleSort = (sort) => {
    if (sortType.prop === sort) {
      console.log("Test");
      if (sortType.order === "asc") setSortType({ ...sortType, order: "desc" });
      else setSortType({ ...sortType, order: "asc" });
    } else setSortType({ prop: sort, order: "asc" });
    console.log(sort);
    console.log(sortType);
    console.log(filteredRequests);
  };

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
    props.onAcceptTraceabilityLinkChangeRequest(
      props.selectedProject.id,
      request,
      props.token
    );
    props.onFetchTraceabilityLinks(props.selectedProject.id, props.token);
    props.onFetchTraceabilityLinkChangeRequests(
      props.selectedProject.id,
      props.token
    );
    props.history.replace("/change-requests", {
      ...props.location.state,
      alert: {
        name: title,
        msg:
          "The traceability link change request has been accepted successfully!",
      },
    });
  };

  const handleRejectClick = (request) => {
    setDeletedRequest(request);
  };

  const handleClick = (traceabilityLink) => {
    if (traceabilityLink === "ALL") setSelectedButton("ALL");
    else setSelectedButton(traceabilityLink.id);
  };
  const handleReject = (rejectReason) => {
    props.onRejectTraceabilityLinkChangeRequest(
      props.selectedProject.id,
      deletedRequest.id,
      rejectReason,
      props.token
    );
    props.onFetchTraceabilityLinks(props.selectedProject.id, props.token);
    props.onFetchTraceabilityLinkChangeRequests(
      props.selectedProject.id,
      props.token
    );

    props.history.replace("/change-requests", {
      ...props.location.state,
      alert: {
        name: deletedRequest.title,
        msg:
          "The traceability link change request has been rejected successfully!",
      },
    });
  };

  const renderArrow = (type) => {
    if (sortType.prop === type)
      if (sortType.order === "asc")
        return <ArrowUpwardIcon className={classes.sortIcon} />;
      else return <ArrowDownwardIcon className={classes.sortIcon} />;
  };

  return (
    <div className={classes.tab}>
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
                onClick={() => handleSort("title")}
                className={classes.sortableHead}
              >
                Request Title {renderArrow("title")}
              </StyledTableCell>
              <StyledTableCell
                align="left"
                onClick={() => handleSort("description")}
                className={classes.sortableHead}
              >
                Request Description
                {renderArrow("description")}
              </StyledTableCell>
              <StyledTableCell
                align="left"
                onClick={() => handleSort("request_type")}
                className={classes.sortableHead}
              >
                Request Type
                {renderArrow("request_type")}
              </StyledTableCell>
              <StyledTableCell
                align="left"
                onClick={() => handleSort("traceability_link_name")}
                className={classes.sortableHead}
              >
                Traceability Link Name
                {renderArrow("traceability_link_name")}
              </StyledTableCell>
              <StyledTableCell
                align="left"
                onClick={() => handleSort("traceability_link_description")}
                className={classes.sortableHead}
              >
                Traceability Link Description
                {renderArrow("traceability_link_description")}
              </StyledTableCell>
              <StyledTableCell
                align="left"
                onClick={() => handleSort("traceability_link_type")}
                className={classes.sortableHead}
              >
                Traceability Link Type
                {renderArrow("traceability_link_type")}
              </StyledTableCell>
              <StyledTableCell
                align="left"
                onClick={() => handleSort("first_artifact_name")}
                className={classes.sortableHead}
              >
                First Artifact
                {renderArrow("first_artifact_name")}
              </StyledTableCell>
              <StyledTableCell
                align="left"
                onClick={() => handleSort("second_artifact_name")}
                className={classes.sortableHead}
              >
                Second Artifact
                {renderArrow("second_artifact_name")}
              </StyledTableCell>
              <StyledTableCell
                align="left"
                onClick={() => handleSort("created_by")}
                className={classes.sortableHead}
              >
                Created By
                {renderArrow("created_by")}
              </StyledTableCell>
              <StyledTableCell
                align="left"
                onClick={() => handleSort("creation_date")}
                className={classes.sortableHead}
              >
                Creation Date
                {renderArrow("creation_date")}
              </StyledTableCell>
              <StyledTableCell align="left">
                {/* <SettingsIcon /> */}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request, index) => {
                var previousTraceabilityLink = null;
                if (request.request_type === "Modify Traceability Link")
                  previousTraceabilityLink = props.traceabilityLinks.find(
                    (tl) => tl.id === request.traceability_link_id
                  );
                var dateString = request.creation_date;
                dateString = new Date(dateString).toUTCString();
                dateString = dateString.split(" ").slice(0, 4).join(" ");
                return (
                  <StyledTableRow key={request.rTitle}>
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
                      {previousTraceabilityLink !== null &&
                      request.traceability_link_name !==
                        previousTraceabilityLink.name ? (
                        <div>
                          <span className={classes.oldData}>
                            {previousTraceabilityLink.name}
                          </span>{" "}
                          <ArrowRightIcon fontSize="small" />{" "}
                          <span className={classes.newData}>
                            {request.traceability_link_name}
                          </span>
                        </div>
                      ) : (
                        request.traceability_link_name
                      )}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" align="left">
                      {previousTraceabilityLink !== null &&
                      request.traceability_link_description !==
                        previousTraceabilityLink.description ? (
                        <div>
                          <span className={classes.oldData}>
                            {previousTraceabilityLink.description}
                          </span>{" "}
                          <ArrowRightIcon fontSize="small" />{" "}
                          <span className={classes.newData}>
                            {request.traceability_link_description}
                          </span>
                        </div>
                      ) : (
                        request.traceability_link_description
                      )}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" align="left">
                      {previousTraceabilityLink !== null &&
                      request.traceability_link_type !==
                        previousTraceabilityLink.traceability_Link_Type ? (
                        <div>
                          <span className={classes.oldData}>
                            {previousTraceabilityLink.traceability_Link_Type}
                          </span>{" "}
                          <ArrowRightIcon fontSize="small" />{" "}
                          <span className={classes.newData}>
                            {request.traceability_link_type}
                          </span>
                        </div>
                      ) : (
                        request.traceability_link_type
                      )}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" align="left">
                      {previousTraceabilityLink !== null &&
                      request.first_artifact_name !==
                        previousTraceabilityLink.first_artifact ? (
                        <div>
                          <span className={classes.oldData}>
                            {previousTraceabilityLink.first_artifact}
                          </span>{" "}
                          <ArrowRightIcon fontSize="small" />{" "}
                          <span className={classes.newData}>
                            {request.first_artifact_name}
                          </span>
                        </div>
                      ) : (
                        request.first_artifact_name
                      )}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" align="left">
                      {previousTraceabilityLink !== null &&
                      request.second_artifact_name !==
                        previousTraceabilityLink.second_artifact ? (
                        <div>
                          <span className={classes.oldData}>
                            {previousTraceabilityLink.second_artifact}
                          </span>{" "}
                          <ArrowRightIcon fontSize="small" />{" "}
                          <span className={classes.newData}>
                            {request.second_artifact_name}
                          </span>
                        </div>
                      ) : (
                        request.second_artifact_name
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
                              onClick={() =>
                                acceptRequest(request.id, request.title)
                              }
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
                      </ButtonGroup>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })
            ) : (
              <StyledTableRow>
                <StyledTableCell
                  component="th"
                  scope="row"
                  align="center"
                  colSpan={15}
                >
                  <strong>
                    The project does not have any traceability link change
                    requests
                  </strong>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
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
    traceabilityLinkTypes: state.traceabilityLinkTypes.traceabilityLinkTypes,
    selectedProject: state.projects.selectedProject,
    traceabilityLinkChangeRequests:
      state.traceabilityLinkChangeRequests.traceabilityLinkChangeRequests,
    isLoading: state.traceabilityLinkChangeRequests.loading,
    myTraceabilityLinkChangeRequests:
      state.myTraceabilityLinkChangeRequests.myTraceabilityLinkChangeRequests,
    traceabilityLinks: state.traceabilityLinks.traceabilityLinks,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchTraceabilityLinkChangeRequests: (projectID, token) =>
      dispatch(
        traceabilityLinkChangeRequestsActions.fetchTraceabilityLinkChangeRequests(
          projectID,
          token
        )
      ),
    onAcceptTraceabilityLinkChangeRequest: (projectID, requestID, token) =>
      dispatch(
        traceabilityLinkChangeRequestsActions.acceptTraceabilityLinkChangeRequest(
          projectID,
          requestID,
          token
        )
      ),
    onRejectTraceabilityLinkChangeRequest: (
      projectID,
      requestID,
      rejectReason,
      token
    ) =>
      dispatch(
        traceabilityLinkChangeRequestsActions.rejectTraceabilityLinkChangeRequest(
          projectID,
          requestID,
          rejectReason,
          token
        )
      ),
    onFetchTraceabilityLinks: (pID, token) =>
      dispatch(traceabilityLinksActions.fetchTraceabilityLinks(pID, token)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TraceabilityChangeRequests)
);
