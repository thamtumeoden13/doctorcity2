import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Alert, TouchableOpacity, Image, StyleSheet, TextInput, PermissionsAndroid, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';

import { BaseScreen, Label } from '../../components';
import apiApp from '../../api/index';
import { getUserInfoFirebase, updateUserProfile } from '../../api/firebase';
import { Colors } from '../../configs';
import { screenNames } from '../../routers/navigator/screenNames';
import { SCREEN_WIDTH } from '../../configs/AppDimensions';
import { updateUserProfileAvatar } from '../../api/firebase';
import * as actions from '../../actions';

export default function ThongTinKhachHangScreen({ route, navigation }) {
  const [initializing, setInitializing] = useState(true);
  const dispatch = useDispatch();
  const [cshn, setCSHN] = useState('');
  const [avatarBase64, setAvatarBase64] = useState('')
  const user = useSelector((state) => state.authReducer.userInfo);
  const userId = useSelector((state) => state.authReducer.userId);
  const backPressed = () => {
    navigation.goBack();
  };

  const onUpdateAva = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      includeBase64: true,
      compressImageQuality: 0.5,
      compressImageMaxWidth: 600,
      compressImageMaxHeight: 800,
    }).then(image => {
      const base64String = image.data
      user.avatarBase64 = base64String
      updateUserProfileAvatar(user.id, user)
      dispatch(actions.setUserInfo(user));
      setAvatarBase64(base64String)
    });
  };

  useEffect(() => {
    // user.nhaCungCap?.coSoDangKyHanhNghe?.onSnapshot(async (documentSnapshot) => {
    //   const cshn = documentSnapshot.data();
    //   if (cshn)
    //     setCSHN(cshn.tenThongDung);
    // });
    // user.avatar && Array.isArray(user.avatar) && user.avatar.length > 0 && (typeof user.avatar[0] == 'string')
    //   && storage()
    //     .ref(user.avatar[0])
    //     .getDownloadURL()
    //     .then((res) => {
    //       setUriAvt(res);
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });

    const timeout = setTimeout(async () => {
      const cshn = await user.nhaCungCap?.coSoDangKyHanhNghe?.get();
      const tenThongDung = cshn?.data().tenThongDung;
      setCSHN(tenThongDung);
    });
    return () => {
      clearTimeout(timeout)
    }
  }, [user]);

  return (
    <BaseScreen
      isToolbar={true}
      titleScreen="Thông tin cá nhân"
      isMenuLeft
      nameMenuLeft={'chevron-left'}
      onPressMenuLeft={backPressed}
      style={{ paddingHorizontal: 0 }}
      nameMenuRight="edit"
      onPressMenuRight={() => { navigation.navigate(screenNames.UpdateProfile); }}
    >
      <View style={{
        alignItems: 'center',
        paddingVertical: 16,
        backgroundColor: '#ffffff',
        width: '100%',
        paddingHorizontal: 16,
      }}>
        <TouchableOpacity
          onPress={onUpdateAva}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: 40,
          }}
        >
          <Image
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              marginBottom: 10
            }}
            resizeMode="cover"
            source={!!user.avatarBase64 ? { uri: `data:image/png;base64,${user.avatarBase64}`, }
              : { uri: 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png' }}
          >
          </Image>
          <Icon
            name={'edit'}
            size={18}
            color="#6a6a6a"
          />
        </TouchableOpacity>
      </View>
      <View style={{ paddingHorizontal: 16, backgroundColor: Colors.white, flex: 1, paddingBottom: 20 }}>
        <View style={styles.row}>
          <Icon
            name={'signature'}
            size={18}
            style={{ marginRight: 8 }}
          />
          <Label
            title="Tên"
            styles={{ marginBottom: 0, marginRight: 8 }}
          />
          <TextInput
            style={styles.input1Row}
            value={user.displayName}
            editable={false}
          />
        </View>
        <View style={styles.row}>
          <Icon
            name={'mobile-alt'}
            size={18}
            style={{ marginRight: 8 }}
          />
          <Label
            title="Điện thoại"
            styles={{ marginBottom: 0, marginRight: 8 }}
          />
          <TextInput
            style={styles.input1Row}
            value={user.phoneNumber}
            editable={false}
          />
        </View>
        {/*
        <View style={styles.row}>
          <Icon
            name={'envelope'}
            size={18}
            style={{ marginRight: 8 }}
          />
          <Label
            title="Email"
            styles={{ marginBottom: 0, marginRight: 8 }}
          />
          <TextInput
            style={styles.input1Row}
            value={user.email || ''}
            editable={false}
          />
        </View>
        */}
        <View style={styles.row}>
          <Icon
            name={'birthday-cake'}
            size={18}
            style={{ marginRight: 8 }}
          />
          <Label
            title="Ngày sinh"
            styles={{ marginBottom: 0, marginRight: 8 }}
          />
          <TextInput
            style={styles.input1Row}
            value={user.ngaySinh ? moment(user.ngaySinh).format('DD/MM/YYYY') : ''}
            editable={false}
          />
        </View>
        <View style={styles.row}>
          <Icon
            name={'venus-mars'}
            size={18}
            style={{ marginRight: 8 }}
          />
          <Label
            title="Giới"
            styles={{ marginBottom: 0, marginRight: 8 }}
          />
          <TextInput
            style={styles.input1Row}
            value={user.sex || ''}
            editable={false}
          />
        </View>
        {/*
        <View style={styles.row}>
          <Icon
            name={'map-marker-alt'}
            size={18}
            style={{ marginRight: 8 }}
          />
          <Label
            title="Địa chỉ"
            styles={{ marginBottom: 0, marginRight: 8 }}
          />
          <Text
            style={[styles.input1Row, { maxWidth: SCREEN_WIDTH / 3 * 2 }]}
            children={user?.diaChi}
            numberOfLines={2}
            ellipsizeMode="tail"
          />
        </View>
        */}
        {user.nhaCungCap &&
          <View style={styles.row}>
            <Icon
              name={'address-card'}
              size={18}
              style={{ marginRight: 8 }}
            />
            <Label
              title="Tên NCC"
              styles={{ marginBottom: 0, marginRight: 8 }}
            />
            <Text
              style={[styles.input1Row, { maxWidth: SCREEN_WIDTH / 3 * 2 }]}
              children={user.nhaCungCap.tenNhaCungCap}
              numberOfLines={2}
              ellipsizeMode="tail"
            />
          </View>
        }
        {
          user.nhaCungCap?.coSoDangKyHanhNghe &&
          <View style={styles.row}>
            <Icon
              name={'clinic-medical'}
              size={18}
              style={{ marginRight: 8 }}
            />
            <Label
              title="Cơ sở"
              styles={{ marginBottom: 0, marginRight: 8 }}
            />
            <Text
              style={[styles.input1Row, { maxWidth: SCREEN_WIDTH / 3 * 2 }]}
              children={cshn}
              numberOfLines={2}
              ellipsizeMode="tail"
            />
          </View>
        }
        <View style={styles.row}>
          <Icon
            name={'notes-medical'}
            size={18}
            style={{ marginRight: 8 }}
          />
          <Label
            title="Tiền sử"
            styles={{ marginBottom: 0, marginRight: 8 }}
          />
          <Text
            style={[styles.input1Row, { maxWidth: SCREEN_WIDTH / 3 * 2 }]}
            children={user.tienSuBenh}
            numberOfLines={2}
            ellipsizeMode="tail"
          />
        </View>
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 23,
    backgroundColor: '#F4F5F6',
    marginTop: 14,
    paddingHorizontal: 16
  },
  input1Row: { flex: 1, textAlign: 'right', paddingVertical: 16, marginLeft: 16 },
});
