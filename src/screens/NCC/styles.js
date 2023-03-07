import { StyleSheet } from 'react-native';
import { AppDimensions, Colors } from '../../configs';

const styles = StyleSheet.create({
  container: { flex: 1 },
  viewContent: {
    width: '100%',
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  viewTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: AppDimensions.SCREEN_WIDTH * 0.05,
  },
  btnLogout: {
    height: AppDimensions.heightButton,
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  txtBtnLogout: {
    fontSize: AppDimensions.fontSize14,
    color: Colors.white,
    fontWeight: 'bold',
  },
  btnReturnCustomer: {
    height: AppDimensions.heightButton,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  txtBtnReturnCustomer: {
    fontSize: AppDimensions.fontSize14,
    color: Colors.white,
    fontWeight: 'bold',
  },
  viewBottom: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: AppDimensions.SCREEN_WIDTH * 0.05,
  },
  viewCenter: {
    flex: 1,
    alignItems: 'center',
  },
  btnSS: {
    height: 60,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  txtBtnSS: {
    fontSize: AppDimensions.fontSize18,
    color: Colors.white,
    fontWeight: 'bold',
  },
  txtCustomer: {
    color: '#ffffff', fontSize: 18, lineHeight: 21, marginTop: 30
  },
  buttonIcon: {
    borderRadius: 10,
    padding: 8,
    backgroundColor: Colors.success,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
    top: 35,
    right: 16,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.35,
    shadowRadius: 1.8,
  }
});

export default styles;
