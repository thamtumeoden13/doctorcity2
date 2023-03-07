import { StyleSheet } from 'react-native';
import { AppDimensions, Colors } from '../../configs';

const styles = StyleSheet.create({
  viewTop: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  txtViewTopLeft: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  btnTopRight: {
    height: AppDimensions.heightButton,
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
    elevation: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtTopRight: {
    fontSize: AppDimensions.fontSize14,
  },
  viewCustomer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    flex: 1
  },
  viewInfo: {
    paddingHorizontal: 16,
    // flex: 1,
    width: '100%',
    paddingVertical: 16,
  },
  viewLeftCustomer: {
    // width: 0.45 * AppDimensions.SCREEN_WIDTH,
    justifyContent: 'center',
  },
  img: {
    width: 0.2 * AppDimensions.SCREEN_WIDTH,
    height: 0.2 * AppDimensions.SCREEN_WIDTH,
    borderRadius: 23
  },
  viewRightCustomer: {
    marginLeft: 10
  },
  txtTitleTip: {
    fontSize: 16,
    fontWeight: '500'
  },
  tip: {
    height: AppDimensions.heightInput,
    borderRadius: 10,
    backgroundColor: Colors.white,
    marginVertical: 10,
    elevation: 2,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  viewLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  imgMap: {
    width: '100%',
    height: 150,
  },
  viewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    position: 'absolute', bottom: 0, width: '100%'
  },
  btnBottom: {
    height: AppDimensions.heightButton,
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtBtnBottom: {
    fontSize: AppDimensions.fontSize14,
    color: Colors.white,
  },
  btnWaitBottom: {
    width: '100%',
    borderRadius: 10,
    height: AppDimensions.heightButton,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default styles;
