import React, { useEffect, useRef, useState, } from 'react';
import {
  View,
  FlatList,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView, ActivityIndicator,
} from 'react-native';
import styles from './styles';
import * as configs from '../../../configs';
import CheckBox from '../../../components/CheckBox';
import Slider from '../../../components/Slider';

const Hoanthanh = ({ data }) => {
  const data1 = Array.from({ length: 10 });

  const [chanDoan, setChanDoan] = useState([]);
  const [trieu_Chung, setTrieu_Chung] = useState([]);
  const [ncc, setNcc] = useState([]);

  useEffect(() => {
    let isCancelled = false;
    if (data && data.phienkham.dichVu) {
      getData();
      getData1();
      getDatancc();
    }
    return () => {
      isCancelled = true;
    };
  }, []);

  async function getData() {
    let arr = [];
    for (let i = 0; i < data.phienkham.dichVu.length; i++) {
      const item = data.phienkham.dichVu[i];
      const cd = await item.info.dichVu.get();
      arr.push(cd.data().tenChanDoan);
    }
    setChanDoan(arr);
  }
  async function getDatancc() {
    let arr = [];
    for (let i = 0; i < data.phienkham.dichVu.length; i++) {
      const item = data.phienkham.dichVu[i];
      const cd = await item.info.nhaCungCap.get();
      arr.push(cd.data().displayName);
    }
    setNcc(arr);
  }
  async function getData1() {
    let arr1 = [];
    for (let i = 0; i < data.phienkham.dichVu.length; i++) {
      const item = data.phienkham.dichVu[i];
      const cd = await item.info.dichVu.get();
      arr1.push(cd.data().tenDichVu);
    }
    setTrieu_Chung(arr1);
  }


  const rendertrieu_Chung = (index1) => {
    return trieu_Chung.map((item, index) => (
      <View key={index} style={styles.viewItemtrieu_Chung}>
        <View style={styles.itemtrieu_Chung}>
          {index == index1 ? <Text>{item}</Text> : null}

        </View>
      </View>
    ));
  };
  const rendertrieu_Chungncc = (index1) => {
    return ncc.map((item, index) => (
      <View key={index} style={styles.viewItemtrieu_Chung}>
        <View style={styles.itemtrieu_Chung}>
          {index == index1 ? <Text>{item}</Text> : null}

        </View>
      </View>
    ));
  };
  const renderItem1 = (item, index) => {
    return (
      <View key={String(index)} style={styles.viewBottom}>
        <View style={styles.viewLeftTop}>
          <Text numberOfLines={5} style={styles.txtTime}>
            <CheckBox value={index < 5 ? true : false} />
          </Text>
        </View>
        <View style={styles.viewCenterTop}>
          <Text numberOfLines={5} style={styles.txtName} key={index} >
            {rendertrieu_Chung(index)}
          </Text>
          <Text numberOfLines={5} style={styles.txtName} key={index} >
            {rendertrieu_Chungncc(index)}
          </Text>


        </View>
        <View style={styles.viewRightTop}>
          <Text numberOfLines={5} style={styles.txtTime}>
            {item.info.giaiDoan}
            {item.info.start}
            {item.info.finish}/
            <Text numberOfLines={5} style={styles.txtName} key={index} >
              {item.info.danhGiaChuyenMon}
            </Text>


          </Text>

        </View>
      </View>
    );
  };

  if (data == null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.txtTop}>tiu</Text>
      </View>
    );
  }

  const renderItem = (item, index) => {
    return (
      <View key={String(index)} style={styles.viewBottom}>
        <View style={styles.viewLeftTop}>
          <CheckBox value={index < 5 ? true : false} />
        </View>
        <View style={styles.viewCenterTop}>
          <Text style={styles.txtTop}>Hiện trạng {index}</Text>
        </View>
        <View style={styles.viewRightTop}>
          <Text style={styles.txtTop}>{index}</Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.viewTop}>
        <View style={styles.viewLeftTop}>
          <Text style={styles.txtTop}>[Xác nhận]</Text>
        </View>
        <View style={styles.viewCenterTop}>
          <Text style={styles.txtTop}>Tên dịch vụ/ncc</Text>
        </View>
        <View style={styles.viewRightTop}>
          <Text style={styles.txtTop}>Giai đoạn/đg</Text>
        </View>
      </View>

      <ScrollView style={{ height: 200 }}>
        {data.phienkham.dichVu.map((item, index) =>
          renderItem1(item, index),
        )}
      </ScrollView>
    </View>
  );
};

export default Hoanthanh;
