import { StyleSheet } from 'react-native';
import { AppDimensions, Colors } from '../../../configs';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0e2',
    paddingTop: 16,
    paddingHorizontal: 8
  },
  viewTable: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  viewColumn: {
    width: '47%',
  },
  viewRow: (type, hoanThanh) => ({
    height: AppDimensions.heightButton,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.black,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: type == 'left' ? 1 : 0,
    backgroundColor: hoanThanh == '1' ? '#EFEFEF' : Colors.white,
  }),
  txtRow: {
    fontSize: 15,
  },
});
export default styles;
