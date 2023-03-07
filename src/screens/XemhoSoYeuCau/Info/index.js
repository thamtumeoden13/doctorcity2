import React, { useEffect, useRef, useState, memo } from 'react';
import {
  View, Text, Image, KeyboardAvoidingView, TouchableWithoutFeedback,
  Alert, ScrollView, TextInput, Keyboard, TouchableOpacity, Platform, ActivityIndicator
} from 'react-native';
import storage from '@react-native-firebase/storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker, { types } from 'react-native-document-picker'
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';

import styles from './styles';
import * as configs from '../../../configs';
import common from '../../../common/common';
import Label from '../../../components/Label';

const Info = ({ phienKhamRef, userInfo }) => {
  console.log('render-Info')

  const navigation = useNavigation()
  const task = useRef(null)

  const [state, setState] = useState({
    isShowModalUpload: false
  });

  const [phienKham, setPhienKham] = useState(null)

  const [info, setInfo] = useState({
    dsChanDoan: [],
    khachHang: {},
    khachHangRef: null,
    maPhienKham: '',
    txtDienBien: '',
    txtBenhSu: '',
  })

  const [progress, setProgress] = useState({
    bytesTransferred: 0,
    totalBytes: 0,
    percentage: 0,
    isComplete: true
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
  }, [])

  useEffect(() => {
    if (!!phienKhamRef) {
      try {
        const subscriber = phienKhamRef?.onSnapshot(async (snap) => {
          if (snap) {

            const phienKham = snap.data()
            setPhienKham(phienKham)

            const khachHang = await phienKham.khachHang.get();
            const dsChanDoan = phienKham.ds_chan_doan;
            let dsChanDoanData = [];
            let khachHangData = {}
            if (dsChanDoan) {
              for (let i = 0; i < dsChanDoan.length; i++) {
                let obj = await dsChanDoan[i].icd_ref.get();
                let newObj = obj.data();
                dsChanDoanData.push(newObj);
              }
            }
            if (khachHang) {
              khachHangData = khachHang.data()
            }
            setInfo(prev => {
              return {
                ...prev,
                dsChanDoan: dsChanDoanData,
                khachHang: !!khachHangData ? khachHangData : {},
                khachHangRef: phienKham.khachHang,
                maPhienKham: phienKham.maPhienKham,
                txtBenhSu: !!khachHangData && khachHangData.tienSuBenh ? khachHangData.tienSuBenh : '',
                txtDienBien: phienKham.dienBienSucKhoe
              }
            })
            setLoading(false)
          }
        });
        return () => {
          subscriber()
        }
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
  }, [phienKhamRef])

  const _onChangeText = (value) => (evt) => {
    setInfo((state) => ({ ...state, [value]: evt }));
  };

  const postBenhSu = () => {
    phienKham.khachHang.update({ tienSuBenh: info.txtBenhSu });
    Alert.alert('Thông báo', 'Đăng tiền sử bệnh thành công!');
  };

  const postDienBien = () => {
    phienKhamRef.update({ dienBienSucKhoe: info.txtDienBien });
    Alert.alert('Thông báo', 'Đăng diễn biến bệnh thành công!');
  };

  const videoCall = () => {
    navigation.navigate('VideoCallModal',
      {
        roomId: `${userInfo.id}-${info.khachHang.id}`,
        token: info.khachHang.notificationToken,
        displayName: userInfo.nhaCungCap.tenNhaCungCap
      }
    )
  }

  const handleShowModalUpload = () => {
    setState(prev => { return { ...prev, isShowModalUpload: true } })
  }

  const preUploadFileDocument = () => {
    setState(prev => { return { ...prev, isShowModalUpload: false } })
    setTimeout(async () => {
      try {
        const res = await DocumentPicker.pick({
          type: [types.allFiles],
        })
        console.log('res', res)
        const file = res[0]
        const path = await nomarlizePath(file.uri)
        console.log({ path })
        if (file.size > 5242880) { //5MB
          Alert.alert('Vui lòng chọn file < 5MB')
          return
        }
        uploadFile(file.name, path)
      } catch (error) {
        console.log({ error })
        if (DocumentPicker.isCancel(error)) {
        } else {
          throw error
        }
      }
    }, 500);
  }

  const uploadFile = async (fileName, filePath) => {
    const reference = storage().ref(`mobileUpload/${phienKham.maPhienKham}/${fileName}`);
    task.current = reference.putFile(filePath);

    task.current.on('state_changed', taskSnapshot => {
      console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      setProgress({
        isComplete: false,
        totalBytes: taskSnapshot.totalBytes,
        bytesTransferred: taskSnapshot.bytesTransferred,
        percentage: Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100)
      })
    });

    task.current.then(async () => {
      console.log('Image uploaded to the bucket!');
      phienKhamRef.update({ phieuKetQua: `mobileUpload/${phienKham.maPhienKham}/` });
      setTimeout(() => {
        setProgress(prev => {
          return {
            ...prev,
            isComplete: true,
            bytesTransferred: 0,
            totalBytes: 0,
            percentage: 0,
          }
        })
      }, 300);
    });

    task.current.catch(error => {
      console.log({ error })
      setProgress(prev => {
        return {
          ...prev,
          isComplete: true,
          bytesTransferred: 0,
          totalBytes: 0,
          percentage: 0,
        }
      })
    })
  }

  const preUploadFileImage = () => {
    setState(prev => { return { ...prev, isShowModalUpload: false } })
    setTimeout(() => {
      ImagePicker.openPicker({
        width: 600,
        height: 800,
        includeBase64: false,
        compressImageQuality: 0.5,
        compressImageMaxWidth: 600,
        compressImageMaxHeight: 800,
      }).then(async (image) => {
        console.log('image', image)
        const path = await nomarlizePath(image.sourceURL)
        uploadFile(image.filename, image.path)
      });
    }, 500);
  }

  const uploadFileImage = () => {

  }

  const nomarlizePath = (path) => {
    console.log('nomarlizePath', path)
    const pathPrefix = Platform.OS === 'ios' ? 'file://' : 'content://'
    if (path.startsWith(pathPrefix)) {
      path = path.substring(pathPrefix.length)
      try {
        path = decodeURI(path)
      } catch (error) {
      }
    }
    return path
  }

  const cancelUpload = () => {
    if (task.current) {
      task.current.cancel()
    }
  }

  return (
    <View style={[styles.container]}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={configs.Colors.blue} />
        </View>
      ) :
        <>
          {!!info.khachHang &&
            <>
              <View style={styles.content}>
                <View style={{ height: '100%', justifyContent: 'flex-start' }}>
                  <Image
                    style={{
                      width: 76,
                      height: 76,
                      borderRadius: 23,
                      marginRight: 10
                    }}
                    resizeMode="cover"
                    source={!!info.khachHang && !!info.khachHang.avatarBase64 ? { uri: `data:image/png;base64,${info.khachHang.avatarBase64}`, }
                      : { uri: 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png' }}
                  />
                </View>
                <View style={styles.viewRight}>
                  <View style={[common.flexRow, { paddingVertical: 2 }]}>
                    <Icon name="file-alt" size={13} />
                    <Text
                      style={{
                        fontSize: (13),
                        marginLeft: 10,
                        fontWeight: '700'
                      }}
                    >{phienKham?.maPhienKham}
                    </Text>
                  </View>
                  <View style={[common.flexRow, { paddingVertical: 2 }]}>
                    <Icon name="user" size={13} />
                    <Text
                      style={{
                        fontSize: (13),
                        marginLeft: 10,
                      }}
                    >{info.khachHang?.displayName}
                    </Text>
                  </View>
                  <View style={[common.flexRow, { paddingVertical: 2 }]}>
                    <Icon name="birthday-cake" size={13} />
                    <Text
                      style={{
                        fontSize: (13),
                        marginLeft: 10
                      }}
                    >
                      {
                        !!info.khachHang && !!info.khachHang?.ngaySinh
                          ? moment(info.khachHang?.ngaySinh).format('DD/MM/YYYY')
                          : 'Chưa cập nhật'
                      }
                    </Text>
                  </View>
                  <View style={[common.flexRow, { paddingVertical: 2 }]}>
                    <Icon name="phone" size={12} />
                    <Text
                      style={{
                        fontSize: (13),
                        marginLeft: 10
                      }}
                    >{info.khachHang?.phoneNumber}
                    </Text>
                  </View>
                  <View style={[common.flexRow]}>
                    <TouchableOpacity
                      style={{
                        width: 120, height: 36, borderRadius: 16, paddingVertical: 8,
                        backgroundColor: '#0f7e4a', justifyContent: 'center', alignItems: 'center', marginRight: 8
                      }}
                      onPress={videoCall}
                    >
                      <View style={common.flexRow}>
                        <Icon name="video" size={12} color={"#fff"} />
                        <Text
                          style={{
                            fontSize: (13),
                            marginLeft: 10,
                            color: "#fff"
                          }}
                        >{`Gọi video`}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        width: 120, height: 36, borderRadius: 16, paddingVertical: 8,
                        backgroundColor: configs.Colors.blue, justifyContent: 'center', alignItems: 'center'
                      }}
                      onPress={handleShowModalUpload}
                    >
                      <View style={common.flexRow}>
                        <Icon name="upload" size={12} color={"#fff"} />
                        <Text
                          style={{
                            fontSize: (13),
                            marginLeft: 10,
                            color: "#fff"
                          }}
                        >{`Tải lên tài liệu`}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  {!progress.isComplete &&
                    <View style={[common.flexRow, { justifyContent: 'flex-end', padding: 4 }]}>
                      <TouchableOpacity onPress={cancelUpload} style={{ paddingHorizontal: 8, paddingTop: 4 }}>
                        <FontAwesomeIcon name="remove" size={20}
                          color={configs.Colors.danger}
                        />
                      </TouchableOpacity>
                      <Text>{`Đã tải lên: ${progress.percentage}%`}</Text>
                    </View>}
                </View>
              </View>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
              >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={[styles.viewTsb]}>
                      <View style={[common.flexRowEndSpaceBetween, {
                        marginBottom: 10,
                        marginTop: 10
                      }]}>
                        <Label
                          title="Tiền sử"
                          styles={{ marginBottom: 0, marginRight: 8 }}
                        />
                        {info.txtBenhSu ?
                          <TouchableOpacity onPress={postBenhSu} style={{ paddingRight: 6 }}>
                            <Icon name="save" size={20}
                              color={configs.Colors.agree}
                            />
                          </TouchableOpacity> : null}
                      </View>
                      <View style={common.flexCenter}>
                        <View style={[common.commonInput, {
                          marginBottom: 0,
                          backgroundColor: '#f4f5f6',
                          borderRadius: 16,
                          paddingVertical: 8,
                        }]}>
                          <TextInput
                            style={common.input}
                            textAlignVertical="top"
                            onChangeText={_onChangeText('txtBenhSu')}
                            value={info.txtBenhSu}
                            multiline={true}
                            numberOfLines={5}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={[styles.viewTsb]}>
                      <View style={[common.flexRowEndSpaceBetween, {
                        marginBottom: 10,
                      }]}>
                        <Label
                          title="Diễn biến"
                          styles={{ marginBottom: 0, marginRight: 8 }}
                        />
                        {info.txtDienBien ?
                          <TouchableOpacity onPress={postDienBien} style={{ paddingRight: 6 }}>
                            <Icon name="save" size={20}
                              color={configs.Colors.agree}
                            />
                          </TouchableOpacity> : null
                        }
                      </View>
                      <View style={[common.flexCenter]}>
                        <View style={[common.commonInput, {
                          marginBottom: 0,
                          backgroundColor: '#f4f5f6',
                          borderRadius: 16,
                          paddingVertical: 8,
                        }]}>
                          <TextInput
                            style={common.input}
                            textAlignVertical="top"
                            onChangeText={_onChangeText('txtDienBien')}
                            value={info.txtDienBien}
                            multiline={true}
                            numberOfLines={5}
                          />
                        </View>
                      </View>
                    </View>
                  </ScrollView>
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
            </>
          }
          {!!info.dsChanDoan && info.dsChanDoan.length > 0 &&
            <View style={{ marginTop: 16 }}>
              <Label
                title="Chẩn đoán"
                styles={{ marginBottom: 0, marginRight: 8 }}
              />
              <View style={[common.commonInput, {
                flexDirection: 'column', alignItems: 'flex-start',
              }]}>
                {info.dsChanDoan.map((item, index) => {
                  return (
                    <View key={`${item.id}-${index.toString()}`} style={{ paddingVertical: 8, paddingRight: 8, flexDirection: 'row', alignItems: 'center' }}>
                      <Text>- </Text>
                      <Text>{item.tenChanDoan}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          }
        </>
      }
      <Modal
        isVisible={state.isShowModalUpload}
        onSwipeComplete={() => setState(prev => { return { ...prev, isShowModalUpload: false } })}
        swipeDirection={['up', 'left', 'right', 'down']}
        style={{
          margin: 0,
          // alignItems: 'center',
          justifyContent: 'flex-end'
        }}
        propagateSwipe
        hasBackdrop
        onBackdropPress={() => { setState(prev => { return { ...prev, isShowModalUpload: false } }) }}
      >
        {!!state.isShowModalUpload &&
          <View style={{
            paddingHorizontal: 5,
            backgroundColor: '#fff',
            paddingHorizontal: 24,
            paddingVertical: 12,
            justifyContent: 'center',
            // alignItems: 'center',
            borderRadius: 4,
            borderColor: 'rgba(0, 0, 0, 0.1)',
          }}>
            <View style={{ flexDirection: 'column' }}>
              <TouchableOpacity
                style={{
                  width: '100%', height: 48, borderRadius: 16, paddingVertical: 8, marginVertical: 8,
                  backgroundColor: configs.Colors.blue, justifyContent: 'center', alignItems: 'center'
                }}
                onPress={preUploadFileImage}
              >
                <View style={common.flexRow}>
                  <Icon name="upload" size={12} color={"#fff"} />
                  <Text
                    style={{
                      fontSize: 16,
                      marginLeft: 10,
                      color: "#fff"
                    }}
                  >{`Tải lên hình ảnh`}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '100%', height: 48, borderRadius: 16, paddingVertical: 8, marginVertical: 8,
                  backgroundColor: configs.Colors.blue, justifyContent: 'center', alignItems: 'center'
                }}
                onPress={preUploadFileDocument}
              >
                <View style={common.flexRow}>
                  <Icon name="upload" size={12} color={"#fff"} />
                  <Text
                    style={{
                      fontSize: 16,
                      marginLeft: 10,
                      color: "#fff"
                    }}
                  >{`Tải lên tài liệu`}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        }
      </Modal>
    </View>
  );
};

export default memo(Info);
