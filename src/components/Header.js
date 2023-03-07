import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../configs';
import Icon from 'react-native-vector-icons/FontAwesome';
import navigationServices from '../routers/navigator/navigationServices';
export default function Header(props) {
  const { title, colorTitle = Colors.black, onBackPress } = props;
  return (
    <View style={styles.containerView}>
      <Icon
        name={'angle-left'}
        iconStyle={styles.icon}
        size={30}
        onPress={onBackPress ? onBackPress : navigationServices.pop}
      />
      <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.title, { color: colorTitle }]}>{title}</Text>
      <View style={{ width: 30 }} />
    </View>
  );
}


const styles = StyleSheet.create({
  containerView: {
    flexDirection: 'row',
    maxHeight: 45,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    color: Colors.black,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  icon: {
    tintColor: Colors.black,
    marginRight: 16,
  },
});
