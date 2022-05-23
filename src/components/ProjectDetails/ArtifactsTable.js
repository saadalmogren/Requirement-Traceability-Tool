import React, { useEffect, useState } from "react";
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
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import AssessmentIcon from "@material-ui/icons/Assessment";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  unstable_createMuiStrictModeTheme,
} from "@material-ui/core";
import Confirmation from "../Confirmation/Confirmation";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { default as TraceabilityLinkIcon } from "@material-ui/icons/SettingsEthernet";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as artifactsActions from "../../store/actions/artifacts";
import * as artifactTypesActions from "../../store/actions/artifactTypes";
import * as traceabilityLinkTypesActions from "../../store/actions/traceabilityLinkTypes";
import { Alert, AlertTitle } from "@material-ui/lab";

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
  { id: "artifact_type", numeric: false, disablePadding: false, label: "Type" },
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
    flex: "1 1 20%",
  },
  delBtn: {
    color: "red",
  },
  formControl: {
    minWidth: 190,
  },
  disabledLink: {
    cursor: "default",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {
    numSelected,
    selected,
    modifiableArtifactTypes,
    removableArtifactTypes,
    dependents,
  } = props;
  const [open, setOpen] = useState(false);
  const [firstArtifact, setFirstArtifact] = useState("");
  const [secondArtifact, setSecondArtifact] = useState("");
  const [swapped, setSwapped] = useState(false);
  const [traceabilityLinkType, setTraceabilityLinkType] = useState("");

  useEffect(() => {
    if (swapped) {
      if (selected.length === 1) {
        setSecondArtifact(selected[0]);
        setFirstArtifact("");
        setTraceabilityLinkType("");
        setSwapped(false);
      } else if (selected.length === 2) {
        setSecondArtifact(selected[0]);
        setFirstArtifact(selected[1]);
        // setSwapped(false);
      } else {
        setFirstArtifact("");
        setSecondArtifact("");
        setTraceabilityLinkType("");
        setSwapped(false);
      }
    } else if (selected.length === 1) {
      setFirstArtifact(selected[0]);
      setSecondArtifact("");
      setTraceabilityLinkType("");
    } else if (selected.length === 2) {
      setFirstArtifact(selected[0]);
      setSecondArtifact(selected[1]);
    } else {
      setFirstArtifact("");
      setSecondArtifact("");
      setTraceabilityLinkType("");
      setSwapped(false);
    }
  }, [selected, swapped]);

  const handleOpen = (e) => {
    setOpen(!open);
  };

  const swapArtifact = () => {
    const tempArtifact = firstArtifact;
    setFirstArtifact(secondArtifact);
    setSecondArtifact(tempArtifact);
    setSwapped(true);
  };

  const handleDelete = () => {
    const finalizedArtifacts = selected.filter(
      (artifact) =>
        dependents.map((dep) => dep.artifact).indexOf(artifact.name) === -1
    );
    if (finalizedArtifacts.length > 0) {
      finalizedArtifacts.map((d) => {
        props.props.onRemoveArtifact(
          props.props.selectedProject.id,
          d.id,
          props.props.token
        );
        props.onDelete();
      });

      props.props.history.replace("/project-details", {
        ...props.props.history.state,
        alert: {
          name: finalizedArtifacts.map(
            (a, index) =>
              a.name + (index + 1 < finalizedArtifacts.length ? ", " : "")
          ),
          msg: "The artifact/s has been deleted successfully!",
        },
      });
    }
  };

  const handleFirstArtifactChange = (e) => {
    setFirstArtifact(e.target.value);
  };

  const handleSecondArtifactChange = (e) => {
    setSecondArtifact(e.target.value);
  };
  const handleTraceabilityLinkTypeChange = (e) => {
    setTraceabilityLinkType(e.target.value);
  };

  const displayAlert = () => {
    if (dependents.length > 0)
      return (
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          The following Artifact/s will not be deleted!
          {dependents.map((dep) => (
            <div>
              <strong>{dep.artifact}</strong> has dependency on the following
              Traceability Links:{" "}
              <strong>
                {dep.list.map((t, index) => (
                  <React.Fragment>
                    {index + 1 + "-"}
                    <Link
                      to={{
                        pathname: "/project-details",
                        hash: "#" + t.name,
                        key: index + t.name,
                        state: {
                          value: 1,
                        },
                      }}
                    >
                      {t.name + " "}
                    </Link>
                  </React.Fragment>
                ))}
              </strong>{" "}
            </div>
          ))}
        </Alert>
      );
  };
  const displayMiniCreateTraceabilityLink = () => {
    const displayArtifactsTypes = () => {
      if (firstArtifact && secondArtifact) {
        const filteredArtifacts = props.props.traceabilityLinkTypes.filter(
          (t) =>
            t.first_artifact_type === firstArtifact.artifact_type &&
            t.second_artifact_type === secondArtifact.artifact_type
        );
        if (filteredArtifacts.length > 0) {
          return filteredArtifacts.map((type) => (
            <MenuItem key={type.id} value={type}>
              {type.name}
            </MenuItem>
          ));
        } else
          return (
            <MenuItem value={"disabled"} disabled>
              {"There is no traceability link type for the selected artifacts"}
            </MenuItem>
          );
      } else return null;
    };

    if (open && (selected.length === 1 || selected.length === 2)) {
      return (
        <React.Fragment>
          <Grid item container justify="center" direction="row">
            <Grid item>
              <FormControl className={classes.formControl} required>
                <InputLabel id="firstArtifact">First Artifact</InputLabel>
                <Select
                  labelId="firstArtifact"
                  id="firstArtifactSelect"
                  value={firstArtifact}
                  onChange={handleFirstArtifactChange}
                  disabled
                >
                  {props.props.artifacts.map((artifact) => {
                    return (
                      <MenuItem key={artifact.id} value={artifact}>
                        {artifact.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Tooltip title="Swap artifacts">
                <IconButton onClick={swapArtifact}>
                  <SwapHorizIcon />
                </IconButton>
              </Tooltip>
              <FormControl className={classes.formControl} required>
                <InputLabel id="secondArtifact">Second Artifact</InputLabel>
                <Select
                  labelId="secondArtifact"
                  id="secondArtifactSelect"
                  value={secondArtifact}
                  onChange={handleSecondArtifactChange}
                  disabled
                >
                  {props.props.artifacts.map((artifact) => {
                    return (
                      <MenuItem key={artifact.id} value={artifact}>
                        {artifact.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Box ml={2} />
            <Grid item>
              <FormControl className={classes.formControl} required>
                <InputLabel id="traceabilityLinkType">
                  Traceability Link Type
                </InputLabel>
                <Select
                  labelId="traceabilityLinkType"
                  id="traceabilityLinkTypeSelect"
                  value={traceabilityLinkType}
                  onChange={handleTraceabilityLinkTypeChange}
                >
                  {displayArtifactsTypes()}
                </Select>
              </FormControl>
              <Tooltip title="Create Traceability Link">
                <span>
                  <Link
                    className={
                      traceabilityLinkType ? classes.link : classes.disabledLink
                    }
                    to={
                      traceabilityLinkType
                        ? {
                            pathname: "/create-traceability-link",
                            state: {
                              firstArtifact: firstArtifact,
                              secondArtifact: secondArtifact,
                              traceabilityLinkType: traceabilityLinkType,
                            },
                          }
                        : "#"
                    }
                  >
                    <IconButton
                      color="primary"
                      disabled={
                        !firstArtifact ||
                        !secondArtifact ||
                        !traceabilityLinkType
                      }
                      disableFocusRipple
                      disableRipple
                      disablePadding
                    >
                      <AddIcon
                        color={
                          !firstArtifact ||
                          !secondArtifact ||
                          !traceabilityLinkType
                            ? "disabled"
                            : "primary"
                        }
                        size="smalle"
                      />
                    </IconButton>
                  </Link>
                </span>
              </Tooltip>
            </Grid>
          </Grid>
        </React.Fragment>
      );

      //     <Link
      //           to={{
      //             pathname: "/create-traceability-link",
      //             state: {
      //               artifact: selected,
      //             },
      //           }}
      //         >
      // </Link>
    }
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
          Artifacts List
        </Typography>
      )}

      {displayMiniCreateTraceabilityLink()}

      {numSelected === 1 ? (
        <Tooltip title="Impact Analysis">
          <Link
            to={{
              pathname: "/impact-analysis",
              state: { artifact: selected[0].id },
            }}
          >
            <IconButton aria-label="Traceability Link">
              <AssessmentIcon />
            </IconButton>
          </Link>
        </Tooltip>
      ) : null}

      {(numSelected === 1 || numSelected === 2) &&
      (props.props.userPrivileges
        .map((p) => p.name)
        .indexOf("Create traceability link") !== -1 ||
        (modifiableArtifactTypes !== null &&
          modifiableArtifactTypes.indexOf(selected[0].artifact_type) !==
            -1)) ? (
        <Tooltip title="Traceability Link">
          <IconButton aria-label="Traceability Link" onClick={handleOpen}>
            <TraceabilityLinkIcon />
          </IconButton>
        </Tooltip>
      ) : null}

      {numSelected === 1 &&
      (props.props.userPrivileges
        .map((p) => p.name)
        .indexOf("Modify artifact") !== -1 ||
        (modifiableArtifactTypes !== null &&
          modifiableArtifactTypes.indexOf(selected[0].artifact_type) !==
            -1)) ? (
        <Link
          to={{
            pathname: "/modify-artifact",
            state: {
              artifact: selected,
            },
          }}
        >
          <Tooltip title="Modify">
            <IconButton aria-label="modify">
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Link>
      ) : null}

      {numSelected > 0 &&
      (props.props.userPrivileges
        .map((p) => p.name)
        .indexOf("Remove artifact") !== -1 ||
        (removableArtifactTypes !== null &&
          selected
            .map((p) => {
              if (removableArtifactTypes.indexOf(p.artifact_type) === -1)
                return false;
              else return true;
            })
            .indexOf(false) === -1)) ? (
        <Confirmation
          title="Delete Confirmation!"
          description={
            <div>
              {"Are you sure you want to delete "}
              <strong>
                {selected.map((d, index) => index + 1 + "-" + d.name + " ")}
              </strong>
              {"?"}
              {displayAlert()}
              <br />
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
  disabledLink: {
    cursor: "none",
  },
}));

const handleMouseHover = (e) => {
  e.target.style.cursor = "pointer";
};

function ArtifactsTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dependentsArtifacts, setDependentsArtifacts] = React.useState([]);
  const [link, setLink] = React.useState([]);

  const modifiableArtifactTypes =
    props.userPrivileges.map((p) => p.name).indexOf("Modify artifact") === -1 &&
    props.userPrivileges
      .map((p) => p.name)
      .indexOf("Modify artifact of a specific type") !== -1
      ? props.userPrivileges
          .filter((p) => p.name === "Modify artifact of a specific type")
          .map((p) => {
            if (p.name === "Modify artifact of a specific type")
              return props.artifactTypes.filter(
                (type) => type.id === p.type
              )[0];
          })
          .map((p) => p.name)
      : null;

  const createArtifactTypes =
    props.userPrivileges.map((p) => p.name).indexOf("Create artifact") === -1 &&
    props.userPrivileges
      .map((p) => p.name)
      .indexOf("Create artifact of a specific type") !== -1
      ? props.userPrivileges
          .filter((p) => p.name === "Create artifact of a specific type")
          .map((p) => {
            if (p.name === "Create artifact of a specific type")
              return props.artifactTypes.filter(
                (type) => type.id === p.type
              )[0];
          })
          .map((p) => p.name)
      : null;

  const removableArtifactTypes =
    props.userPrivileges.map((p) => p.name).indexOf("Remove artifact") === -1 &&
    props.userPrivileges
      .map((p) => p.name)
      .indexOf("Remove artifact of a specific type") !== -1
      ? props.userPrivileges
          .filter((p) => p.name === "Remove artifact of a specific type")
          .map((p) => {
            if (p.name === "Remove artifact of a specific type")
              return props.artifactTypes.filter(
                (type) => type.id === p.type
              )[0];
          })
          .map((p) => p.name)
      : null;

  const checkDependency = (artifactNames) => {
    var valid = true;

    const dependents = artifactNames.map((a) => {
      return {
        artifact: a,
        list: props.traceabilityLinks.filter(
          (t) => t.first_artifact === a || t.second_artifact === a
        ),
      };
    });

    setDependentsArtifacts(
      dependents.filter((dependent) => dependent.list.length > 0)
    );

    return valid;
  };
  useEffect(() => {
    checkDependency(selected.map((a) => a.name));
  }, [selected]);

  useEffect(() => {
    props.onFetchArtifacts(props.selectedProject.id, props.token);
    props.onFetchArtifactTypes(props.selectedProject.id, props.token);
    props.onFetchTraceabilityLinkTypes(props.selectedProject.id, props.token);
  }, []);

  const rows = [...props.artifacts];

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
  const handleSelectedChange = (value) => {
    setSelected([]);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
          modifiableArtifactTypes={modifiableArtifactTypes}
          removableArtifactTypes={removableArtifactTypes}
          onDelete={handleSelectedChange}
          dependents={dependentsArtifacts}
          props={props}
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
                    <strong>There is no Artifacts in the project</strong>
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
                          {row.artifact_type}
                        </TableCell>
                        <TableCell align="center">{row.created_by}</TableCell>
                        <TableCell align="center">{dateString}</TableCell>
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
      <Grid container justify="flex-end" spacing={3} alignItems="center">
        <Grid item>
          {props.userPrivileges
            .map((p) => p.name)
            .indexOf("Create artifact") !== -1 ||
          props.userPrivileges
            .map((p) => p.name)
            .indexOf("Create artifact of a specific type") !== -1 ? (
            <Link to="create-artifact" className={classes.link}>
              <Button color="primary" variant="contained">
                Create Artifact <AddIcon />
              </Button>
            </Link>
          ) : null}
        </Grid>
        {props.userPrivileges.map((p) => p.name).indexOf("Create artifact") !==
          -1 ||
        (createArtifactTypes !== null &&
          createArtifactTypes.indexOf("Requirement") !== -1) ? (
          <Grid item>
            <Link to="import-requirement" className={classes.link}>
              <Button color="primary" variant="contained">
                Import Requirements
              </Button>
            </Link>
          </Grid>
        ) : null}
        <Grid item>
          <Link to="make-artifact-change-request" className={classes.link}>
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
    userPrivileges: state.changeUserRole.userPrivileges,
    token: state.auth.token,
    artifacts: state.artifacts.artifacts,
    traceabilityLinks: state.traceabilityLinks.traceabilityLinks,
    traceabilityLinkTypes: state.traceabilityLinkTypes.traceabilityLinkTypes,
    selectedProject: state.projects.selectedProject,
    artifactTypes: state.artifactTypes.artifactTypes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onRemoveArtifact: (pID, artifactID, token) =>
      dispatch(
        artifactsActions.removeArtifactFromProject(pID, artifactID, token)
      ),
    onFetchArtifacts: (pID, token) =>
      dispatch(artifactsActions.fetchArtifacts(pID, token)),
    onFetchArtifactTypes: (pID, token) =>
      dispatch(artifactTypesActions.fetchArtifactTypes(pID, token)),
    onFetchTraceabilityLinkTypes: (pID, token) =>
      dispatch(
        traceabilityLinkTypesActions.fetchTraceabilityLinkTypes(pID, token)
      ),
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ArtifactsTable)
);
