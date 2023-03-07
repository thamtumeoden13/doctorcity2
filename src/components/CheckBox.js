import React, {useEffect, useRef} from 'react';
import {
  View,
  FlatList,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackActions} from '@react-navigation/native';
import Realm from 'realm';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../configs';

export default function CheckBox({container, size, value, onChange, disable}) {
  return (
    <TouchableOpacity
      disabled={disable}
      style={[
        styles.containerDefault,
        container,
        value && {borderColor: Colors.primary},
      ]}
      onPress={() => onChange()}>
      {value && (
        <MaterialIcons name="check" size={size || 15} color={Colors.primary} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  containerDefault: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
