import * as schema from './Schema'

const UserInfoEntity = {
    name: schema.USER_INFO_TABLE,
    primaryKey: 'id',
    properties: {
        id: "string",
        avatar: "string?",
        birthYear: "string?",
        diaChi: "string?",
        displayName: "string?",
        email: "string?",
        isSupplier: "bool?",
        phoneNumber: "string?",
        sex: "string?",
        tienSuBenh: "string?"
    }
}

export default UserInfoEntity