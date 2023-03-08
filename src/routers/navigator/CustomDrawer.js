import { models } from '../../models';
import * as actions from '../../actions';
import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  Alert,
  SafeAreaView,
  Text,
  Linking,
  Platform,
  TouchableOpacity,
} from 'react-native';
import * as configs from '../../configs';
//Drawer
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Colors } from '../../configs';
import auth from '@react-native-firebase/auth';
import { logout, updateStatusUser } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import apiApp from '../../api/index';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';

//custom drawer content
export default (props) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.authReducer.userInfo);
  const userId = useSelector((state) => state.authReducer.userId);
  return (
    <LinearGradient locations={[0, 0.5, 0.8]}
      colors={['#27ae60', '#27ae60',]}
      style={{ flex: 1, }}
    >
      <SafeAreaView style={[styles.container, { paddingTop: 0 }]}>
        <DrawerItem
          onPress={async () => {
            props.navigation.navigate('ThongTinKhachHangScreen');
          }}
          label={({ focused, color }) => (
            <View style={{
              flexDirection: 'column',
            }}>
              <View style={{
                flexDirection: 'row',
              }}>
                <Image
                  source={!!userInfo && !!userInfo.avatarBase64 ? { uri: `data:image/png;base64,${userInfo.avatarBase64}`, }
                    : { uri: 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png' }}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    marginBottom: 10
                  }}
                  resizeMode="cover"
                />
                <View style={{ justifyContent: 'center', padding: 8 }}>
                  {!!userInfo && !!userInfo.displayName && <Text style={{ color: "#fff", padding: 4 }}>{userInfo.displayName}</Text>}
                  {!!userInfo && !!userInfo.phoneNumber && <Text style={{ color: "#fff", padding: 4 }}>{userInfo.phoneNumber}</Text>}
                </View>
              </View>
              <TouchableOpacity
                style={{
                  borderRadius: 8,
                  padding: 8,
                  backgroundColor: configs.Colors.warning,
                  width: '80%',
                  flexDirection: 'row',
                  // justifyContent: 'center',
                  alignItems: 'center',
                  shadowOffset: {
                    width: 1,
                    height: 2,
                  },
                  shadowOpacity: 0.35,
                  shadowRadius: 1.8,
                }}>
                <FontAwesome5Icons
                  name={'edit'}
                  size={18}
                  color={configs.Colors.white}
                />
                <Text style={{ fontSize:12, paddingLeft: 4, color: configs.Colors.white,  }}>{`Cập nhật`}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <View style={{ height: 2, borderBottomColor: '#0002', borderBottomWidth: 1 }}></View>
        <DrawerItem
          onPress={async () => {
            if (userInfo && userInfo.trangThaiNguoiDung == 'NCC') {
              props.navigation.navigate('LichSuCungCap');
            } else {
              props.navigation.navigate('LichSuPhienKham');
            }
          }}
          label={() => (
            <View style={{ paddingHorizontal: 8, borderRadius: 8 }}>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '500',
                  // fontSize: 18,
                  // textAlign: 'center'
                }}
              >
                {userInfo && userInfo.trangThaiNguoiDung == 'NCC'
                  ? 'Lịch sử cung cấp dịch vụ'
                  : 'Lịch sử các phiên khám'}{' '}
              </Text>
            </View>
          )}
        />
        <DrawerItem
          onPress={async () => {
            let trangThaiUpdate =
              userInfo && userInfo.trangThaiNguoiDung == 'KH' ? 'NCC' : 'KH';
            let stackScreen =
              userInfo && userInfo.trangThaiNguoiDung == 'KH'
                ? 'NhaCungCapStackScreen'
                : 'KhachHangStackScreen';
            let isSupplier = userInfo ? userInfo.isSupplier : false;
            if (!isSupplier) {
              alert(
                'Bạn chưa là Nhà cung cấp! Vui lòng nhắn tin Zalo số 0981919115 để đăng ký',
              );
            } else {
              firestore()
                .doc('fl_content/' + userInfo.id)
                .update({ trangThaiNguoiDung: trangThaiUpdate })
                .then(async () => {
                  let userInfoFirebase = await apiApp.getUserInfoFirebase(userId);
                  if (userInfoFirebase.data()) {
                    let userInfoData = userInfoFirebase.data();
                    delete userInfoData._fl_meta_;
                    dispatch(actions.setUserInfo(userInfoData));
                    props.navigation.navigate(stackScreen);
                  }
                });
            }
          }}
          label={() => (
            <View style={{ paddingHorizontal: 8, borderRadius: 8 }}>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '500',
                  // fontSize: 18,
                  // textAlign: 'center'
                }}
              >
                {userInfo && userInfo.trangThaiNguoiDung == 'NCC'
                  ? 'Chuyển làm khách hàng'
                  : 'Chuyển làm nhà cung cấp'}{' '}
              </Text>
            </View>
          )}
        />

        <View style={{ flex: 1, borderBottomColor: '#0002', borderBottomWidth: 1 }}></View>
        <DrawerItem
          onPress={async () => {
            // if (Platform.OS === 'android') {
            //   await GoogleSignin.revokeAccess();
            // }
            await auth().signOut();
            dispatch(logout());
            // models.handleLogOut();
          }}
          label={() => (
            <View style={{ padding: 4, borderRadius: 8 }}>
              <Text style={{
                color: '#fff',
                fontWeight: '500',
                fontSize: 18,
                textAlign: 'left'
              }}>{`Đăng xuất`}</Text>
            </View>
          )}
          style={{ justifyContent: 'center' }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  profilePic: {
    resizeMode: Platform.OS === 'android' ? 'cover' : 'contain',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  logo: {
    resizeMode: 'contain',
    width: '80%',
    height: 100,
  },
  logoutSection: {
    backgroundColor: Colors.lighter_green,
    borderRadius: 5,
    marginHorizontal: 10,
    height: 50,
    marginVertical: 20,
  },
  actionButton: {
    flexDirection: 'row',
    marginHorizontal: 10,
    height: 40,
    marginBottom: 10,
  },
  drawerSection: {
    marginTop: 10,
  },
  social: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  version: {
    height: 60,
    borderTopWidth: 1,
    borderTopColor: Colors.light_grey,
  },
});
