import * as actionTypes from '../actions/actionsTypes';

const initalState = {
    success: false,
    error: null,
    loading: false
}

const modifyInit = (state,action) => {
    return {...state,...{loading: false, error: null, success: false}};
}

const modifyStart = (state,action) => {
    return {...state,...{loading: true, error: null, success: false}};
}

const modifySuccess = (state,action) => {
    return {...state,...{error: null, loading: false, success: action.success}};
}

const modifyFail = (state,action) => {
    return {...state,...{error: action.error, loading: false, success: action.success}};
}

const modifyReducer = (state = initalState, action) => {
   switch(action.type){
       case actionTypes.MODIFY_START: return modifyStart(state,action);
       case actionTypes.MODIFY_INIT: return modifyInit(state,action);
       case actionTypes.MODIFY_SUCCESS: return modifySuccess(state,action);
       case actionTypes.MODIFY_FAIL: return modifyFail(state,action);
       default: return state;
   }
}

export default modifyReducer;