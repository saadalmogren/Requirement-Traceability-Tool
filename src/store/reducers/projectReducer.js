import * as actionTypes from '../actions/actionsTypes';

const initalState = {
  projects: [],
  loading: false,
  error: null,
  selectedProject: null
}

const projectsStart = (state, action) => {
  return { ...state, ...{ loading: true, error: null } };
}

const projectsSuccess = (state, action) => {
  console.log(action.projects);
  return { ...state, ...{ loading: false, error: null, projects: [...action.projects] } };
}

const projectsFail = (state, action) => {
  return { ...state, ...{ error: action.error, loading: false } };
}

const selectProject = (state, action) => {
  return { ...state, ...{ selectedProject: action.project } };
}

const projectsReducer = (state = initalState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PROJECTS_START: return projectsStart(state, action);
    case actionTypes.FETCH_PROJECTS_SUCCESS: return projectsSuccess(state, action);
    case actionTypes.FETCH_PROJECTS_FAIL: return projectsFail(state, action);
    case actionTypes.SELECT_PROJECT: return selectProject(state, action);
    default: return state;
  }
}

export default projectsReducer;