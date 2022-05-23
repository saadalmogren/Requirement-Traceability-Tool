import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { makeStyles, Paper } from "@material-ui/core";
import Filtering from "./Filtering";
import ColoringTypes from "./ColoringTypes";
import { colorNodes, colorLinks } from "./ColoringTypes";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // width: "100%",
  },
}));
const artifactTypesColors = {
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
  Others: "black",
};

const traceabilityLinkTypesColors = {
  "Depends on": "#994c08",
  "Is verified by": "#0c12c7",
  "Is origin of": "#511985",
  "Is satisfied by": "#388a38",
  "Is implemented in": "#8f1010",
  Others: "black",
};

function TraceabilityLinkMatrix(props) {
  const classes = useStyles();

  const height = (window.innerHeight * 2) / 4;
  const width = (window.innerWidth * 2) / 3;
  const [filterNodes, setFilterNodes] = useState("");
  const [filterLinks, setFilterLinks] = useState("");
  const [connectivity, setConnectivity] = useState("");

  const data = {
    nodes: props.nodes.map((artifact) => {
      return {
        id: artifact.name,
        type: artifact.artifact_type,
      };
    }),
    links: props.links.map((traceabilityLink) => {
      return {
        source: traceabilityLink.first_artifact,
        target: traceabilityLink.second_artifact,
        name: traceabilityLink.name,
        type: traceabilityLink.traceability_Link_Type,
      };
    }),
  };

  const handleFilterChange = (filteredData) => {
    const data = filteredData;

    matrix(data);
  };

  useEffect(() => {
    if (!props.nodes || props.nodes.length === 0) return;
    if (!props.links || props.links.length === 0) return;
    matrix(data);
  }, [filterNodes, filterLinks, connectivity, data.nodes]);

  if (!props.nodes || props.nodes.length === 0)
    return (
      <strong>
        There are no artifacts in the project to represent a graph
      </strong>
    );
  if (!props.links || props.links.length === 0)
    return (
      <strong>
        There are no traceability links in the project to represent a graph
      </strong>
    );

  // if (filterNodes)
  //   if (filterNodes !== "all")
  //     data.nodes = data.nodes.filter((node) => node.type === filterNodes);

  // if (filterLinks)
  //   if (filterLinks !== "all")
  //     data.links = data.links.filter((link) => link.type === filterLinks);

  // if (connectivity === "connected" || connectivity === "disconnected") {
  //   const sources = data.links.map((link) => link.source);
  //   const targets = data.links.map((link) => link.target);

  //   if (connectivity === "connected") {
  //     data.nodes = data.nodes.filter(
  //       (node) => sources.includes(node.id) || targets.includes(node.id)
  //     );
  //   } else if (connectivity === "disconnected") {
  //     data.nodes = data.nodes.filter(
  //       (node) => !sources.includes(node.id) || !targets.indexOf(node.id)
  //     );
  //   }
  // }

  const nodes = data.nodes.map((n) => n.id);
  // if bugs discovered later change nodes[nodes.length] to nodes[nodes.length-1]
  data.links = data.links.filter((link) => {
    if (
      nodes.includes(link.source) &&
      nodes.includes(link.target)
      //  &&
      // link.target !== nodes[nodes.length]
    ) {
      return true;
    }
  });

  // ------------------------------------------------------------------------------------------
  function matrix(data) {
    const nodes = data.nodes;
    const edges = data.links;

    d3.selectAll("#matrixSVG > *").remove();

    // const colorNodes = (d, event) => {
    //   if (artifactTypesColors.hasOwnProperty(d.type))
    //     return artifactTypesColors[d.type];
    //   else return artifactTypesColors["Others"];
    // };

    // const colorLinks = (d) => {
    //   if (traceabilityLinkTypesColors.hasOwnProperty(d.type)) {
    //     return traceabilityLinkTypesColors[d.type];
    //   } else return traceabilityLinkTypesColors["Others"];
    // };

    var edgeHash = {};
    var edgeType = {};
    edges.forEach((edge) => {
      var id = edge.source + "-" + edge.target;
      edgeHash[id] = edge;
      edgeType[id] = edge.type;
    });

    var matrix = [];
    nodes.forEach((source, a) => {
      nodes.forEach((target, b) => {
        var grid = {
          id: source.id + "-" + target.id,
          x: b,
          y: a,
          weight: 0,
          type: "",
        };
        if (edgeHash[grid.id]) {
          grid.weight = edgeHash[grid.id].weight;
        }
        if (edgeType[grid.id] !== undefined) {
          grid = { ...grid, type: edgeType[grid.id] };
        }
        matrix.push(grid);
      });
    });

    const svg = d3
      .select("#matrixSVG")
      .attr("viewBox", [-width / 3, -height / 3, width, height])
      .attr("width", width)
      .attr("height", height)
      .call(
        d3.zoom().on("zoom", function (event) {
          svg.attr("transform", event.transform);
        })
      )
      .append("g");

    svg
      .append("g")
      .attr("transform", "translate(50,50)")
      .attr("cursor", "default")
      .attr("id", "adjacencyG")
      .selectAll("rect")
      .data(matrix)
      .enter()
      .append("rect")
      .attr("id", "grid")
      .style("stroke", "#1A237E")
      .style("stroke-width", "1px")
      .style("fill", colorLinks)
      .attr("width", 35)
      .attr("height", 35)

      .attr("x", (d) => d.x * 35)
      .attr("y", (d) => d.y * 35)
      .style("fill-opacity", (d) => d.weight * 0.2);

    svg
      .append("g")
      .attr("transform", " translate(50,45)")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("id", "horizontalText")
      .style("fill", colorNodes)
      .attr("y", (d, i) => i * -35 + 17.5)
      .text((d) => d.id)
      .attr("transform", "rotate(90), translate(0, -30)")
      .style("text-anchor", "end")
      .style("font-size", "0.8rem");

    svg
      .append("g")
      .attr("transform", "translate(45,50)")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .style("fill", colorNodes)
      .attr("y", (d, i) => i * 35 + 17.5)
      .text((d) => d.id)
      .style("text-anchor", "end")
      .style("font-size", "0.8rem");

    var horizontalText = d3.selectAll("#horizontalText");

    svg.selectAll("#grid").on("mouseover", gridOver);
    svg
      .selectAll("#grid")
      .on("mouseout", () => d3.selectAll("rect").style("stroke-width", "1px"));
    function gridOver(d, g) {
      svg.selectAll("rect").style("stroke-width", (p) => {
        return p.x === g.x || p.y === g.y ? "3px" : "1px";
      });
    }
  }
  const displayColors = () => {
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
  };
  return (
    <Paper square className={classes.paper}>
      {/* {displayColors()} */}
      {<ColoringTypes />}
      <Filtering data={data} onChange={handleFilterChange} type={"matrix"} />
      <strong>Guide:</strong>scroll to zoom
      <div id="vizcontainer">
        <svg
          id={"matrixSVG"}
          width="1000"
          height="500"
          style={{ cursor: "move" }}
        />
      </div>
    </Paper>
  );
}

export default TraceabilityLinkMatrix;
