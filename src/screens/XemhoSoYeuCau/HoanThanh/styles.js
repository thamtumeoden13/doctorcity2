import {StyleSheet} from 'react-native';
import {AppDimensions, Colors} from '../../../configs';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewTop: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '98%',
    alignItems: 'center',
    borderColor: Colors.black,
    borderWidth: 1,
    marginTop: 0.01 * AppDimensions.SCREEN_WIDTH,
  },
  viewLeftTop: {
    height: AppDimensions.heightButton,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtTop: {
    fontSize: 14,
  },
  viewCenterTop: {
    height: AppDimensions.heightButton,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderColor: Colors.black,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  viewRightTop: {
    height: AppDimensions.heightButton,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewBottom: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '98%',
    alignItems: 'center',
    borderColor: Colors.black,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
});
export default styles;
