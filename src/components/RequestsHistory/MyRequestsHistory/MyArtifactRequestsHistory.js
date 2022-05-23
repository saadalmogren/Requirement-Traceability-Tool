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
} from "@material-ui/core";
import React, { useEffect } from "react";
// import SettingsIcon from "@material-ui/icons/Settings";
// import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import * as myArtifactChangeRequestsActions from "../../../store/actions/myArtifactChangeRequests";
import * as artifactChangeRequestsActions from "../../../store/actions/artifactChangeRequests";
import { connect } from "react-redux";
// import Confirmation from "../../Confirmation/Confirmation";
// import InfoIcon from "@material-ui/icons/Info";
// import CustomizedPopOver from "../CustomizedPopOver";

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
    maxHeight: 550,
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
  red: {
    color: "red",
  },
  green: {
    color: "green",
  },
  tab: {
    marginTop: 1,
  },
}));

const MyArtifactRequestsHistory = (props) => {
  const classes = useStyles();

  useEffect(() => {
    props.onFetchMyArtifactChangeRequests(
      props.selectedProject.id,
      props.token
    );
  }, []);

  const deleteRequest = (rTitle) => {
    console.log("Deleting request: ", rTitle);
  };
  const displayMyChangeRequests = () => {
    const filteredRequests = props.myArtifactChangeRequests.filter(
      (request) => request.status !== "Pending"
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
              {request.artifact_name}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row" align="left">
              {request.artifact_description}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row" align="left">
              {request.artifact_type}
            </StyledTableCell>
            <StyledTableCell component="th" scope="row" align="left">
              {dateString}
            </StyledTableCell>
            <StyledTableCell
              component="th"
              scope="row"
              align="left"
              className={
                request.status === "Accepted" ? classes.green : classes.red
              }
            >
              {request.status === "Accepted"
                ? request.status
                : `${request.status}. ${request.reject_reason}`}{" "}
            </StyledTableCell>

            <StyledTableCell component="th" scope="row" align="left">
              {/* <CustomizedPopOver HoverOver={<InfoIcon color="secondary" />}>
                <div>
                  <Typography component="h6" variant="h6">
                    {request.request_type}
                  </Typography>
                  <Typography variant="body">
                    <strong>Name: </strong>
                    {request.artifact_name}
                    <br />
                    <strong>Description: </strong>
                    {request.description}
                    <br />
                    <strong>Type: </strong>
                    {request.artifact_type}
                  </Typography>
                </div>
              </CustomizedPopOver> */}
            </StyledTableCell>

            {/* <StyledTableCell
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
                      <strong>{request.rTitle}</strong> {"?"}
                    </div>
                  }
                  variant="text"
                  onConfirm={() => deleteRequest(request.rTitle)}
                  className={classes.delBtn}
                >
                  <DeleteForeverIcon className={classes.delBtn} />
                </Confirmation>
              ) : null}
            </StyledTableCell> */}
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
            <strong>You don't have any artifact change requests history</strong>
          </StyledTableCell>
        </StyledTableRow>
      );
  };
  return (
    <React.Fragment>
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
              <StyledTableCell align="left">Artifact Name</StyledTableCell>
              <StyledTableCell align="left">
                Artifact Description
              </StyledTableCell>
              <StyledTableCell align="left">Artifact Type</StyledTableCell>
              <StyledTableCell align="left">Request Date</StyledTableCell>
              <StyledTableCell align="left">Status</StyledTableCell>
              <StyledTableCell align="left">
                {/* <SettingsIcon /> */}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{displayMyChangeRequests()}</TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    token: state.auth.token,
    userPrivileges: state.changeUserRole.userPrivileges.map((p) => p.name),
    artifactTypes: state.artifactTypes.artifactTypes,
    selectedProject: state.projects.selectedProject,
    artifactChangeRequests: state.artifactChangeRequests.artifactChangeRequests,
    myArtifactChangeRequests:
      state.myArtifactChangeRequests.myArtifactChangeRequests,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchArtifactChangeRequests: (projectID, token) =>
      dispatch(
        artifactChangeRequestsActions.fetchArtifactChangeRequests(
          projectID,
          token
        )
      ),
    onFetchMyArtifactChangeRequests: (projectID, token) =>
      dispatch(
        myArtifactChangeRequestsActions.fetchMyArtifactChangeRequests(
          projectID,
          token
        )
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyArtifactRequestsHistory);
