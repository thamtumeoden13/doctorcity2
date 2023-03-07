import React, { useEffect, useRef } from 'react';
import { View, FlatList, Text, Alert, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions } from '@react-navigation/native';
import Realm from 'realm'
import { models } from "../../models"
import * as configs from "../../configs"
import { BaseScreen } from "../../components"
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { getFoodDetail } from "../../actions"
// const icons_add = require('../../assets/img/xxx.png');
const PersonSchema = {
  name: 'Person',
  properties: {
    firstName: 'string',
    lastName: 'string',
  }
};
// const realm = new Realm({ schema: [PersonSchema, AppConfigEntity] });

export default function DanhSachDichVuScreen({ route, navigation }) {
  return (
    <BaseScreen
      isToolbar={false}
      titleScreen="DanhSachDichVuScreen"
      isMenuLeft={false}

    >
      <View style={{ flex: 1 }}>
        <TouchableOpacity>
          <Text>Gọi khẩn cấp</Text>
        </TouchableOpacity>
      </View>
    </BaseScreen>
  );
}