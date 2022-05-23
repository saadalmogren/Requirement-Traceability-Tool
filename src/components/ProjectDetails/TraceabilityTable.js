import React, { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import { Button, Grid, Tooltip } from "@material-ui/core";
import Confirmation from "../Confirmation/Confirmation";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as traceabilityLinksActions from "../../store/actions/traceabilityLinks";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description",
  },
  {
    id: "traceability_Link_Type",
    numeric: false,
    disablePadding: false,
    label: "Type",
  },
  {
    id: "created_by",
    numeric: false,
    disablePadding: false,
    label: "Created By",
  },
  {
    id: "creation_date",
    numeric: false,
    disablePadding: false,
    label: "Created Date",
  },

  {
    id: "first_artifact",
    numeric: false,
    disablePadding: false,
    label: "First Artifact",
  },
  {
    id: "second_artifact",
    numeric: false,
    disablePadding: false,
    label: "Second Artifact",
  },
  {
    id: "version",
    numeric: false,
    disablePadding: false,
    label: "Version",
  },
  {
    id: "modification_date",
    numeric: false,
    disablePadding: false,
    label: "Modification Date",
  },
  {
    id: "modified_by",
    numeric: false,
    disablePadding: false,
    label: "Modified By",
  },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "center"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.primary.main,
          backgroundColor: lighten(theme.palette.primary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.primary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
  delBtn: {
    color: "red",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, selected } = props;

  const handleDelete = () => {
    console.log(
      "delete items: ",
      selected.map((d) => d.name)
    );
    console.log("selected", selected);
    //check props
    selected.map((d) => {
      props.props.onRemoveTraceabilityLink(
        props.props.selectedProject.id,
        d.id,
        props.props.token
      );
      props.onDelete();
    });

    props.props.history.replace("/project-details", {
      ...props.props.history.state,
      alert: {
        name: selected.map(
          (a, index) => a.name + (index + 1 < selected.length ? ", " : "")
        ),
        msg: "The traceability link/s has been deleted successfully!",
      },
      value: 1,
    });
  };

  const handleModify = () => {
    console.log("Modify item: ", selected);
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Traceability Links List
        </Typography>
      )}

      {numSelected === 1 &&
      props.props.userPrivileges.indexOf("Modify traceability link") !== -1 ? (
        <Link
          to={{
            pathname: "/modify-traceability-link",
            state: {
              traceabilityLink: selected,
            },
          }}
        >
          <Tooltip title="Modify">
            <IconButton aria-label="modify" onClick={handleModify}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Link>
      ) : null}

      {numSelected > 0 &&
      props.props.userPrivileges.indexOf("Remove traceability link") !== -1 ? (
        <Confirmation
          title="Delete Confirmation!"
          description={
            <div>
              {"Are you sure you want to delete "}{" "}
              <strong>
                {selected.map((d, index) => index + 1 + "-" + d.name + " ")}
              </strong>{" "}
              {"?"}
            </div>
          }
          variant="text"
          color="primary"
          onConfirm={() => handleDelete(selected)}
        >
          <DeleteForeverIcon className={classes.delBtn} />
        </Confirmation>
      ) : null}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  selectedRow: {
    color: theme.palette.primary.main,
    backgroundColor: lighten(theme.palette.primary.light, 0.85),
  },
  link: {
    textDecoration: "none",
  },
}));

const handleMouseHover = (e) => {
  e.target.style.cursor = "pointer";
};
function TraceabilityTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  useEffect(() => {
    props.onFetchTraceabilityLinks(props.selectedProject.id, props.token);
  }, []);

  const rows = [...props.traceabilityLinks];

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, data) => {
    const name = data.name;
    const selectedIndex = selected.map((d) => d.name).indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, data);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectedChange = (value) => {
    setSelected([]);
  };

  const isSelected = (data) =>
    selected.map((d) => d.name).indexOf(data.name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          props={props}
          onDelete={handleSelectedChange}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={20} align="center">
                    <strong>
                      There is no Traceability Links in the project
                    </strong>
                  </TableCell>
                </TableRow>
              ) : (
                stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    var dateString = row.creation_date;
                    dateString = new Date(dateString).toUTCString();
                    dateString = dateString.split(" ").slice(0, 4).join(" ");
                    var modificationDate = row.modification_date;
                    if (modificationDate) {
                      modificationDate = new Date(
                        modificationDate
                      ).toUTCString();
                      modificationDate = modificationDate
                        .split(" ")
                        .slice(0, 4)
                        .join(" ");
                    }
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        onMouseEnter={handleMouseHover}
                        className={isItemSelected ? classes.selectedRow : ""}
                        id={row.name}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.name}
                        </TableCell>
                        <TableCell align="center">{row.description}</TableCell>
                        <TableCell align="center">
                          {row.traceability_Link_Type}
                        </TableCell>
                        <TableCell align="center">{row.created_by}</TableCell>
                        <TableCell align="center">{dateString}</TableCell>
                        <TableCell align="center">
                          {row.first_artifact}
                        </TableCell>
                        <TableCell align="center">
                          {row.second_artifact}
                        </TableCell>
                        <TableCell align="center">{row.version}</TableCell>
                        <TableCell align="center">{modificationDate}</TableCell>
                        <TableCell align="center">{row.modified_by}</TableCell>
                      </TableRow>
                    );
                  })
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <Grid container justify="flex-end" spacing={3}>
        <Grid item>
          {props.userPrivileges.indexOf("Create traceability link") !== -1 ? (
            <Link to="create-traceability-link" className={classes.link}>
              <Button color="primary" variant="contained">
                Create Traceability link <AddIcon />
              </Button>
            </Link>
          ) : null}
        </Grid>
        <Grid item>
          <Link to="make-traceability-change-request" className={classes.link}>
            <Button color="primary" variant="contained">
              Make Change Request
            </Button>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    userPrivileges: state.changeUserRole.userPrivileges.map((p) => p.name),
    token: state.auth.token,
    selectedProject: state.projects.selectedProject,
    traceabilityLinks: state.traceabilityLinks.traceabilityLinks,
    traceabilityLinkTypes: state.traceabilityLinkTypes.traceabilityLinkTypes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onRemoveTraceabilityLink: (pID, traceabilityLinkID, token) =>
      dispatch(
        traceabilityLinksActions.removeTraceabilityLinkFromProject(
          pID,
          traceabilityLinkID,
          token
        )
      ),
    onFetchTraceabilityLinks: (pID, token) =>
      dispatch(traceabilityLinksActions.fetchTraceabilityLinks(pID, token)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TraceabilityTable)
);
