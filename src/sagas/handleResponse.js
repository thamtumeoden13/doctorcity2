import React, { } from "react";
import { useDispatch } from "react-redux";
import { commonsConfigs as configs } from "../configs"
import { Alert, } from "react-native"
import * as action from "../actions"
import { put, takeEvery, takeLatest } from "redux-saga/effects"
import { models } from "../models";

async function showAlert(titleAlert, contentAlert) {
    setTimeout(() => {
        Alert.alert(titleAlert, contentAlert, [{ text: 'Đồng ý' }]);
    }, 700);

}

export function showAlertError(contentAlert) {

    showAlert(configs.NAME_APP + " - Lỗi", contentAlert)
}

export function* handeResponseError(error) {
    console.log(error, "loi nay");
    let messageError = ""
    if (error.response) {
        let status = error.response.status
        if (status === configs.NOT_FOUND) {
            messageError = "Không tìm thấy đường dẫn.\n" + JSON.stringify(error.message)
        } else if (status === configs.INTERNAL_SERVER) {
            messageError = error.response.data.error ? error.response.data.error : ""
        } else if (status === configs.BAD_REQUEST) {
            console.log("vo 3", error.response.data)
            messageError = error.response.data.error ? error.response.data.error : ""
        } else if (status === configs.UNAUTHORIZED) {
            if (models.getToken()) {
                models.handleLogOut();
                yield put(action.logout())
                messageError = "Phiên đăng nhập đã hết hạn. Vui lòng khởi động lại ứng dụng và đăng nhập lại"
            }
        } else {
            messageError = error.response.data && error.response.data
        }
    } else if (error.request) {
        messageError = "Lỗi kết nối với máy chủ."
    } else {
        messageError = JSON.stringify(error.message)
    }
    if (messageError) {
        showAlertError(messageError)
    }
}

export async function isSuccess(statusResponse) {
    return configs.CODE_SUCCESS.indexOf(statusResponse) > -1
}

const saveDataToStorage = (name, data) => {
    AsyncStorage.setItem(name, JSON.stringify({ data }));
};
