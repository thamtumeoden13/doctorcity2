import * as schema from './Schema.js'

const AppConfigEntity = {
    name: schema.APP_CONFIG_TABLE,
    primaryKey: "id",
    properties: {
        id: { type: 'int' },
        name: { type: 'string?' },
        value: { type: 'string?' },
        type: { type: 'int?' },
    }
}

export default AppConfigEntity