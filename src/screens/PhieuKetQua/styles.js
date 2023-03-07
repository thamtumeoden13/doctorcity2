import { StyleSheet } from 'react-native';
import { Colors } from '../../configs';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemRow: {
    flexDirection: 'row',
    paddingHorizontal: (2),
  },
  itemRowColumnFirst: {
    flexDirection: 'column',
  },
  itemRowColumn: {
    paddingLeft: (9),
    paddingVertical: (4),
    justifyContent: 'center',
  },
  itemRowHeader: {
    fontSize: (15),
    paddingVertical: (5),
    color: '#282828',
    fontWeight: 'bold',
  },
  itemRowDetail: {
    fontSize: (13),
    color: '#282828',

  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    marginTop: (40),
  },
});

export default styles;
