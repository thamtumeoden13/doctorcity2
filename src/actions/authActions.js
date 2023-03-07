import { SET_USER_INFO, LOGIN, LOGIN_FAIL, LOGIN_SUCCESS,LOGOUT, REGISTER, REGISTER_FAIL, REGISTER_SUCCESS } from "./actions-type"

export const login = (data) => {    
    return ({ type: LOGIN, data })
};
export const loginSuccess = (data) => {    
    return ({ type: LOGIN_SUCCESS, data })
};
export const loginFail = (error) => {
    return ({ type: LOGIN_FAIL, error })
};

export const setUserInfo = (data) => {    
    return ({ type: SET_USER_INFO, data })
};

export const register = (data) => {    
    return ({ type: REGISTER, data })
};
export const registerSuccess = (data) => {    
    return ({ type: REGISTER_SUCCESS, data })
};
export const registerFail = (error) => {
    return ({ type: REGISTER_FAIL, error })
};

export const logout = (params) => {    
    return ({ type: LOGOUT, params })
};


