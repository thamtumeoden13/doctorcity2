import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,  
  Dimensions,
  ActivityIndicator
} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';



export default function LoadingScreen({route, navigation}) {  
  const loading = useSelector((state) => state.commonReducer.loading);  
  console.log('loading: ', loading);
  return (
    <Modal
      transparent={true}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}        
      isVisible={!!loading}        
      style={{margin: 0, flex: 1}}
      backdropOpacity={0.1}
      backdropColor={'gray'}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          backgroundColor: 'rgba(52, 52, 52, 0.5)',
        }}>
        <View style={styles.activityIndicatorWrapper}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" color="#27ae60" />
              {/* <Text style={[{color: 'black', fontSize: 20}]}>Loading...</Text> */}
            </View>
          </View>
        </View>
      </View>
    </Modal>
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