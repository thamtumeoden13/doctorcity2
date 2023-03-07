import { StyleSheet } from 'react-native';
import { AppDimensions, Colors } from '../../../configs';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0e2',
    paddingTop: 16,
    paddingHorizontal: 8
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  viewLeft: {
    justifyContent: 'center',
  },
  img: {
    width: 100,
    height: 100,
  },
  viewRight: {
    alignSelf: 'center'
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
    alignSelf: 'center',
    // justifyContent: 'center',
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
    // alignSelf: 'center',
    marginTop: 10,
  },
  viewTxtTsb: {
    height: 100,
    backgroundColor: Colors.white,
    marginVertical: 10,
    borderRadius: 5,
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 23,
    backgroundColor: "#F4F5F6",
    marginTop: 14,
    paddingHorizontal: 16
  },
  input1Row: { flex: 1, textAlign: 'right', paddingVertical: 16 }
});

export default styles;
