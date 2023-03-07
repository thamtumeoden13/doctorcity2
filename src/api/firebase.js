import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

export const getUserInfoFirebase = async (userId = '') => {
  let userInfo = null;
  userInfo = await firestore()
    .collection('fl_content')
    .where('_fl_meta_.schema', '==', 'profiles')
    .where('_fl_meta_.locale', '==', 'vi')
    .where('uIDs', 'array-contains', userId)
    .get();
  if (userInfo.size > 0) {
    userInfo.docs[0];
    return userInfo.docs[0] ? userInfo.docs[0] : null;
  }
};

export const getReadyProvider = async (userId = '') => {
  let readyProvider = null;
  readyProvider = (
    await firestore()
      .collection('fl_content')
      .where('_fl_meta_.schema', '==', 'readyProviders')
      .where('_fl_meta_.locale', '==', 'vi')
      .where('provider_ref', '==', firestore().doc('fl_content/' + userId))
      .get()
  ).docs;
  return readyProvider.length ? readyProvider[0].data() : false;
};

export const updateUserProfile = async (idDoc, data) => {
  let userProfile = null;
  let userAuth = null;
  userAuth = auth().currentUser;
  if (data.type === 1) {
    await userAuth.updateProfile({
      displayName: data.displayName,
      photoURL: data.avatar
    });
    userProfile = await firestore()
      .collection('fl_content')
      .doc(idDoc)
      .update({
        ...data,
        avatar: [data.avatar],
      });
  } else {
    // await userAuth.updateProfile({
    //   displayName: data.displayName,
    //   photoURL: data.avatar
    // });
    userProfile = await firestore()
      .collection('fl_content')
      .doc(idDoc)
      .update({
        ...data,
        tienSuBenh: data.tienSuBenh,
      });
  }
  return userProfile;
};

export const updateUserProfileNotificationToken = async (idDoc, data) => {
  let userProfile = null;
  userProfile = await firestore()
    .collection('fl_content')
    .doc(idDoc)
    .update({
      ...data,
      notificationToken: data.notificationToken,
    });
  console.log('userProfile-1', userProfile)
  return userProfile;
};

export const updateUserProfileAvatar = async (idDoc, data) => {
  let userProfile = null;
  userProfile = await firestore()
    .collection('fl_content')
    .doc(idDoc)
    .update({
      ...data,
      avatarBase64: data.avatarBase64,
    });
  console.log('userProfile-2', data)
  return userProfile;
};


export const getTrungTamHoTro = async () => {
  let trungtam = null;
  trungtam = await firestore()
    .collection('fl_content')
    .where('_fl_meta_.schema', '==', 'request')
    .where('_fl_meta_.locale', '==', 'vi')
    .get();
  if (trungtam.size > 0) {
    return trungtam.docs.map(tt => ({
      ...tt.data()
    }));
  }
  return [];
};

export const getC24KhoThuoc = async () => {
  let khoThuoc = null;
  khoThuoc = await firestore()
    .collection('fl_content')
    .where('_fl_meta_.schema', '==', 'c24KhoThuoc')
    // .where('_fl_meta_.locale', '==', 'vi')
    .get();
  if (khoThuoc.size > 0) {
    return khoThuoc.docs.map(kt => ({
      ...kt.data()
    }));
  }
  return [];
};