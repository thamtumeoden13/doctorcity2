import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { BaseScreen, Label } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../../configs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { logout } from '../../actions';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import apiApp from '../../api/index';
import * as actions from '../../actions';

export default function ThongTinKhachHangScreen({ route, navigation }) {
  const user = useSelector((state) => state.authReducer.userInfo);
  const userId = useSelector((state) => state.authReducer.userId);

  const dispatch = useDispatch();

  const onLogout = async () => {
    await auth().signOut();
    dispatch(logout());
  };

  return (
    <BaseScreen
      isToolbar={true}
      titleScreen="Cá nhân"
      style={{ paddingHorizontal: 0 }}
      isMenuLeft={false}
    >
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        backgroundColor: '#ffffff',
        width: '100%',
        paddingHorizontal: 16
      }}>
        <Image
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            alignSelf: 'center',
            marginRight: 8
          }}
          resizeMode="cover"
          source={!!user && !!user.avatarBase64 ? { uri: `data:image/png;base64,${user.avatarBase64}`, }
            : { uri: 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png' }}
        />
        <View>
          {
            user && (
              <>
                {
                  user.displayName && (
                    <Text style={{ fontWeight: '500', fontSize: 20, lineHeight: 23 }}>{user.displayName}</Text>
                  )
                }
                <Text style={{ fontWeight: 'normal', fontSize: 16, lineHeight: 19, color: '#AFAFAF' }}>{user?.phoneNumber}</Text>
              </>
            )
          }
        </View>
      </View>
      <View style={{ backgroundColor: '#F6F6F6', height: 14 }}>

      </View>

      <View style={{ paddingHorizontal: 16, backgroundColor: Colors.white, flex: 1 }}>
        <TouchableOpacity style={styles.row} onPress={() => {
          navigation.navigate('ThongTinKhachHangScreen');
        }}>
          <Icon
            name={'user-check'}
            size={18}
            style={{ marginRight: 8 }}
          />
          <Label
            title="Thông tin cá nhân"
            styles={{ paddingVertical: 15, marginBottom: 0, fontWeight: '500' }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Icon
            name={'scroll'}
            size={18}
            style={{ marginRight: 8 }}
          />
          <Label
            title="Điều khoản chính sách"
            styles={{ paddingVertical: 15, marginBottom: 0, fontWeight: '500' }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Icon
            name={'user-plus'}
            size={18}
            style={{ marginRight: 8 }}
          />
          <Label
            title="Mời bạn bè"
            styles={{ paddingVertical: 15, marginBottom: 0, fontWeight: '500' }}
          />
        </TouchableOpacity>
      </View>

      <View style={{ backgroundColor: Colors.white, paddingHorizontal: 16 }}>
        {/* <TouchableOpacity style={styles.row} onPress={async () => {
          let trangThaiUpdate =
            user && user.trangThaiNguoiDung == 'KH' ? 'NCC' : 'KH';
          let stackScreen =
            user && user.trangThaiNguoiDung == 'KH'
              ? 'NhaCungCapStackScreen'
              : 'KhachHangStackScreen';
          let isSupplier = user ? user.isSupplier : false;
          if (!isSupplier) {
            alert(
              'Bạn chưa có quyền làm Nhà cung cấp. Vui lòng liên hệ với trung tâm để được đăng ký',
            );
          } else {
            firestore()
              .doc('fl_content/' + user.id)
              .update({ trangThaiNguoiDung: trangThaiUpdate })
              .then(async () => {
                let userInfoFirebase = await apiApp.getUserInfoFirebase(userId);
                if (userInfoFirebase.data()) {
                  let userInfoData = userInfoFirebase.data();
                  delete userInfoData._fl_meta_;
                  // delete userInfoData.nhaCungCap;
                  // delete userInfoData.avatar;
                  // console.log("trangThaiNguoiDung: ", userInfoData.trangThaiNguoiDung)
                  dispatch(actions.setUserInfo(userInfoData));
                  navigation.navigate(stackScreen);
                }
              });
          }
        }
        }>
          <Icon
            name={"people-arrows"}
            size={18}
            style={{ marginRight: 8, color: Colors.agree }}
          />
          <Label
            title={user && user.trangThaiNguoiDung == 'NCC'
              ? 'Chuyển làm khách hàng'
              : 'Chuyển làm nhà cung cấp'}
            styles={{ paddingVertical: 15, marginBottom: 0, color: Colors.agree, fontWeight: '500' }}
          />
        </TouchableOpacity>
         */}
        <TouchableOpacity style={styles.row} onPress={onLogout}>
          <Icon
            name={'sign-out-alt'}
            size={18}
            style={{ marginRight: 8, color: Colors.danger }}
          />
          <Label
            title="Đăng xuất"
            styles={{ paddingVertical: 15, marginBottom: 0, color: Colors.danger, fontWeight: '500' }}
          />
        </TouchableOpacity>
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
  },
  input1Row: { flex: 1, textAlign: 'right', paddingVertical: 16, marginLeft: 16 },
  subtitle: {
    fontSize: 10,
    fontStyle: 'italic',
    color: Colors.place_holder,
    marginBottom: 16
  }
});
