import { StyleSheet } from 'react-native';
import { AppDimensions, Colors } from '../../../configs';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0e2',
    paddingTop: 16,
    paddingHorizontal: 8
  },
  viewTop: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    borderColor: Colors.black,
    borderWidth: 1,
    marginTop: 10,
    backgroundColor: Colors.grey,
  },
  viewLeftTop: {
    height: AppDimensions.heightButton,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  txtTop: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.white,
  },
  txtTime: {
    fontSize: 12,
    textAlign: 'left',
    color: '#727272'
  },
  txtName: {
    fontSize: 14,
    textAlign: 'center',
  },
  viewCenterTop: {
    paddingHorizontal: 3,
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
  viewChanDoan: {
    width: '94%',
    alignSelf: 'center',
  },
  txtChanDoan: {
    marginTop: 15,
    marginBottom: 5,
  },
  viewItemChanDoan: {
    paddingTop: 5,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  itemChandoan: {
    height: AppDimensions.height30,
    backgroundColor: Colors.white,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  txtItemChanDoan: {
    maxWidth: '100%',
  },
  viewTrieuChung: {
    alignSelf: 'center',
    marginTop: 15,
  },
  viewBottom: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    borderColor: Colors.black,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  txtTrieuChung: {
    fontSize: 14,
  },
  boxSelect: {
    padding: 10,
    borderWidth: 2,
    borderColor: 'blue',
    borderRadius: 5,
    backgroundColor: '#269cc4',
    width: 150
  },
  whiteTxt: {
    color: 'white',
    fontSize: 16
  },
  labelText: {
    color: '#e53b32',
    fontSize: 18,
    // paddingLeft: 10
  },
  searchInput: {
    borderColor: '#269cc4',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    // height: 40,
    paddingTop: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomModal: {
    margin: 0,
    alignItems:'center'
  },
});
export default styles;
