import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  withStyles,
  TableCell,
  Tooltip,
} from "@material-ui/core";
import React, { useEffect } from "react";
import Confirmation from "../../Confirmation/Confirmation";
// import SettingsIcon from "@material-ui/icons/Settings";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import * as myTraceabilityLinkChangeRequests from "../../../store/actions/myTraceabilityLinkChangeRequests";
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
    width: "100%",
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
    width: "100%",
  },
  backIcon: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  rootContent: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  redBtn: {
    color: "red",
  },
  tab: {
    marginTop: 1,
  },
}));

const MyTraceabilityChangeRequests = (props) => {
  const classes = useStyles();

  const pendingRequests = props.traceabilityLinkChangeRequests.filter(
    (r) => r.status == "Pending"
  );

  useEffect(() => {
    props.onFetchMyTraceabilityLinkChangeRequests(
      props.selectedProject.id,
      props.token
    );
  }, [pendingRequests.length]);

  const deleteRequest = (requestID, name) => {
    props.onRemoveMyTraceabilityLinkChangeRequests(
      requestID,
      props.selectedProject.id,
      props.token
    );
    props.history.replace("/change-requests", {
      ...props.location.state,
      alert: {
        name: name,
        msg:
          "The change request on traceability link has been deleted successfully!",
      },
    });
  };

  const displaySentChangeRequests = () => {
    const filteredRequests = props.myTraceabilityLinkChangeRequests.filter(
      (request) => request.status === "Pending"
    );
    if (filteredRequests.length > 0) {
      return filteredRequests.map((request, index) => {
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
              {request.traceability_link_name}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row" align="left">
              {request.traceability_link_description}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row" align="left">
              {request.traceability_link_type}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row" align="left">
              {request.first_artifact_name}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row" align="left">
              {request.second_artifact_name}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row" align="left">
              {dateString}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row" align="left">
              {request.status}
            </StyledTableCell>

            <StyledTableCell
              component="th"
              scope="row"
              align="center"
              width="80"
              height="80"
              padding="checkbox"
            >
              {request.status === "Pending" ? (
                <Confirmation
                  title="Delete Confirmation!"
                  description={
                    <div>
                      {"Are you sure you want to delete "}
                      <strong>{request.title}</strong> {"?"}
                    </div>
                  }
                  variant="text"
                  onConfirm={() => deleteRequest(request.id, request.title)}
                  className={classes.delBtn}
                >
                  <DeleteForeverIcon className={classes.delBtn} />
                </Confirmation>
              ) : null}
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
            colSpan={12}
          >
            <strong>
              You don't have any traceability link change requests
            </strong>
          </StyledTableCell>
        </StyledTableRow>
      );
  };

  return (
    <div>
      <TableContainer component={Paper} className={classes.table}>
        <Table
          className={classes.table}
          aria-label="customized table"
          stickyHeader
        >
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">#</StyledTableCell>
              <StyledTableCell align="left">Request Title</StyledTableCell>
              <StyledTableCell align="left">
                Request Description
              </StyledTableCell>
              <StyledTableCell align="left">Request Type</StyledTableCell>
              <StyledTableCell align="left">
                Traceability Link Name
              </StyledTableCell>
              <StyledTableCell align="left">
                Traceability Link Description
              </StyledTableCell>
              <StyledTableCell align="left">
                Traceability Link Type
              </StyledTableCell>
              <StyledTableCell align="left">First Artifact</StyledTableCell>
              <StyledTableCell align="left">Second Artifact</StyledTableCell>
              <StyledTableCell align="left">Request Date</StyledTableCell>
              <StyledTableCell align="left">Status</StyledTableCell>
              <StyledTableCell align="left">
                {/* <SettingsIcon /> */}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{displaySentChangeRequests()}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    token: state.auth.token,
    userPrivileges: state.changeUserRole.userPrivileges.map((p) => p.name),
    selectedProject: state.projects.selectedProject,
    myTraceabilityLinkChangeRequests:
      state.myTraceabilityLinkChangeRequests.myTraceabilityLinkChangeRequests,
    traceabilityLinkChangeRequests:
      state.traceabilityLinkChangeRequests.traceabilityLinkChangeRequests,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchMyTraceabilityLinkChangeRequests: (projectID, token) =>
      dispatch(
        myTraceabilityLinkChangeRequests.fetchMyTraceabilityLinkChangeRequests(
          projectID,
          token
        )
      ),
    onRemoveMyTraceabilityLinkChangeRequests: (requestID, projectID, token) =>
      dispatch(
        myTraceabilityLinkChangeRequests.removeMyTraceabilityLinkChangeRequest(
          requestID,
          projectID,
          token
        )
      ),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MyTraceabilityChangeRequests)
);
