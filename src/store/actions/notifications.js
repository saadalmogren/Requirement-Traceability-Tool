import * as actionTypes from './actionsTypes';
import axios from 'axios';


export const fetchNotificationsStart = () => {
    return {
        type: actionTypes.FETCH_NOTIFICATIONS_START
    }
}

export const fetchNotificationsSuccess = (notifications,numOfNotifications) => {
    return {
        type: actionTypes.FETCH_NOTIFICATIONS_SUCCESS,
        notifications: notifications,
        numOfNotifications: numOfNotifications
    }
}

export const fetchNotificationsFail = (error) => {
    return{
        type: actionTypes.FETCH_NOTIFICATIONS_FAIL,
        error: error
    }
}


export const fetchNotifications = (projectID,token) => {

    return dispatch => {
        dispatch(fetchNotificationsStart());
        
        axios.get(`/project/notifications?pID=${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            console.log(res.data);
            let notifications = [];
            notifications=[...res.data.notifications];
            let numOfNotifications=res.data.num_of_notifications;
            dispatch(fetchNotificationsSuccess(notifications,numOfNotifications));
            
        })
        .catch(err=>{
            dispatch(fetchNotificationsFail(err));
        });
    }
}

export const deleteNotification = (notifyId, projectID, token) => {
    
    return dispatch => {
        dispatch(fetchNotificationsStart());
        
        axios.delete(`/notifications?notify_id=${notifyId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            console.log(res.data);
            dispatch(fetchNotifications(projectID,token));
            
        })
        .catch(err=>{
            dispatch(fetchNotificationsFail(err));
        });
    }
}