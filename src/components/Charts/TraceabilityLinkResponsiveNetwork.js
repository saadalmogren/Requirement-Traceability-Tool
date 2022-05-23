import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { connect } from "react-redux";
import {
  FormControlLabel,
  FormGroup,
  makeStyles,
  Paper,
  Switch,
} from "@material-ui/core";
import Filtering from "./Filtering";
import ColoringTypes from "./ColoringTypes";
import { colorNodes, colorLinks } from "./ColoringTypes";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
}));

function TraceabilityLinkResponsiveNetwork(props) {
  const classes = useStyles();

  const [showText, setShowText] = useState(true);
  const [showDependency, setShowDependency] = useState(true);

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

  const handleChange = (e) => {
    setShowText(!showText);
  };

  const handleFilterChange = (filteredData) => {
    const data = filteredData;
    chart(data);
  };
  var chart = (data) => {};
  useEffect(() => {
    if (!props.nodes || props.nodes.length === 0) return;

    chart(data);
  }, [
    showText,
    props.nodes,
    data.nodes,
    // data.nodes,
  ]);

  const nodes = data.nodes.map((n) => n.id);
  data.links = data.links.filter((link) => {
    if (
      nodes.includes(link.source) &&
      nodes.includes(link.target)
      // if you don't want a circle relation

      // &&
      // link.target !== nodes[nodes.length]
    ) {
      return true;
    }
  });

  // handle no artifacts/traceability links
  if (!props.nodes || props.nodes.length === 0)
    return (
      <strong>
        There are no artifacts in the project to represent a graph
      </strong>
    );
  // if (!data.links || data.links.length === 0)
  //   return (
  //     <strong>
  //       There are no traceability links in the project to represent a graph
  //     </strong>
  //   );

  const toolTip = {
    position: "absolute",
    textAlign: "center",
    width: "60px",
    height: "28px",
    padding: "2px",
    border: "0px",
    borderRadius: "8",
    "background-color": "blue",
  };

  const height = (window.innerHeight * 2) / 4;
  const width = (window.innerWidth * 2) / 3;
  chart = (data) => {
    // Clear graph
    d3.selectAll("#svg > *").remove();
    const links = data.links;
    const nodes = data.nodes;

    // calculate and return the strength of space(force) between the nodes
    const calcStr = () => {
      if (showText) {
        if (data.nodes.length > 200) return -100;
        else if (data.nodes.length > 100) return -150;
        else return -300;
      } else return -100;
    };
    // calculate and return the radius of the circle
    const calcRadius = () => {
      if (data.nodes.length > 200) return 3.5;
      else if (data.nodes.length > 100) return 4;
      else return 5;
    };

    // handle dragging animation, etc..
    const drag = () => {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    };

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d) => d.id)
      )
      //   distance between nodes
      .force("charge", d3.forceManyBody().strength(calcStr()))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    // define graph design (SVG)
    const svg = d3
      .select("#svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .style("font", "0.8rem sans-serif")
      .call(
        d3.zoom().on("zoom", function (event) {
          svg.attr("transform", event.transform);
        })
      )
      .append("g");

    //   Arrow attributes
    svg
      .append("defs")
      .selectAll("marker")
      .data(links)
      .attr("fill", colorLinks)
      .join("marker")
      .attr("id", (d) => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", -0.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5");

    // Link attributes
    const link = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke-width", 1.6)
      .selectAll("path")
      .attr("stroke-width", 1)
      .data(links)
      .join("path")
      .attr("stroke", colorLinks)
      .attr(
        "marker-end",
        (t) => `url(${new URL(`#arrow-${t.target}`, window.location)})`
      );
    // define node tooltip attribute
    var nodeTooltip = d3
      .select("body")
      .append("div")
      .attr("class", { toolTip })
      .data(nodes)
      .style("position", "absolute")
      .style("display", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 1)
      .style("opacity", 0);

    // define node tooltip attribute
    var linkTooltip = d3
      .select("body")
      .append("div")
      .attr("class", { toolTip })
      .data(links)
      .style("position", "absolute")
      .style("display", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 1)
      .style("opacity", 0);

    // show the traceability link names - not working currently
    if (showDependency)
      link
        .append("text")
        .attr("x", 8)
        .attr("y", "0.31em")
        .text((tl) => "test")
        .clone(true)
        .lower()
        .attr("stroke", "white")
        .attr("stroke-width", 1);
    // else if its not shown, then display is on hover (mouseover)
    else {
      link
        .on("mouseover", (d, event) => {
          linkTooltip
            .style("display", "block")
            .style("color", colorLinks(event));
          linkTooltip.transition().duration(200).style("opacity", 1);
          linkTooltip.html(event.id);
        })
        .on("mousemove", (d, event) => {
          linkTooltip
            .style("display", "block")
            .style("position", "absolute")
            .style("left", d.pageX + "px")
            .style("top", d.pageY - 28 + "px");
        })

        .on("mouseout", (d, event) => {
          linkTooltip
            .transition()
            .duration("500")
            .style("opacity", 0)
            .style("display", "none");
        });
    }

    // node attributes
    const node = svg
      .append("g")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("fill", colorNodes)
      .call(drag(simulation));

    node
      .append("circle")
      .attr("stroke", "white")
      .attr("stroke-width", 0.5)
      .attr("r", calcRadius);

    node.on("mousemove", () => node.attr("cursor", "grab"));
    //   show artifacts name label
    if (showText)
      node
        .append("text")
        .attr("x", 8)
        .attr("y", "0.31em")
        .text((d) => d.id)
        .clone(true)
        .lower()
        .attr("stroke", "white")
        .attr("stroke-width", 1);
    // else if its not shown, then display is on hover (mouseover)
    else {
      node
        .on("mouseover", (d, event) => {
          nodeTooltip
            .style("display", "block")
            .style("color", colorNodes(event));
          nodeTooltip.transition().duration(200).style("opacity", 1);
          nodeTooltip.html(event.id);
        })
        .on("mousemove", (d, event) => {
          nodeTooltip
            .style("display", "block")
            .style("position", "absolute")
            .style("left", d.pageX + "px")
            .style("top", d.pageY - 28 + "px");
        })

        .on("mouseout", (d, event) => {
          nodeTooltip
            .transition()
            .duration("500")
            .style("opacity", 0)
            .style("display", "none");
        });
    }
    // Create the links between nodes
    simulation.on("tick", () => {
      link.attr("d", linkArc);
      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    function linkArc(d) {
      const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
      return `
          M${d.source.x},${d.source.y}
          A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
        `;
    }
  };

  const displaySwitches = () => {
    return (
      <FormGroup row>
        <FormControlLabel
          control={
            <Switch
              checked={showText}
              onChange={handleChange}
              name="checkedA"
            />
          }
          label={"Show/Hide artifact names"}
        />
      </FormGroup>
    );
  };

  return (
    <Paper square className={classes.paper}>
      {/* {displayColors()} */}
      {<ColoringTypes />}
      {/* Refactor filtering!!! since its used on multiple graphs (suggested idea> give it nodes and links as props )*/}
      <Filtering data={data} onChange={handleFilterChange} type={"network"} />
      <strong>Guide:</strong>
      <span>
        scroll to zoom
        <br />
        hold on artifact to drag
      </span>
      <svg
        id={"svg"}
        width={width}
        height={height}
        style={{ cursor: "move" }}
      ></svg>
      {displaySwitches()}
    </Paper>
  );
}

const mapStateToProps = (state) => {
  return {
    userPrivileges: state.changeUserRole.userPrivileges.map((p) => p.name),
    token: state.auth.token,
    selectedProject: state.projects.selectedProject,
    // artifacts: state.artifacts.artifacts,
    artifactTypes: state.artifactTypes.artifactTypes,
    // traceabilityLinks: state.traceabilityLinks.traceabilityLinks,
    traceabilityLinkTypes: state.traceabilityLinkTypes.traceabilityLinkTypes,
  };
};

export default connect(mapStateToProps)(TraceabilityLinkResponsiveNetwork);
