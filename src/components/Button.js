import React, { useEffect, useRef } from 'react';
import { View, FlatList, Text, Alert, TouchableOpacity, Image } from 'react-native';
import * as configs from '../configs';
const PersonSchema = {
  name: 'Person',
  properties: {
    firstName: 'string',
    lastName: 'string',
  }
};
// const realm = new Realm({ schema: [PersonSchema, AppConfigEntity] });

export default function Button({ title = 'Title', styles, onPress, disabled = false, titleStyles }) {
  return (
    <TouchableOpacity
      style={[{
        backgroundColor: configs.Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 23,
        width: '100%'
      }, styles]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[{
        fontSize: 16, color: '#fff', fontWeight: 'bold', textTransform: 'uppercase',
        paddingVertical: 8, textAlign: 'center',
      }, titleStyles]}>{title}</Text>
    </TouchableOpacity>
  );
}