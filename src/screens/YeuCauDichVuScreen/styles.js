import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  },
  viewHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderColor: '#C2C2C2',
    padding: 8,
  },
  input: {
    backgroundColor: 'white',
    height: 40,
    paddingLeft: 3,
  },
  button: {
    width: 180,
    height: 60,
    // backgroundColor: configs.Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  modalBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: 'bold',
    marginBottom: 10
  },
  textInput: {
    backgroundColor: '#F4F5F6',
    borderRadius: 23,
    padding: 10,
  },
  whiteBox: {
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    paddingVertical: 24,
    borderRadius: 10
  },
  modalFull: {
    marginTop: 150,
    marginBottom: 150,
    backgroundColor: '#ffffff',
    borderRadius: 23,
  }
});

export default styles;