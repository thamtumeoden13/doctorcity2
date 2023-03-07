import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { View, FlatList, Dimensions, Linking, Text, Alert, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, SafeAreaView, } from 'react-native';
import * as configs from "../../configs";
import { Label, BaseScreen } from '../../components/index';
import { useRoute } from '@react-navigation/native';
import styles from './styles';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { formatMoney } from '../../utils/function';

export default function CanLamSang({ navigation }) {
  const [tongTien, setTongTien] = useState(0);
  const route = useRoute();
  const userInfo = useSelector((state) => state.authReducer.userInfo);

  const backPressed = () => {
    navigation.goBack();
  };

  const dsCanLamSang = (route.params) ? (route.params).dsCanLamSang : [];

  return (
    <BaseScreen
      isToolbar={true}
      titleScreen="Thăm dò cận lâm sàng"
      isMenuLeft
      nameMenuLeft={'chevron-left'}
      onPressMenuLeft={backPressed}
      style={{ paddingHorizontal: 0 }}
      isScroll={false}
    >
      <View style={{
        backgroundColor: '#fff', flex: 1,
        paddingTop: 12
      }}>
        <FlatList
          data={dsCanLamSang}
          keyExtractor={(item, index) => index.toString()}
          style={{ backgroundColor: '#fff', }}
          // contentContainerStyle={{ flexGrow: 1 }}
          bounces={false}
          nestedScrollEnabled={true}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity>
                <View style={[styles.itemRow, {
                  justifyContent: 'space-between',
                  backgroundColor: index % 2 === 0 ? '#00f1' : '#f2f2f2',
                  paddingHorizontal: 8, paddingVertical: 8,
                }]}>
                  <View style={[styles.itemRow, { alignItems: 'center', width: '50%', }]}>
                    <Text>{`- ${item.chiSoData.tenThongDung}`}</Text>
                    {!!item.chiSoData.unit && <Text style={{ fontStyle: 'italic', fontSize: 8 }}>{` (${item.chiSoData.unit})`}</Text>}
                  </View>
                  {!!item.giaTri && <Text style={{ width: '50%', paddingRight: 8,textAlign: 'right' }}>{`${item.giaTri}`}</Text>}
                </View>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    </BaseScreen >
  );
}