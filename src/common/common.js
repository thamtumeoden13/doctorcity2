import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 18,
    backgroundColor: '#fff'
  },
  flexRowEndSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  flexRowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexRowEnd: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  flexCenter: {
    justifyContent: 'center',
  },
  flexAlignCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commonPicker: {
    borderWidth: 1,
    borderColor: '#269cc4',
    backgroundColor: '#269cc4',
    borderRadius: 8,
    padding: 13,
    margin: 0,
    flexDirection: 'row',
    alignItems: 'center',
    width: 64
  },
  commonImagePicker: {
    borderWidth: 1,
    borderColor: 'rgba(19, 19, 19, 0.6)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    width: 82,
    height: 82,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
  },
  commonButtonPicker: {
    borderWidth: 1,
    borderColor: 'rgba(19, 19, 19, 0.6)',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
  },
  iconPicker: {
    paddingRight: 12,
  },
  inputIOS: {
    color: 'white',
    fontSize: 16
  },
  inputText: {
    fontSize: 16,
    color: 'white',
  },
  inputSelectAndroid: {
    borderWidth: 1,
    borderColor: '#269cc4',
    backgroundColor: '#269cc4',
    borderRadius: 8,
    paddingHorizontal: 13,
    margin: 0,
    flexDirection: 'row',
    alignItems: 'center',
    width: 64
  },
  commonInput: {
    backgroundColor: 'white',
    borderWidth: (0.8),
    borderColor: 'transparent',
    borderRadius: (8),
    paddingLeft: (20),
    marginBottom: (18),
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: (13),
    lineHeight: (18),
    position: 'absolute',
    paddingVertical: 0,
    left: (12),
    top: (-10),
    zIndex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: (8),
  },
  input: {
    width: (width - 18),
    padding: (14),
    marginLeft: (-20),
    lineHeight: (18),
    fontSize: (14),
  },
});