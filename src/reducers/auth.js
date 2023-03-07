import { LOGIN, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT, REGISTER_FAIL, REGISTER_SUCCESS, SET_USER_INFO } from "../actions/actions-type"
import { models } from "../models"
const initState = {
    token: null,
    error: false,
    userId: null,
    userInfo: null
}

export default authReducer = (state = initState, action) => {
    //set user if token doesn't expire yet
    const userInformation = async () => {
        // const token = await AsyncStorage.getItem("token");        
        const token = await models.getToken();;

        if (!token) {
            return state;
        }
        return (state.token = token);
    };
    userInformation();
    const { type, data, error } = action
    switch (type) {
        case LOGIN: {
            return Object.assign({}, state, {
                token: null,
            });
        }
        case LOGIN_SUCCESS: {
            return Object.assign({}, state, {
                userId: data ? data : null
            });
        }
        case SET_USER_INFO: {
            return Object.assign({}, state, {
                userInfo: data ? data : null
            });
        }
        case LOGIN_SUCCESS: {
            return Object.assign({}, state, {
                userId: data ? data : null
            });
        }
        case LOGIN_FAIL: {
            return error;
        }
        case REGISTER_SUCCESS: {
            return Object.assign({}, state, {
                userId: data.userId ? data.userId : null
            });
        }
        case REGISTER_FAIL: {
            return error;
        }
        case LOGOUT: {
            return Object.assign({}, state, {
                userInfo: null,
                userId: null
            });
        }
        default: {
            return state
        }
    }
}