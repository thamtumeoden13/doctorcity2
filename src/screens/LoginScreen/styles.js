import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 15
  },
  logo: {
    borderRadius: 100,
    width: 100,
    height: 100,
    marginBottom: 14
  },
  title: {
    fontSize: 18,
    lineHeight: 21,
    fontWeight: 'bold',
    marginBottom: 14
  },
  loginText: {
    fontSize: 14,
    lineHeight: 16,
    color: "#9B9B9B",
    marginBottom: 13
  },
  phoneInput: {
    backgroundColor: '#F4F5F6',
    borderRadius: 23,
    flexDirection: 'row'
  }
});

export default styles;