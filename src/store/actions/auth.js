import * as actionTypes from './actionsTypes';
import jwt_decode from "jwt-decode";

import axios from 'axios';
export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authInit = () => {
    return {
        type: actionTypes.AUTH_INIT
    }
}

export const authSuccess = (username, email, success, token = null) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        username: username,
        email: email,
        success: success,
        token: token
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const authLogout = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const authInitite = () => {
    return dispatch => {
        dispatch(authInit());
    }
}

export const updateEmail = (email) => {
    return {
        type: actionTypes.UPDATE_EMAIL,
        email: email
    }
}

export const authSignIn = (username, password) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            username: username,
            password: password
        }

        let url = '/login';

        axios.post(url,authData)
        .then(response=>{
            dispatch(authSuccess(response.data.username, response.data.email, response.data.success, response.data.jwt));
            var token = response.data.jwt;
            var decoded = jwt_decode(token);
            var seconds = new Date().getTime() / 1000;
            var deff = (decoded.exp - seconds) * 1000; //in miliseconds
            console.log(deff);
            dispatch(setAuthTimeout(deff));
        })
        .catch(error=> {
            
            
            dispatch(authFail(error));
        })
    }
}

export const authSignUp = (username, password,email) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            username: username,
            password: password,
            email: email
        }

        let url = '/register';

        axios.post(url,authData)
        .then(response=>{
            dispatch(authSuccess(response.data.username,email,response.data.success));
        })
        .catch(error=> {
            dispatch(authFail(error));
        })
    }
}

// export const authCheckState = () => {
//     return dispatch => {
//         const token = localStorage.getItem('token');
//         if(!token){
//             dispatch(authLogout());
//         }else{
//             const success = localStorage.getItem('success');
//             const username = localStorage.getItem('username');
//             dispatch(authSuccess(username,success,token));
//         }
//     }
// } 

export const checkAuthTimeout = (token) => {
    const { exp } = jwt_decode(token)
    const expirationTime = (exp * 1000) - 60000
    console.log(Date.now() >= expirationTime);
    return dispatch => {
        if (Date.now() >= expirationTime) {
            dispatch(authLogout());
      }
    };
};

export const setAuthTimeout = (expirationTime) => {
    console.log(expirationTime);
    return dispatch => {
        setTimeout(() => {
            dispatch(authLogout());
        }, expirationTime );
    };
};