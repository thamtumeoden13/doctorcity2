import { LOGIN, LOGOUT, REGISTER } from "../actions/actions-type"
import { put, takeEvery, takeLatest } from "redux-saga/effects"
import api from "../api"
import * as action from "../actions"
import { isSuccess, handeResponseError, showAlertError } from "./handleResponse"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { showAlert } from "../common/ultils"
import { models } from "../models"

export function* watchLogin() {
    yield (takeLatest(LOGIN, login))
}

function* login(params) {
    try {
        let result = yield api.login(params.data);
        if (isSuccess(result.status)) {            
            if (result.data.isSuccess) {                
                yield models.setToken(result.data.token);                                
                showAlert(result.data.message)
                yield put(action.loginSuccess(result.data))
            } else {
                showAlert(result.data.message)
            }
        } else {
            showAlertError("An error occurred")
        }
    } catch (error) {
        yield handeResponseError(error)        
        yield put(action.loginFail(error))
    }
}

export function* watchRegister() {    
    yield (takeLatest(REGISTER, register))
}

function* register(params) {
    try {    
        let result = yield api.register(params.data);
        if (isSuccess(result.status)) {
            console.log(result.data)
            if (result.data.isSuccess) {                
                yield put(action.registerSuccess(result.data))
                showAlert(result.data.message)
            } else {                
                showAlert(result.data.message)
            }
        } else {            
            showAlertError("An error occurred")
        }
    } catch (error) {        
        yield handeResponseError(error)
        yield put(action.loginFail(error))
    }
}