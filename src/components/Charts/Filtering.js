import {
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as artifactTypesActions from "../../store/actions/artifactTypes";
import * as traceabilityLinkTypesActions from "../../store/actions/traceabilityLinkTypes";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
}));
function Filtering(props) {
  const classes = useStyles();

  const [filterNodes, setFilterNodes] = useState("");
  const [filterLinks, setFilterLinks] = useState("");
  const [connectivity, setConnectivity] = useState("");

  useEffect(() => {
    props.onFetchArtifactTypes(props.selectedProject.id, props.token);
    props.onFetchTraceabilityLinkTypes(props.selectedProject.id, props.token);
  }, []);

  useEffect(() => {
    handleFiltering();
  }, [filterNodes, filterLinks, connectivity]);

  const handleNodesChange = (e) => {
    const newFilter = e.target.value;
    setFilterNodes(newFilter);
  };
  const handleLinksChange = (e) => {
    const newFilter = e.target.value;
    setFilterLinks(newFilter);
  };
  const handleConnectivityChange = (e) => {
    const newFilter = e.target.value;
    setConnectivity(newFilter);
  };

  const handleFiltering = () => {
    const filteredData = { ...props.data };

    if (filterNodes)
      if (filterNodes !== "all")
        filteredData.nodes = filteredData.nodes.filter(
          (node) => node.type === filterNodes
        );

    if (filterLinks)
      if (filterLinks !== "all")
        filteredData.links = filteredData.links.filter(
          (link) => link.type === filterLinks
        );

    if (connectivity === "connected" || connectivity === "disconnected") {
      var sources, targets;
      if (props.type === "matrix") {
        sources = filteredData.links.map((link) => link.source);
        targets = filteredData.links.map((link) => link.target);
      } else if (props.type === "network") {
        sources = filteredData.links.map((link) => link.source.id);
        targets = filteredData.links.map((link) => link.target.id);
      }
      if (connectivity === "connected") {
        filteredData.nodes = filteredData.nodes.filter(
          (node) => sources.includes(node.id) || targets.includes(node.id)
        );
      } else if (connectivity === "disconnected") {
        filteredData.nodes = filteredData.nodes.filter((node) => {
          if (targets.includes(sources)) return false;
          if (sources.includes(node.id)) return false;
          if (targets.includes(node.id)) return false;

          return true;
        });
      }
    }
    const nodes = filteredData.nodes.map((n) => n.id);
    // if bugs discovered later change nodes[nodes.length] to nodes[nodes.length-1]
    if (props.type === "matrix")
      filteredData.links = filteredData.links.filter((link) => {
        if (
          nodes.includes(link.source) &&
          nodes.includes(link.target)
          // &&
          // link.target !== nodes[nodes.length]
        ) {
          return true;
        }
      });
    else if (props.type === "network")
      filteredData.links = filteredData.links.filter((link) => {
        if (
          nodes.includes(link.source.id) &&
          nodes.includes(link.target.id)
          // &&
          // link.target !== nodes[nodes.length]
        ) {
          return true;
        }
      });

    props.onChange(filteredData);
  };

  const displayFilteringNodes = () => {
    return (
      <Grid item>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Artifact Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filterNodes}
            onChange={handleNodesChange}
          >
            <MenuItem key={"all"} value={"all"} selected>
              {"All"}
            </MenuItem>
            {props.artifactTypes.map((type) => {
              return (
                <MenuItem key={type.name} value={type.name}>
                  {type.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
    );
  };

  const displayFilteringLinks = () => {
    return (
      <Grid item>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">
            Traceability Link Type
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filterLinks}
            onChange={handleLinksChange}
          >
            <MenuItem key={"all"} value={"all"} selected>
              {"All"}
            </MenuItem>
            {props.traceabilityLinkTypes.map((type) => {
              return (
                <MenuItem key={type.name} value={type.name}>
                  {type.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
    );
  };

  const displayFilteringConnectivity = () => {
    return (
      <Grid item>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Connectivity</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={connectivity}
            onChange={handleConnectivityChange}
          >
            <MenuItem key={"both"} value={"both"} selected>
              {"Both"}
            </MenuItem>
            <MenuItem key={"connected"} value={"connected"}>
              {"Connected"}
            </MenuItem>
            <MenuItem key={"disconnected"} value={"disconnected"}>
              {"Disconnected"}
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
    );
  };

  return (
    <Grid container direction={"row"} justify="center">
      <Typography>Filter: </Typography>
      {displayFilteringNodes()}
      {displayFilteringLinks()}
      {displayFilteringConnectivity()}
    </Grid>
  );
}

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    token: state.auth.token,
    artifactTypes: state.artifactTypes.artifactTypes,
    traceabilityLinkTypes: state.traceabilityLinkTypes.traceabilityLinkTypes,
    selectedProject: state.projects.selectedProject,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onFetchArtifactTypes: (pID, token) =>
      dispatch(artifactTypesActions.fetchArtifactTypes(pID, token)),
    onFetchTraceabilityLinkTypes: (pID, token) =>
      dispatch(
        traceabilityLinkTypesActions.fetchTraceabilityLinkTypes(pID, token)
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Filtering);
