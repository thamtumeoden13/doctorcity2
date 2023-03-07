import React, { useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, Text, Alert, TouchableOpacity, Image, ScrollView, TextInput, } from 'react-native';
import { models } from "../../models"
import * as configs from "../../configs"
import { BaseScreen, Label, Button } from "../../components"
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import { useState } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { formatNumberMoney } from "../../common/ultils"
import { useSelector } from 'react-redux';

export default function SearchDiaChiScreen({ route, navigation }) {

  const goBack = () => {
    navigation.goBack();
  }

  return (

    <BaseScreen
      isToolbar={true}
      titleScreen="Search địa chỉ"
      isMenuLeft={true}
      nameMenuLeft={'chevron-left'}
      onPressMenuLeft={goBack}
    >
      <GooglePlacesAutocomplete
        placeholder='Search'
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
        }}
        query={{
          key: configs.AppDefines.GOOGLE_API_KEY,
          language: 'vi',
        }}
      />

    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    height: 40,
    paddingLeft: 3
  },
  button: {
    width: 180, height: 60,
    backgroundColor: configs.Colors.success,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10
  }
});

