import LandingPage from "./pages/LandingPage";
import LogingPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import SystemFeaturesPage from "./pages/SystemFeatures";
import ModifyAccountInfo from "./pages/ModifyAccountInfo";
import { BrowserRouter, Redirect } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { Route, Switch } from "react-router-dom";
import AppBar from "./components/AppBar/AppBar";
import Logout from "./pages/Logout";
import UserMainPage from "./pages/UserMainPage";
import ModifyProject from "./pages/ModifyProject";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";
import AddUser from "./pages/AddUser";
import Roles from "./pages/Roles";
import CreateRole from "./pages/CreateRole";
import ModifyRole from "./pages/ModifyRole";
import ChangeUserRole from "./pages/ChangeUserRole";
import ChangeManagement from "./pages/ChangeManagement";
import CreateArtifact from "./pages/CreateArtifact";
import ModifyArtifact from "./pages/ModifyArtifact";
import ArtifactTypes from "./pages/ArtifactTypes";
import TraceabilityLinkTypes from "./pages/TraceabilityLinkTypes";
import ModifyArtifactType from "./pages/ModifyArtifactType";
import CreateArtifactType from "./pages/CreateArtifactType";
import CreateTraceabilityType from "./pages/CreateTraceabilityType";
import ModifyTraceabilityType from "./pages/ModifyTraceabilityType";
import CreateTraceabilityLink from "./pages/CreateTraceabilityLink";
import ModifyTraceabilityLink from "./pages/ModifyTraceabilityLink";
import My404 from "./pages/My404";
import { connect } from "react-redux";
import ImportRequirements from "./pages/ImportRequirements";
import MakeArtifactChangeRequest from "./pages/MakeArtifactChangeRequest";
import MakeTraceabilityChangeRequest from "./pages/MakeTraceabilityChangeRequest";
import ChangeRequests from "./pages/ChangeRequests";
import ChangeRequestsHistory from "./pages/ChangeRequestsHistory";
import ImpactAnalysis from "./pages/ImpactAnalysis";
import ElaborationCoverageAnalysis from "./pages/ElaborationCoverageAnalysis";
import TestCoverageAnalysis from "./pages/TestCoverageAnalysis";
import Visualization from "./pages/Visualization";
import Notifications from "./pages/Notifications";
import { useEffect } from "react";
import * as authActions from "./store/actions/auth";
import SocketIOHandler from "./components/SocketIO/SocketIOHandler";
import SystemAlertV2 from "./components/Alert/SystemAlertV2";

const theme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: "#1a237e",
    },
    secondary: {
      main: "#bf360c",
      light: "rgba(197,197,197,0.75)",
    },
    text: {
      primary: "#000000",
    },
  },
});

const authRoutes = [
  "/main-page",
  "/create-project",
  "/modify-project",
  "/project-details",
  "/add-user",
  "/roles",
  "/create-role",
  "/modify-role",
  "/change-user-role",
  "/change-management",
  "/create-artifact",
  "/modify-artifact",
  "/artifact-types",
  "/create-artifact-type",
  "/modify-artifact-type",
  "/create-traceability-link",
  "/modify-traceability-link",
  "/traceability-link-types",
  "/create-traceability-link-type",
  "/modify-traceability-link-type",
  "/change-requests",
  "/change-requests-history",
  "/visualization",
  "/notifications",
];

function App(props) {
  useEffect(() => {
    if (props.token != null) props.onCheckToken(props.token);
    // SocketIOInit();
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AppBar />
        <SystemAlertV2 />
        <SocketIOHandler />
        <Switch>
          {/* Feature group 2 */}
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/login" component={LogingPage} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/register" component={RegisterPage} />
          <Route exact path="/features" component={SystemFeaturesPage} />
          <Route
            exact
            path="/modify-account-info"
            component={ModifyAccountInfo}
          />

          {props.username ? null : (
            // handle unauthorized access
            <Redirect from={authRoutes} to="/Login" />
          )}

          {/* Feature group 2 */}
          <Route exact path="/main-page" component={UserMainPage} />
          <Route exact path="/create-project" component={CreateProject} />
          <Route exact path="/modify-project" component={ModifyProject} />
          <Route exact path="/project-details" component={ProjectDetails} />
          <Route exact path="/add-user" component={AddUser} />
          {/* Feature group 3 */}
          <Route exact path="/roles" component={Roles} />
          <Route exact path="/create-role" component={CreateRole} />
          <Route exact path="/modify-role" component={ModifyRole} />
          <Route exact path="/change-user-role" component={ChangeUserRole} />
          <Route exact path="/change-management" component={ChangeManagement} />
          {/* Feature group 4 */}
          <Route exact path="/create-artifact" component={CreateArtifact} />
          <Route exact path="/modify-artifact" component={ModifyArtifact} />
          <Route exact path="/artifact-types" component={ArtifactTypes} />
          <Route
            exact
            path="/create-artifact-type"
            component={CreateArtifactType}
          />
          <Route
            exact
            path="/modify-artifact-type"
            component={ModifyArtifactType}
          />
          {/* Feature group 5 */}
          <Route
            exact
            path="/create-traceability-link"
            component={CreateTraceabilityLink}
          />
          <Route
            exact
            path="/modify-traceability-link"
            component={ModifyTraceabilityLink}
          />
          <Route
            exact
            path="/traceability-link-types"
            component={TraceabilityLinkTypes}
          />
          <Route
            exact
            path="/create-traceability-link-type"
            component={CreateTraceabilityType}
          />
          <Route
            exact
            path="/modify-traceability-link-type"
            component={ModifyTraceabilityType}
          />
          {/* Feature group 6 */}
          <Route
            exact
            path="/import-requirement"
            component={ImportRequirements}
          />
          <Route exact path="/export-traceability-information" component={""} />
          <Route
            exact
            path="/make-artifact-change-request"
            component={MakeArtifactChangeRequest}
          />
          <Route
            exact
            path="/make-traceability-change-request"
            component={MakeTraceabilityChangeRequest}
          />
          <Route
            exact
            path="/change-requests-history"
            component={ChangeRequestsHistory}
          />
          <Route exact path="/change-requests" component={ChangeRequests} />

          {/* Feature group 8 */}
          <Route exact path="/impact-analysis" component={ImpactAnalysis} />
          <Route
            exact
            path="/elaboration-coverage-analysis"
            component={ElaborationCoverageAnalysis}
          />
          <Route
            exact
            path="/test-coverage-analysis"
            component={TestCoverageAnalysis}
          />
          <Route exact path="/notifications" component={Notifications} />
          <Route exact path="/visualization" component={Visualization} />
          {/* handle 404 error */}
          <Route path="/404" component={My404} />
          <Redirect from={"*"} to="/404" />
        </Switch>
      </ThemeProvider>
    </BrowserRouter>
  );
}
const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCheckToken: (token) => dispatch(authActions.checkAuthTimeout(token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
