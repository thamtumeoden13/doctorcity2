import React, { useEffect, useRef, useState, memo } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, TextInput, Alert, Platform, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import styles from './styles';
import * as configs from '../../../configs';
import Icon from 'react-native-vector-icons/FontAwesome';
import common from '../../../common/common';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';
import Modal from 'react-native-modal';
import Slider from '@react-native-community/slider';
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { Button } from '../../../components/index';

const TrieuChung = ({ phienKhamRef, onSetBadge }) => {
  console.log('render-TrieuChung')

  const userInfo = useSelector((state) => state.authReducer.userInfo);

  const timeoutChange = useRef(null)

  const [trieu_Chung, setTrieu_Chung] = useState([]);
  const [modalMucDo, setModalMucDo] = useState({
    isVisible: false,
    mucDo: 0,
    moTa: '',
    index: 0,
    color: '#3c82fc',
    text: 'Bình thường',
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
            const phienkham = snap.data()
            let dsTrieuChung = [];
            if (phienkham.ds_trieu_chung) {
              for (let i = 0; i < phienkham.ds_trieu_chung.length; i++) {
                const item = phienkham.ds_trieu_chung[i];
                const cd = await item.info.trieu_chung_ref.get();
                dsTrieuChung.push({
                  ...item,
                  tenTrieuChung: cd.data().tenTrieuChung,
                });
              }
            }
            dsTrieuChung.sort((a, b) => a.uniqueKey > b.uniqueKey ? -1 : 1)
            setTrieu_Chung(dsTrieuChung);
            setLoading(false)
            if (timeoutChange.current) {
              clearTimeout(timeoutChange.current)
            }
            timeoutChange.current = setTimeout(() => {
              if (onSetBadge) {
                onSetBadge('trieuChung', dsTrieuChung.length)
              }
            }, 300);
          }
        });
        return () => {
          subscriber()
        }
      } catch (error) {
        setLoading(false)
      }
    }
  }, [phienKhamRef])

  const preUpdateMucDo = (value, index, name) => {
    setModalMucDo(prev => { return { ...prev, [name]: value } })
    if (name == 'mucDo') {
      setModalMucDo(prev => {
        return {
          ...prev,
          color: value <= 1 ? '#3c82fc' : value <= 5 ? '#27ae60' : 6 <= value && value <= 9 ? '#fed922' : 10 <= value && value <= 12 ? '#e55d4b' : '#876aba',
          text: value <= 1 ? 'Bình thường' : value <= 5 ? 'Nhẹ' : 6 <= value && value <= 9 ? 'Vừa' : 10 <= value && value <= 12 ? 'Nặng' : 'Rất nặng',
        }
      })
    }
  }

  const updateMucDo = () => {
    let newArr = [...trieu_Chung];
    newArr[modalMucDo.index].info.moTa = modalMucDo.moTa;
    newArr[modalMucDo.index].info.mucDo = modalMucDo.mucDo;
    newArr[modalMucDo.index].info.nguoiDanhGia = userInfo.nhaCungCap?.tenNhaCungCap;
    const ds_trieu_chung = newArr.map(e => { return { info: e.info } })
    phienKhamRef.update({ ds_trieu_chung: ds_trieu_chung });
    setModalMucDo(prev => { return { ...prev, isVisible: false } })
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, }}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={configs.Colors.blue} />
          </View>
        ) :
          <>
            {!!trieu_Chung && trieu_Chung.length > 0 ?
              <FlatList
                data={trieu_Chung}
                keyExtractor={(item, index) => `${item.id}-${index.toString()}`}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity key={(index)}
                      style={{
                        marginVertical: 8,
                        backgroundColor: '#f002',
                        padding: 8,
                        borderRadius: 8,
                        justifyContent: 'center'
                      }}
                      onPress={() => {
                        setModalMucDo(prev => {
                          return {
                            ...prev,
                            isVisible: true,
                            mucDo: Number(item.info.mucDo),
                            moTa: item.info.moTa,
                            index: index,
                            color: Number(item.info.mucDo) <= 1 ? '#3c82fc' : Number(item.info.mucDo) <= 5 ? '#27ae60' : 6 <= Number(item.info.mucDo) && Number(item.info.mucDo) <= 9 ? '#fed922' : 10 <= Number(item.info.mucDo) && Number(item.info.mucDo) <= 12 ? '#e55d4b' : '#876aba',
                            text: Number(item.info.mucDo) <= 1 ? 'Bình thường' : Number(item.info.mucDo) <= 5 ? 'Nhẹ' : 6 <= Number(item.info.mucDo) && Number(item.info.mucDo) <= 9 ? 'Vừa' : 10 <= Number(item.info.mucDo) && Number(item.info.mucDo) <= 12 ? 'Nặng' : 'Rất nặng',
                          }
                        })
                      }}>
                      <View style={[common.flexRowSpaceBetween, { padding: 8 }]}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                          <View style={common.flexRow}>
                            <Text style={styles.labelText}>{item.tenTrieuChung}</Text>
                          </View>
                          <Text style={[styles.txtTime, { paddingVertical: 4 }]}>
                            {moment(item.info.thoiDiem).format('DD/MM/YY HH:mm')}
                          </Text>
                        </View>
                        <View style={{
                          borderWidth: 1,
                          borderColor: '#32AED8',
                          // backgroundColor: '#32AED8',
                          borderRadius: 8,
                          padding: 8,
                          // margin: 0,
                          justifyContent: 'center',
                          flexDirection: 'column',
                          width: 64
                        }}>
                          <Text style={{
                            color: '#32AED8',
                            fontSize: 16,
                            textAlign: 'center',
                            width: '100%'
                          }}>
                            {Number(item.info.mucDo)}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                }}
              />
              :
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>{`Không có Triệu chứng`}</Text>
              </View>
            }
          </>
        }
        <Modal
          isVisible={modalMucDo.isVisible}
          onSwipeComplete={() => setModalMucDo(prev => { return { ...prev, isVisible: false } })}
          swipeDirection={['up', 'left', 'right', 'down']}
          style={styles.bottomModal}
          propagateSwipe
          hasBackdrop
          onBackdropPress={() => { setModalMucDo(prev => { return { ...prev, isVisible: false } }) }}
        >
          {!!modalMucDo.isVisible &&
            <View style={{
              paddingHorizontal: 5,
              backgroundColor: '#fff',
              padding: 24,
              justifyContent: 'center',
              // alignItems: 'center',
              borderRadius: 4,
              borderColor: 'rgba(0, 0, 0, 0.1)',
            }}>
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 4, borderRadius: 4,
                padding: 4,
              }}
              >
                <Text style={{ color: modalMucDo.color }}>{modalMucDo.text}</Text>
              </View>
              <Slider
                style={{ height: 40, alignItems: 'center' }}
                minimumValue={1}
                maximumValue={13}
                minimumTrackTintColor={modalMucDo.color}
                maximumTrackTintColor={'#6a6a6a'}
                thumbTintColor={modalMucDo.color}
                onSlidingComplete={value => {
                  preUpdateMucDo(value, modalMucDo.index, 'mucDo')
                }}
                step={1}
                value={modalMucDo.mucDo}
              />
              <View style={[common.flexRow, {
                marginTop: 10,
                // flex: 1,
                justifyContent: 'center'
              }]}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Nhập mô tả triệu chứng..."
                  onChangeText={(value) => preUpdateMucDo(value, modalMucDo.index, 'moTa')}
                  value={modalMucDo.moTa}
                  returnKeyType='done'
                />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
                <Button
                  title="Cập nhật"
                  styles={[
                    { backgroundColor: configs.Colors.dark, width: '90%' },
                  ]}
                  onPress={updateMucDo}
                />
              </View>
            </View>
          }
        </Modal>
      </View>
    </View>
  );
};

export default memo(TrieuChung);
