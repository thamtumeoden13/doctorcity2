
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, View, FlatList, Text, Alert, TouchableOpacity, Image } from 'react-native';
import * as configs from "../configs"
import RNPickerSelect from 'react-native-picker-select';
export default function Picker({ selectedValue, valueChange, dataSource, style, textInputProps, textInputStyle }) {
  const data = dataSource.map((item, index) => {
    return { label: item.label, value: item.value }
  })
  console.log("selectedValue: ", selectedValue)
  return (
    <RNPickerSelect
      selectedValue={selectedValue}
      placeholder={{ label: "Chọn", value: null }}
      useNativeAndroidPickerStyle={false}
      style={[pickerStyle]}
      onValueChange={(itemValue, itemIndex) => {
        valueChange(itemValue, itemIndex)
      }}
      textInputProps={{
        style: {
          textAlign: 'right',
          color: configs.Colors.place_holder,
          ...textInputStyle
        },
        ...textInputProps
      }}
      items={data}
    />
  );
}

const pickerStyle = {
  inputIOS: {
    color: 'black',
    backgroundColor: "white",
    borderRadius: 5,
  },
  inputAndroid: {
    color: 'black',
    backgroundColor: "white",
    borderRadius: 5,
  },
  underline: { borderTopWidth: 0 },
  icon: {
    position: 'absolute',
    backgroundColor: 'red',
    borderTopWidth: 5,
    borderTopColor: '#00000099',
    borderRightWidth: 5,
    borderRightColor: 'blue',
    borderLeftWidth: 5,
    borderLeftColor: 'orange',
    width: 0,
    height: 0,
    top: 20,
    right: 15,
  },
}