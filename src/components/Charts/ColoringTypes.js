import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core";
import * as artifactTypesActions from "../../store/actions/artifactTypes";
import * as traceabilityLinkTypesActions from "../../store/actions/traceabilityLinkTypes";

var artifactTypesColors = {
  "Business need": "#ff7f0e",
  Source: "#2ca02c",
  Feature: "#d62728",
  Requirement: "#1f77b4",
  "Use case": "#9467bd",
  "Analysis class diagram": "#055904",
  "Sequence diagram": "#e377c2",
  "Activity diagram": "#943d3d",
  "User interface": "#bcbd22",
  "Design Class diagram": "#17becf",
  "Deployment diagram": "#a1a108",
  Method: "#f0027f",
  Class: "#666666",
  "Test case": "#0b7869",
  //   Others: "black",
};
var traceabilityLinkTypesColors = {
  "Depends on": "#994c08",
  "Is verified by": "#0c12c7",
  "Is origin of": "#511985",
  "Is satisfied by": "#388a38",
  "Is implemented in": "#8f1010",
  //   Others: "black",
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // width: "100%",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
}));

const generateColor = () => {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
export function colorNodes(d) {
  if (artifactTypesColors.hasOwnProperty(d.type))
    return artifactTypesColors[d.type];
  else {
    artifactTypesColors[d.type] = generateColor();
    return artifactTypesColors[d.type];
  }
}
export function colorLinks(d) {
  if (d.type === "") return;
  if (traceabilityLinkTypesColors.hasOwnProperty(d.type))
    return traceabilityLinkTypesColors[d.type];
  else {
    traceabilityLinkTypesColors[d.type] = generateColor();
    return traceabilityLinkTypesColors[d.type];
  }
}

function ColoringTypes(props) {
  const classes = useStyles();

  const resetColors = () => {
    artifactTypesColors = {
      "Business need": "#ff7f0e",
      Source: "#2ca02c",
      Feature: "#d62728",
      Requirement: "#1f77b4",
      "Use case": "#9467bd",
      "Analysis class diagram": "#055904",
      "Sequence diagram": "#e377c2",
      "Activity diagram": "#943d3d",
      "User interface": "#bcbd22",
      "Design Class diagram": "#17becf",
      "Deployment diagram": "#a1a108",
      Method: "#f0027f",
      Class: "#666666",
      "Test case": "#0b7869",
      //   Others: "black",
    };
    traceabilityLinkTypesColors = {
      "Depends on": "#994c08",
      "Is verified by": "#0c12c7",
      "Is origin of": "#511985",
      "Is satisfied by": "#388a38",
      "Is implemented in": "#8f1010",
      //   Others: "black",
    };
  };
  useEffect(() => {
    props.onFetchArtifactTypes(props.selectedProject.id, props.token);
    props.onFetchTraceabilityLinkTypes(props.selectedProject.id, props.token);
    resetColors();
  }, []);

  return (
    <div>
      <strong>Nodes/Artifacts: </strong>(
      {Object.entries(artifactTypesColors).map(([key, value], index) => {
        return (
          <span style={{ color: value }}>
            <svg
              width="10"
              height="10"
              style={{ backgroundColor: value, borderRadius: "2px" }}
            />{" "}
            {key}
            {Object.keys(artifactTypesColors).length === index + 1
              ? null
              : ", "}
          </span>
        );
      })}
      )
      <br />
      <strong>Links/TraceabilityLinks: </strong>(
      {Object.entries(traceabilityLinkTypesColors).map(
        ([key, value], index) => {
          return (
            <span style={{ color: value }}>
              <svg
                width="10"
                height="10"
                style={{ backgroundColor: value, borderRadius: "2px" }}
              />{" "}
              {key}
              {Object.keys(traceabilityLinkTypesColors).length === index + 1
                ? null
                : ", "}
            </span>
          );
        }
      )}
      )
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ColoringTypes);
