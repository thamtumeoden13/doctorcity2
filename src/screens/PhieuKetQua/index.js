import React, { useEffect, useRef, useState } from 'react';
import {
  View, FlatList, Dimensions, Linking, Text, Alert,
  TouchableOpacity, ActivityIndicator, ScrollView, TextInput, SafeAreaView,
  PermissionsAndroid, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob'

import { Label, BaseScreen } from '../../components/index';
import styles from './styles';
import { Colors } from '../../configs';

export default function PhieuKetQua({ navigation }) {
  const route = useRoute();
  const userInfo = useSelector((state) => state.authReducer.userInfo);

  const [state, setState] = useState({
    bytesTransferred: 0,
    totalBytes: 0,
    percentage: 0,
    isComplete: true,
    index: -1,
    dir: [],
    res: ''
  })

  const backPressed = () => {
    navigation.goBack();
  };

  const dsPhieuKetQua = (route.params) ? (route.params).dsPhieuKetQua : [];
  const handleDownLoadFile = async (item, index) => {
    const toFile = Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath
    setState(prev => { return { ...prev, index: index } })
    const PATH_TO_CREATE = `${toFile}/${item.fileName}`
    RNFS.downloadFile({
      fromUrl: item.downloadURL,
      toFile: PATH_TO_CREATE,
      begin: downloadBeginCallback,
      progress: downloadProgressCallback,
      progressInterval: 100,
    }).promise.then((result) => {
      setState(prev => {
        const dir = Object.assign([], prev.dir, { [index]: PATH_TO_CREATE })
        return {
          ...prev,
          dir: dir
        }
      })
    }).catch((error) => {
      console.log({ error })
    }).finally(() => {
      setTimeout(() => {
        setState(prev => {
          return {
            ...prev,
            index: -1,
            isComplete: true,
            bytesTransferred: 0,
            totalBytes: 0,
            percentage: 0,
          }
        })
      }, 500);
    })
    // ver 2 
    console.log('downloadURL', item.downloadURL);
    let downloadDest = `${Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath}/${item.fileName}`
    RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        notification: true,
        title: item.fileName,
        description: item.fileName,
        mediaScannable: true,
        useDownloadManager: true,
        path: downloadDest,
      }
    })
      .fetch('GET', `${item.downloadURL}`, {})
      .then(async (res) => {
        let base64Str = await res.base64()
        let pathStr = await res.path()
        console.log({ res, base64Str, pathStr })
        if (Platform.OS === "ios") {
          RNFetchBlob.fs.writeFile(downloadDest, res.data, 'base64');
          RNFetchBlob.ios.previewDocument(downloadDest);
        }
        setState(prev => {
          const dir = Object.assign([], prev.dir, { [index]: downloadDest })
          return {
            ...prev,
            dir: dir
          }
        })
        console.log('The file saved to ', res);
      })
      .catch((e) => {
        console.log('The file saved to ERROR', e.message)
      }).finally(() => {
        setTimeout(() => {
          setState(prev => {
            return {
              ...prev,
              index: -1,
              isComplete: true,
              bytesTransferred: 0,
              totalBytes: 0,
              percentage: 0,
            }
          })
        }, 500);
      })
  }

  const downloadBeginCallback = (res) => {
    console.log('downloadBeginCallback', res)
    setState(prev => {
      return {
        ...prev,
        isComplete: false
      }
    })
  }

  const downloadProgressCallback = (res) => {
    console.log('downloadProgressCallback', Math.round(res.bytesWritten / res.contentLength * 100))
    setState(prev => {
      return {
        ...prev,
        bytesTransferred: res.bytesWritten,
        totalBytes: res.contentLength,
        percentage: Math.round(res.bytesWritten / res.contentLength * 100),
      }
    })
  }

  const checkPermission = async (item, index) => {
    if (Platform.OS === 'ios') {
      handleDownLoadFile(item, index)
    } else {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App need access to your storage to download file'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage Permission Granted')
          handleDownLoadFile(item, index)
        } else {
          alert('Storage Permission Not Granted')
        }
      } catch (error) {
        console.warn(error)
      }
    }
  }

  return (
    <BaseScreen
      isToolbar={true}
      titleScreen="Phiếu kết quả"
      isMenuLeft
      nameMenuLeft={'chevron-left'}
      onPressMenuLeft={backPressed}
      style={{ paddingHorizontal: 0 }}
      isScroll={false}
    >
      <View style={{
        backgroundColor: '#fff', flex: 1,
        paddingTop: 4
      }}>
        <FlatList
          data={dsPhieuKetQua}
          keyExtractor={(item, index) => index.toString()}
          style={{ backgroundColor: '#fff', }}
          bounces={false}
          nestedScrollEnabled={true}
          renderItem={({ item, index }) => {
            return (
              <View style={{
                flexDirection: 'column',
                backgroundColor: index % 2 === 0 ? '#00f1' : '#f2f2f2',
                padding: 8, marginBottom: 8
              }}>
                <View style={[styles.itemRow, { justifyContent: 'space-between', }]}>
                  <View style={{
                    height: 48, width: 48,
                    justifyContent: 'center', alignItems: 'center',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#000'
                  }}>
                    <Text style={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: 14 }}>{`${item.ext}`}</Text>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 8 }}>
                    <Text style={{ fontWeight: '500', fontStyle: 'italic', fontSize: 14 }}>{`${item.fileName}`}</Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center', alignItems: 'center', width: 64,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: Colors.blue
                    }}
                    onPress={() => checkPermission(item, index)}
                    disabled={!(state.index == -1) ? true : false}
                  >
                    <Icon name="arrow-circle-down" size={26}
                      color={state.index == -1 ? Colors.blue : Colors.grey} style={{ padding: 4 }}
                    />
                    <Text style={{ fontStyle: 'italic', fontStyle: 'italic', fontSize: 10, color: Colors.black50 }}>{`${item.size}`}</Text>
                  </TouchableOpacity>
                </View>
                {
                  !state.isComplete && <Text style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    textAlign: 'right',
                    fontWeight: '500', fontStyle: 'italic', fontSize: 12, color: Colors.danger
                  }}>
                    {state.index == index ? `Đã tải về: ${state.percentage} %` : ''}
                  </Text>
                }
              </View>
            )
          }}
        />
        {/* <Text style={{
          paddingHorizontal: 8,
          fontWeight: '500', fontStyle: 'italic', fontSize: 12, color: Colors.danger,
          marginBottom: 16
        }}>
          {state.res}
        </Text> */}
      </View>
    </BaseScreen >
  )
}