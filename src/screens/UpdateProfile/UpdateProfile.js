import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../actions';
import { Colors } from '../../configs';
import Label from '../../components/Label';
import Picker from '../../components/Picker';
import { BaseScreen } from '../../components';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as configs from '../../configs';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { getTrungTamHoTro, getUserInfoFirebase, updateUserProfile } from '../../api/firebase';
import { firebase } from '@react-native-firebase/firestore';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

const GENDER_LIST = [
  { value: 'Nam', label: 'Nam' },
  { value: 'Nữ', label: 'Nữ' },
  { value: 'Khác', label: 'Khác' },
];

export default function UpdateProfile(props) {
  const userInfoData = useSelector((state) => state.authReducer.userInfo);
  const userId = useSelector((state) => state.authReducer.userId);
  const [userInfo, setUserInfo] = React.useState(userInfoData);
  const [nccInfo, setNCCInfo] = React.useState(userInfoData.nhaCungCap || {});
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const dispatch = useDispatch();

  const [state, setState] = useState({
    txtBenhSu: userInfoData?.tienSuBenh,
    // diaChi: userInfo.diaChi,
  });

  // let locationRef;
  // React.useEffect(() => {
  //   locationRef.setAddressText(textSearch);
  // }, []);

  const { navigation } = props;

  const backPressed = () => {
    navigation.goBack();
  };

  const handleUserInfoState = (key, value) => {
    const currentUserInfo = { ...userInfo };
    setUserInfo({
      ...currentUserInfo,
      [key]: value
    });
  };

  const handleNCCInfoState = (key, value) => {
    console.log(value);
    const nccInfoState = { ...nccInfo };
    setNCCInfo({
      ...nccInfoState,
      [key]: value
    });
  };


  const saveUserInfo = async () => {
    dispatch(actions.loading(true));
    userInfo.tienSuBenh = state.txtBenhSu;
    // userInfo.diaChi = state.diaChi;
    userInfo.type = 0;
    await updateUserProfile(userInfo.id, userInfo);
    let userInfoFirebase = await getUserInfoFirebase(userId);
    console.log(userInfoFirebase, "userInfoFirebase");
    if (userInfoFirebase && userInfoFirebase.data()) {
      let userInfoData = userInfoFirebase.data();
      delete userInfoData._fl_meta_;
      dispatch(actions.setUserInfo(userInfoData));
      navigation.navigate('ThongTinKhachHangScreen');
    }
    dispatch(actions.loading(false));
  };

  const _onChangeText = (value) => (evt) => {
    setState((state) => ({ ...state, [value]: evt }));
  };

  return (
    <BaseScreen
      style={{ zIndex: 0, paddingHorizontal: 0 }}
      isToolbar={true}
      titleScreen="Cập nhật thông tin"
      isMenuLeft
      nameMenuLeft={'chevron-left'}
      onPressMenuLeft={backPressed}
      nameMenuRight="save"
      onPressMenuRight={saveUserInfo}
    >
      <View
        style={styles.contentContainer}
      >
        <View>
          <View style={styles.row}>
            <Label
              title="Họ và tên"
              styles={{ marginBottom: 0, marginRight: 8 }}
            />
            <TextInput
              placeholder="Nhập họ tên"
              placeholderTextColor={Colors.place_holder}
              style={styles.input1Row}
              value={userInfo.displayName}
              onChangeText={(val) => handleUserInfoState('displayName', val)}
            />
          </View>
          <View>
            <View style={[styles.row]}>
              <Label
                title="Ngày sinh"
                styles={{ marginBottom: 0, marginRight: 8 }}
              />
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  setShowDatePicker(!showDatePicker);
                }}
              >
                <TextInput
                  placeholder="Ngày sinh"
                  style={styles.input1Row}
                  keyboardType="number-pad"
                  editable={false}
                  value={userInfo.ngaySinh ? moment(userInfo.ngaySinh).format('DD/MM/YYYY') : ''}
                  pointerEvents="none"
                  placeholderTextColor={Colors.place_holder}
                />
              </TouchableOpacity>
            </View>
            {
              showDatePicker && (
                <View >
                  <DateTimePicker
                    value={userInfo.ngaySinh ? (moment(userInfo.ngaySinh).toDate()) : (new Date())}
                    mode={'date'}
                    is24Hour={true}
                    display={Platform.OS === 'android' ? 'default':'spinner'}
                    locale='vi'
                    maximumDate={new Date()}
                    onChange={(event, date) => {
                      // if (event.type == "set") {
                      //   setShowDatePicker(false);
                      // } else {
                      //   setShowDatePicker(false);
                      // }
                      if (Platform.OS === 'android') {
                        setShowDatePicker(false)
                      }
                      handleUserInfoState('ngaySinh', moment(date).format('YYYY-MM-DD') + 'T00:00:00+07:00');
                    }}
                  />
                </View>
              )
            }
          </View>
          <View style={styles.row}>
            <Label
              title="Giới tính"
              styles={{ marginBottom: 0, marginRight: 8 }}
            />
            <View
              style={[styles.input1Row]}
            >
              <Picker
                dataSource={GENDER_LIST}
                selectedValue={userInfo.sex}
                valueChange={(val) => handleUserInfoState('sex', val)}
                textInputStyle={{ color: userInfo.sex == null ? Colors.place_holder : Colors.black }}
                textInputProps={{
                  value: userInfo.sex
                }}
              />
            </View>
          </View>
          {/*
          <View style={styles.row}>
            <Label
              title="Điện thoại"
              styles={{ marginBottom: 0, marginRight: 8 }}
            />
            <TextInput
              placeholder="Số điện thoại"
              style={styles.input1Row}
              value={userInfo.phoneNumber}
              editable={false}
              placeholderTextColor={Colors.place_holder}
            />
          </View>
          <View style={styles.row}>
            <Label
              title="Email"
              styles={{ marginBottom: 0, marginRight: 8 }}
            />
            <TextInput
              placeholder="Nhập email"
              style={styles.input1Row}
              onChangeText={(val) => handleUserInfoState('email', val)}
              keyboardType="email-address"
              value={userInfo.email}
              editable={!userInfoData.email}
              placeholderTextColor={Colors.place_holder}
            />
          </View>
          <View style={[styles.row, { zIndex: 9999 }]}>
            <Label
              title="Địa chỉ"
              styles={{ marginBottom: 0, marginRight: 8 }}
            />
            <View style={{ flex: 1 }}>
              {/* <GooglePlacesAutocomplete
                placeholder='Nhập địa chỉ'

                onPress={(data, details = null) => {
                  // 'details' is provided when fetchDetails = true
                  const { location } = details.geometry;
                  console.log(details, "abc")
                  handleUserInfoState('diaChi', {
                    address: details.formatted_address,
                    ...location
                  });
                  // setText(details.formatted_address);
                }}
                query={{
                  key: configs.AppDefines.GOOGLE_API_KEY,
                  language: 'vi',
                }}
                fetchDetails={true}
                styles={{
                  listView: {
                    position: 'absolute',
                    // width: '100%',
                    top: 48,
                    borderWidth: 0.5,
                    zIndex: 1000
                  },
                  row: {
                    backgroundColor: 'white'
                  },
                  container: {
                    zIndex: 0
                  }
                }}
                ref={(instance) => { locationRef = instance; }}
                textInputProps={{
                  style: styles.input1Row,
                  placeholderTextColor: Colors.place_holder,
                }}
              /> 
              <TextInput
                placeholder="Nhập địa chỉ"
                style={styles.input1Row}
                // onChangeText={(val) => handleUserInfoState('diaChi', val)}
                onChangeText={_onChangeText('diaChi')}
                value={state.diaChi}
                placeholderTextColor={Colors.place_holder}
              />
            </View>
          </View>
          */}
          <View style={styles.row}>
            <Label
              title="Tiền sử"
              styles={{ marginBottom: 0, marginRight: 8 }}
            />
            <TextInput
              placeholder="Nhập tiền sử"
              style={styles.input1Row}
              onChangeText={_onChangeText('txtBenhSu')}
              keyboardType="default"
              value={state.txtBenhSu}
              placeholderTextColor={Colors.place_holder}
            />
          </View>
        </View>
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    flex: 1,
    backgroundColor: Colors.white
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 23,
    backgroundColor: "#F4F5F6",
    marginTop: 14,
    paddingHorizontal: 16
  },
  input1Row: { flex: 1, textAlign: 'right', paddingVertical: 16 }
});
