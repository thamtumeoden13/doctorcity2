import Realm from 'realm'
import { commonsConfigs as configs } from "../configs"
import * as ultils from "../common/ultils"
import { AppConfigEntity, UserInfoEntity } from "./entity"

const realm = new Realm({
    schema: [
        AppConfigEntity,
        UserInfoEntity
    ]
});

export const test = (schema) => {
    let result = null
    realm.write(() => {
        result = realm.objects('APP_CONFIG');
    });
    return result
}
export const testSET = (schema, data, update = false) => {
    let result = null
    realm.write(() => {
        result = realm.create(schema, data, update)
    });
    return result
}


export const insertOrUpdate = (schema, data, update = false) => {
    try {
        let result = null
        if (data instanceof Array) {
            realm.write(() => {
                for (let i = 0; i < data.length; i++) {
                    let item = null
                    item = realm.create(schema, data[i], update)
                    result.push(item)
                }
            })
        } else {
            realm.write(() => { result = realm.create(schema, data, update); });
        }
        return result
    } catch (err) { console.log("ERROR: ", err); return err }
}

export const getAll = (schema) => {
    let result = null
    realm.write(() => { result = realm.objects(schema); });
    return result
}

export const getSize = (schema) => {
    let result = this.getAll(schema)
    return result ? result.length : 0
}

export const maxPrimaryKey = (schema, primaryKey) => {
    let maxPrimaryKey = realm.objects(schema).max(primaryKey);
    if (maxPrimaryKey) {
        return maxPrimaryKey + 1;
    }
    return 1
}

export const getObjectByPrimaryKey = (schema, primaryKey, valueKey) => {

    let object = ultils.convertToArray(realm.objects(schema).filtered(primaryKey + ' =  $0', valueKey))
    if (object && object[0]) {
        return object[0].value
    }
    return null
}

export const getObject = (schema) => {

    let object = ultils.convertToArray(realm.objects(schema))    
    if (object && object[0]) {
        return object[0]
    }
    return null
}

export const deleteAll = (schema) => {
    realm.write(() => {
        realm.delete(realm.objects(schema))
    })
}

export const deleteObject = (object) => {
    realm.write(() => {
        realm.delete(object)
    })
}

export const relativeSearchByAttribute = (schema, key, value) => {
    try {
        return realm.objects(schema).filtered(key + ' LIKE "*' + value + '*' + '"')
    } catch (error) {
        return []
    }
}

export const absoluteSearchByAttribute = (schema, key, values) => {
    return realm.objects(schema).filtered(key + ' = $0', values);
}


function deleteRow(object) {
    realm.write(() => {
        realm.delete(object)
    })
}
export function deleteLogin(isShowMessage = true) {
    let loginInfo = getAll()
    if (loginInfo) {
        deleteRow(loginInfo)
        return true
    } else {
        if (isShowMessage) {
            alert('Thông tin đăng nhập đã trống trước đó.')
        }
    }
    return false
}
