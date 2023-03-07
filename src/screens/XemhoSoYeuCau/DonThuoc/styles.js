import { StyleSheet } from 'react-native';
import { Colors } from '../../../configs';

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
    marginTop: 10,
    backgroundColor: Colors.grey,
  },
  viewLeftTop: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  txtTop: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.white,
  },
  txtTime: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'justify'
  },
  txtName: {
    fontSize: 14,
    textAlign: 'center',
  },
  viewCenterTop: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  viewRightTop: {
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
  top15: {
    marginTop: 15,
  },
  viewTrieuChung: {
    width: '94%',
    alignSelf: 'center',
    lineHeight: 1.5,
  },
  viewBottom: {
    flex: 1,
    borderColor: Colors.black,
    backgroundColor: "#32aed8",
    borderColor: Colors.white,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10
  },
  vien: {
    borderRadius: 30,
    width: '200%',
    backgroundColor: '#269cc4',
    width: 80,
    alignItems: 'center',
    padding: 5,
    overlayColor: "#8397af",
    color: 'red',
    alignSelf: 'flex-end',
  },
  txtTrieuChung: {
    fontSize: 14,
  },
  txtTrieuChung2: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  titleText2: {
    fontSize: 14,
    fontWeight: "bold",
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleTextnghieng: {
    fontSize: 14,
    fontWeight: "bold"
  },
});
export default styles;
