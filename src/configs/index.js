import * as AppDefines from './AppDefined.js'
import * as AppDimensions from './AppDimensions.js'
import * as urlDefined from './urlDefined.js'
import * as Colors from './Colors.js'

const commonsConfigs = {
    ...AppDefines,
    ...AppDimensions,
    ...urlDefined
}
export {
    commonsConfigs,
    urlDefined,
    AppDefines,
    AppDimensions,
    Colors
}