import React, { useState, useEffect, useRef } from 'react';
import styles from './styles';
import {
  Text, View, TextInput,
  Image
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { BaseScreen, Button } from '../../components';
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-community/google-signin';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../actions';
import { validatePhoneNumber } from '../../common/ultils';
import { screenNames } from '../../routers/navigator/screenNames';

GoogleSignin.configure({
  webClientId: '1051883467266-g4loih7k01lpcdaar6t4m290aqj1o33g.apps.googleusercontent.com',
  iosClientId: '1051883467266-rut3k9kcrc0i2q25hevf00932h7r49pq.apps.googleusercontent.com',
  offlineAccess: true,
});

export const DISABLE_LOGIN_EMAIL = true;

export default LoginScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const phoneRefs = useRef(null);
  const [phone, setPhone] = useState('');
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  const [credentialStateForUser, updateCredentialStateForUser] = useState(-1);
  async function fetchAndUpdateCredentialState(updateCredentialStateForUser) {
    if (user === null) {
      updateCredentialStateForUser('N/A');
    } else {
      const credentialState = await appleAuth.getCredentialStateForUser(user);
      if (credentialState === appleAuth.State.AUTHORIZED) {
        updateCredentialStateForUser('AUTHORIZED');
      } else {
        updateCredentialStateForUser(credentialState);
      }
    }
  }
  useEffect(() => {
    if (!appleAuth.isSupported) return;

    fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
      updateCredentialStateForUser(`Error: ${error.code}`),
    );
  }, []);

  useEffect(() => {
    if (!appleAuth.isSupported) return;

    return appleAuth.onCredentialRevoked(async () => {
      console.warn('Credential Revoked');
      fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
        updateCredentialStateForUser(`Error: ${error.code}`),
      );
    });
  }, []);

  async function onAuthStateChanged(user) {
    if (user && user._user) {
      dispatch(actions.loginSuccess(user.uid));
      dispatch(actions.loading(false));
    } else {
      dispatch(actions.loading(false));
    }
  }

  const googleSignIn = async () => {
    try {
      dispatch(actions.loading(true));
      await GoogleSignin.hasPlayServices();
      const { idToken, user } = await GoogleSignin.signIn();
      console.log(idToken, 'idToken');
      if (user && idToken) {
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return auth().signInWithCredential(googleCredential);
      } else {
        console.log('Chưa có tài khoản đăng nhập: ');
      }
    } catch (error) {
      console.log(error.code, error);
      alert('Đăng nhập thất bại');
      dispatch(actions.loading(false));
    }
  };
  async function onAppleButtonPress() {
    // Start the sign-in request
    try {
      console.log('appleAuthRequestResponse1: ', appleAuth.isSupported);
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      console.log('appleAuthRequestResponse: ', appleAuthRequestResponse);

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw 'Apple Sign-In failed - no identify token returned';
      }

      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
      console.log('appleCredential: ', appleCredential);
      // Sign the user in with the credential
      return auth().signInWithCredential(appleCredential);
    } catch (error) {
      console.log('????');
      console.log(error.code);
    }

  }

  async function onPressLoginPhone() {
    try {
      if (validatePhoneNumber(phone)) {
        let phoneNumber = phone.startsWith('0') ? phone.replace('0', '+84') : '+84' + phone;
        navigation.navigate(screenNames.VerifyCode, { phone: phoneNumber });
        // auth()
        //   .signInWithPhoneNumber(phoneNumber)
        //   .then(confirmResult => {
        //     console.log(confirmResult)
        //   })
        //   .catch(error => {
        //     alert(error.message)

        //     console.log(error)
        //   })
        return;
      }
      throw new Error();
    } catch (error) {
      console.log(error.code, error);
      alert('Đăng nhập thất bại');
      dispatch(actions.loading(false));
    }
  }
  return (
    <BaseScreen
      isToolbar={false}
      isScroll={true}
      style={{paddingHorizontal: 0, paddingTop: 0}}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <View>
            <View>
              <Image
                style={styles.logo}
                source={require("../../assets/img/logo-new.png")}
              />
              <Text style={styles.title}>Chào mừng bạn quay trở lại</Text>
              <Text style={styles.loginText}>Đăng nhập để tiếp tục</Text>
            </View>
            <View style={styles.phoneInput}>
              <Text style={{ fontWeight: 'bold', padding: 16, fontSize: 14, lineHeight: 16 }}>+84</Text>
              <TextInput
                ref={phoneRefs}
                placeholder="Nhập số điện thoại của bạn..."
                keyboardType='phone-pad'
                style={{ color: '#000', width: 900 }}
                onChangeText={setPhone}
                value={phone}
              />
            </View>
            <View>
              <Button
                title="Đăng nhập"
                styles={{ marginTop: 16, alignSelf: 'center' }}
                onPress={onPressLoginPhone}
              />
            </View>
            {
              !DISABLE_LOGIN_EMAIL && (
                <>
                  <View style={styles.coverButton}>
                    <GoogleSigninButton
                      style={{ width: 260 }}
                      size={GoogleSigninButton.Size.Wide}
                      color={GoogleSigninButton.Color.Dark}
                      onPress={googleSignIn}
                    />
                  </View>
                  {Platform.OS == 'ios' && <View style={[styles.coverButton, { margin: 5 }]}>
                    <Text styles={styles.loginTextUnder}>or</Text>
                  </View>}
                  {Platform.OS == 'ios' && <View style={[styles.coverButton]}>
                    <AppleButton
                      buttonStyle={AppleButton.Style.BLACK}
                      buttonType={AppleButton.Type.SIGN_IN}
                      style={{
                        width: 250,
                        height: 45,
                      }}
                      onPress={() => onAppleButtonPress().then(() => console.log('Apple sign-in complete!'))}
                    />
                  </View>}
                </>
              )
            }

          </View>
        </View>
        <View style={styles.footer}>
        </View>
      </View>
    </BaseScreen>
  );
};