import { StyleSheet } from 'react-native';
import { AppDimensions, Colors } from '../../configs';

const styles = StyleSheet.create({
  viewHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderColor: '#C2C2C2',
    padding: 8,
  },
  btnTop: {
    paddingHorizontal: 15,
    height: AppDimensions.heightButton,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtBtnTop: {
    fontSize: 15,
  },
  itemHeader: {
    width: '100%',
    height: AppDimensions.heightButton,
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderBottomColor: Colors.grey,
    borderBottomWidth: 1,
    justifyContent: 'center',
    paddingLeft: 0.05 * AppDimensions.SCREEN_WIDTH,
  },
  txtHeader: {
    fontSize: 15,
  },
  viewHSYC: {
    width: AppDimensions.SCREEN_WIDTH,
    height: AppDimensions.SCREEN_WIDTH,
    backgroundColor: 'red',
  },

  box: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 23,
    paddingHorizontal: 16,
  },
  circle: {
    backgroundColor: 'rgba(241, 191, 10, 0.85)',
    width: 30,
    height: 30,
    borderRadius: 20,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'green',
  },
  phienKhamSection: {
    backgroundColor: '#EC712B',
    padding: 13,
    marginBottom: 1
  },
  txtWhite: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  confirmSection: {
    padding: 13,
    backgroundColor: '#22B921',
    alignItems: 'center'
  },
  content: {
    margin: 8,
    borderRadius: 5,
  },
  column: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 23,
    backgroundColor: "#F4F5F6",
    marginTop: 14,
    paddingHorizontal: 16
  },
});

export default styles;
