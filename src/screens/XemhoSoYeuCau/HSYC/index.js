import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, ActivityIndicator, Alert, ScrollView, Button } from 'react-native';
import styles from './styles';
import * as configs from '../../../configs';
import { formatMoney } from '../../../utils/function';

const HSYC = ({ data }) => {
  const [dichvu, setDichvu] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    if (data && data.phienkham) {
      getData();
    }
    return () => {
      isCancelled = true;
    };
  }, []);

  async function getData() {
    let dv = undefined;
    if (data.phienkham.dichVu[0] && data.phienkham.dichVu[0].info)
      dv = await data.phienkham.dichVu[0].info.dichVu.get();
    if (dv) setDichvu(dv.data());
  }
  function updateMucDo1() {
    const newArr = [...data.phienkham.dichVu];
    newArr[0].info.giaiDoan = String(4);
    Alert.alert(newArr[0].info.giaiDoan);
  }

  if (data == null)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={configs.Colors.primary} />
      </View>
    );
  else
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.viewLeft}>

            <Image
              source={{
                uri: 'https://via.placeholder.com/150/${configs.Colors.green}/FFFFFF?Text=image%20C/O%20https://placeholder.com/'
              }}
              style={styles.img}
            />
          </View>
          <View style={styles.viewRight}>
            <View style={styles.viewContentRight}>
              <View style={[styles.tip, { marginBottom: 5 }]}>
                <Text style={styles.txtTip}>{data.khachhang.displayName}</Text>
              </View>
              <View style={[styles.tip, { marginBottom: 5 }]}>
                <Text style={styles.txtTip}>{data.phienkham.dichVu[0].info.giaiDoan}</Text>
                <Button
                  title="Press me"
                  onPress={() => updateMucDo1()}
                />
              </View>
              <View style={styles.viewBottomRight}>
                <Text style={styles.desTip}>Giá</Text>
                <View style={styles.tip}>
                  {!!dichvu && !!dichvu.price && <Text>{formatMoney(dichvu.price, 0)}vnđ</Text>}
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.viewTsb}>
          <Text>Tiền sử bệnh</Text>
          <View style={styles.viewTxtTsb}>
            <Text>{data.khachhang && data.khachhang.tienSuBenh}</Text>
          </View>
        </View>
      </ScrollView>
    );
};

export default HSYC;
