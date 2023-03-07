import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { BaseScreen } from '../../components';
import Header from '../../components/Header';
import auth from '@react-native-firebase/auth';
import * as actions from '../../actions';
import { useDispatch } from 'react-redux';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import styles from './styles';
import { useNavigation } from '@react-navigation/core';

export default function VerifyCode(props) {
  const { route } = props;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { phone } = route.params;
  const [value, setValue] = useState('');
  const [confirmResult, setConfirmResult] = useState(null);
  let countDownTimer = React.useRef(null);
  const [secondResend, setSecondSend] = useState(60);
  const onCountDownResend = () => {
    countDownTimer = setInterval(() => {
      setSecondSend((secondResend) => secondResend - 1);
    }, 1000);
  };

  const [propsVerify, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const refVerify = useBlurOnFulfill({ value, cellCount: 6 });
  const verifyPhoneNumber = async () => {
    try {
      const confirm = await auth().signInWithPhoneNumber(phone);
      console.log(confirm);
      setConfirmResult(confirm);
      return true;
    } catch (error) {
      throw error;
    }
  };

  React.useEffect(() => {
    onCountDownResend();
    dispatch(actions.loading(true));
    verifyPhoneNumber()
      .then(res => {
        dispatch(actions.loading(false));
      })
      .catch(err => {
        console.log(err);
        dispatch(actions.loading(false));
      });
  }, []);

  const onFulfill = (val) => {
    if (confirmResult && val.length == 6) {
      dispatch(actions.loading(true));
      confirmResult.confirm(val)
        .then(res => {
          console.log('DATA', res);
          if (res.additionalUserInfo && res.additionalUserInfo.isNewUser) {
            dispatch(actions.toggleShowModalProfile({
              isShow: true,
              isNewUser: res.additionalUserInfo.isNewUser
            }));
          }
          dispatch(actions.loading(false));
        })
        .catch(err => {
          console.log(err);
          dispatch(actions.loading(false));
        });
    }
  };

  const resendOtp = () => {
    setSecondSend(60);
    verifyPhoneNumber();
  };

  const backPressed = () => {
    navigation.goBack();
  };

  return (
    <BaseScreen
      isToolbar={true} 
      titleScreen="Xác thực đăng nhập"
      isMenuLeft
      nameMenuLeft={'chevron-left'}
      onPressMenuLeft={backPressed}
      isScroll={false}
      style={{paddingHorizontal: 0}}
    >
      <View style={styles.container}>
        <View>
          <Image
            style={styles.logo}
            source={require("../../assets/img/logo-new.png")}
          />
          <Text style={styles.title}>Xác nhận tài khoản</Text>
        </View>
        <Text style={styles.loginText}>Vui lòng nhập mã xác nhận đc gửi tới số điện thoại {phone}</Text>
        <CodeField
          ref={refVerify}
          {...propsVerify}
          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
          value={value}
          onChangeText={(val) => {
            setValue(val);
            if (val.length === 6) {
              onFulfill(val);
            }
          }}
          cellCount={6}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View style={styles.cell}>
              <Text
                key={index}
                style={styles.focusCell}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />
        <View style={{ width: '100%', marginTop: 16 }}>
          {secondResend > 0 ? (
            <Text style={styles.resend}>
              {'Vui lòng đợi ' + secondResend + ' giây để gửi lại'}
            </Text>
          ) : (
            <>
              <TouchableOpacity activeOpacity={0.8} onPress={resendOtp}>
                <Text style={styles.resend}>
                  Gửi lại mã
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </BaseScreen>
  );
}
