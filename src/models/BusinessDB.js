import { commonsConfigs as configs } from '../configs'
import * as dbHelper from "./DBHelper"
import * as entity from "./entity"
// FCM_TOKEN
export function setUserInfo(user) {    
    let schema = entity.UserInfoEntity.name
    let userInfo = user    
    dbHelper.insertOrUpdate(schema, userInfo, true)
}


export function getUserInfo() {
    let schema = entity.UserInfoEntity.name;    
    return dbHelper.getObject(schema)
}
export function setFCMToken(fcmToken) {
    let schema = entity.AppConfigEntity.name
    let fcmTokenInfo = {
        id: configs.AppConfigTable.FCM_TOKEN.id,
        name: configs.AppConfigTable.FCM_TOKEN.name,
        value: fcmToken,
    }
    dbHelper.insertOrUpdate(schema, fcmTokenInfo, true)
}


export function getFCMToken() {
    let schema = entity.AppConfigEntity.name;
    let primaryKey = entity.AppConfigEntity.primaryKey;
    let valueKey = configs.AppConfigTable.FCM_TOKEN.id;
    return dbHelper.getObjectByPrimaryKey(schema, primaryKey, valueKey)
}

export function setToken(token) {
    let schema = entity.AppConfigEntity.name
    let data = {
        id: configs.AppConfigTable.TOKEN.id,
        name: configs.AppConfigTable.TOKEN.name,
        value: token,
    }
    dbHelper.insertOrUpdate(schema, data, true)
}


export function getToken() {
    let schema = entity.AppConfigEntity.name;
    let primaryKey = entity.AppConfigEntity.primaryKey;
    let valueKey = configs.AppConfigTable.TOKEN.id;
    return dbHelper.getObjectByPrimaryKey(schema, primaryKey, valueKey)
}

export function handleLogOut() {
    let schema = entity.AppConfigEntity.name
    return dbHelper.deleteAll(schema)
}

