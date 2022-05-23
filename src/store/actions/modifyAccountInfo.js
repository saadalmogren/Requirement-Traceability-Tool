import * as actionTypes from './actionsTypes';
import axios from 'axios';
import * as authActions from './auth';
export const modifyStart = () => {
    return {
        type: actionTypes.MODIFY_START
    }
}

export const modifyInit = () => {
    return {
        type: actionTypes.MODIFY_INIT
    }
}

export const modifySuccess = (success) => {
    return {
        type: actionTypes.MODIFY_SUCCESS,
        success: success,
    }
}

export const modifyFail = (error) => {
    return {
        type: actionTypes.MODIFY_FAIL,
        error: error
    }
}


export const modifyInitite = () => {
    return dispatch => {
        dispatch(modifyInit());
    }
}

export const modifyAccountInfo = (username, email = null, password = null, token) => {
    return dispatch => {
        dispatch(modifyStart());
        const newData = {
            email: email,
            password: password,
        }
        let url = `/modify_account_information/${username}`;

        axios.post(url,newData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response=>{
            console.log(response);

            dispatch(modifySuccess(response.data.success));
            dispatch(authActions.updateEmail(response.data.email));
        })
        .catch(error=> {
            dispatch(modifyFail(error));
        })
    }
}