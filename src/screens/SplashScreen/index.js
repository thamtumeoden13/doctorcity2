import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { commonsConfigs as configs } from '../../configs';
import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../actions';
import apiApp from '../../api/index';
import { getReadyProvider } from '../../api/firebase';
import { logout, updateReadyProvider, updateReadyProviderRef } from '../../actions';
// import functions from '@react-native-firebase/functions';
import { GoogleSignin } from '@react-native-community/google-signin';
import messaging from '@react-native-firebase/messaging';

import { models } from '../../models';
import { updateUserProfileNotificationToken } from '../../api/firebase';

export default function SplashScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.commonReducer.loading);
  const userId = useSelector((state) => state.authReducer.userId);
  const userInfo = useSelector((state) => state.authReducer.userInfo);

  useEffect(() => {
    if (userId) {
      getUserInfo()
    }
  }, [userId]);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.trangThaiNguoiDung == 'NCC') {
        const checkRDP = getReadyProvider(userInfo.id);
        if (checkRDP)
          checkRDP.then((result) => {
            if (result) {
              dispatch(updateReadyProvider(result));
              dispatch(
                updateReadyProviderRef(
                  firestore().doc('fl_content/' + result.id),
                ),
              );
            }
            navigation.navigate('NhaCungCapStackScreen');
          });
        else {
          navigation.navigate('NhaCungCapStackScreen');
        }
      } else {
        navigation.navigate('KhachHangStackScreen');
      }
      dispatch(actions.loading(false));
    }
  }, [userInfo]);
  let countTimeRequest = 0;

  const getUserInfo = async () => {
    // dispatch(actions.logout());
    try {
      let userInfoFirebase = await apiApp.getUserInfoFirebase(userId);
      if (userInfoFirebase && userInfoFirebase.data()) {
        let userInfoData = userInfoFirebase.data();
        const fcmToken = await getFcmToken()
        if (fcmToken) {
          userInfoData.notificationToken = fcmToken
          await updateUserProfileNotificationToken(userInfoData.id, userInfoData);
        }
        delete userInfoData._fl_meta_;
        dispatch(actions.setUserInfo(userInfoData));
      } else {
        setTimeout(async () => {
          countTimeRequest += 2;
          if (countTimeRequest > 10) {
            await GoogleSignin.revokeAccess();
            await auth().signOut();
            dispatch(actions.logout());
            dispatch(actions.loading(false));
            alert(
              'Tài khoản chưa tồn tại trên hệ thống, vui lòng đăng nhập lại',
            );
          }
          console.log('countTimeRequest: ', countTimeRequest);
          await getUserInfo();
        }, 2000);
      }
    } catch (error) {
      console.log('error', error)
      dispatch(actions.logout());
    }
  };
  const getFcmToken = async () => {
    let fcmToken = await models.getFCMToken();
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      if (!fcmToken) {
        console.log('Lấy FCM Token thất bại');
        return ''
      }
    }
    return fcmToken
  }

  // console.log('loading: ', loading);
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#27ae60" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
