
import React, { useEffect, useRef } from 'react';
import { View, FlatList, Text, Alert, TouchableOpacity, Image } from 'react-native';
import * as configs from "../configs"

export default function Label({ title, styles }) {
  return (
    <Text
      style={[{
        fontSize: 16,
        lineHeight: 19,
        fontWeight: 'bold',
        marginBottom: 10
      }, styles]}
    >
      {title}
    </Text>
  );
}