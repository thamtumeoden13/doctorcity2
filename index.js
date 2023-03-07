/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native'
import App from './src/routers/App'
import { name as appName } from './app.json'


// LogBox.ignoreLogs([
//     'ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from \'deprecated-react-native-prop-types\'.',
//     'NativeBase: The contrast ratio of',
//     "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
// ])
AppRegistry.registerComponent(appName, () => App)
