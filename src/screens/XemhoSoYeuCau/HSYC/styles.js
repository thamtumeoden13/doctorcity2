import {StyleSheet} from 'react-native';
import {AppDimensions, Colors} from '../../../configs';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    padding: 10,
  },
  viewLeft: {
    justifyContent: 'center',
  },
  img: {
    width: 0.3 * AppDimensions.SCREEN_WIDTH,
    height: 0.3 * AppDimensions.SCREEN_WIDTH,
  },
  viewRight: {
    flex: 1,
  },
  tip: {
    height: AppDimensions.heightButton,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
    flex: 1,
  },
  viewContentRight: {
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  viewBottomRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtTip: {
    fontSize: 14,
  },
  desTip: {
    fontSize: 14,
    marginRight: 10,
  },
  viewTsb: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  viewTxtTsb: {
    height: 100,
    backgroundColor: Colors.white,
    marginVertical: 10,
    borderRadius: 5,
    padding: 5,
  },
});

export default styles;
