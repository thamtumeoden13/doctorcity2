import React, { useRef, useEffect, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, FlatList, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
import IonIcons from 'react-native-vector-icons/Ionicons';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import FontistoIcons from 'react-native-vector-icons/Fontisto';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';

import styles from './styles';
import * as configs from '../../../configs';
import { useSelector } from 'react-redux';

const DonThuoc = ({ phienKhamRef, onSetBadge }) => {
  console.log('render-DonThuoc')
  const userInfo = useSelector((state) => state.authReducer.userInfo);

  const timeoutChange = useRef(null)
  const timeoutSearch = useRef(null)

  const [phienKham, setPhienKham] = useState([])
  const [dsDonThuoc, setDSDonThuoc] = useState([])
  const [khoThuoc, setKhoThuoc] = useState([])
  const [khoThuocFilter, setKhoThuocFilter] = useState([])
  const [search, setSearch] = useState({
    text: '',
    item: {},
    soLuong: 0,
    huongDanSuDung: ''
  })

  const [state, setState] = useState({
    tab: 1,
    isVisibleModal: false,
    isVisibleContent: true,
    hotline: configs.AppDefines.SDT_TT_NCC
  });

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(async () => {
      let khoThuoc = []
      const c24KhoThuoc = await firestore()
        .collection('fl_content')
        .where('_fl_meta_.schema', '==', 'c24KhoThuoc')
        // .where('_fl_meta_.locale', '==', 'vi')
        .get();
      if (c24KhoThuoc.size > 0) {
        khoThuoc = c24KhoThuoc.docs.map(kt => ({
          ...kt.data(),
          isActived: false,
          nhapThuoc: kt.ref,
        }));
      }
      setKhoThuoc(khoThuoc)
      setKhoThuocFilter(khoThuoc)
    });
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    if (!!phienKhamRef) {
      console.log({ phienKhamRef })
      try {
        const subscriber = phienKhamRef?.onSnapshot(async (snap) => {
          if (snap) {
            const phienKham = snap.data()
            setPhienKham(phienKham)
            let result = []
            if (phienKham.donThuoc) {
              const reads = phienKham.donThuoc.map(async (item) => {
                const nhapThuoc = await item.info.nhapThuoc.get();
                const data = nhapThuoc.data()
                return {
                  ...data,
                  id: data.id,
                  dang_dong_goi: item.info.soLuong + ' ' + data.dangDongGoi,
                  huong_dan_su_dung: item.info.huongDanSuDung,
                  duyet: item.info.duyet,
                  nha_cung_cap: item.info.nhaCungCap,
                  info: { ...item.info },
                  uniqueKey: item.uniqueKey
                }
              })
              result = await Promise.all(reads)
            }
            result.sort((a, b) => a.duyet == 'Duyệt' ? 1 : -1)
            setDSDonThuoc(result)
            setLoading(false)
            if (timeoutChange.current) {
              clearTimeout(timeoutChange.current)
            }
            timeoutChange.current = setTimeout(() => {
              if (onSetBadge) {
                onSetBadge('donThuoc', result.length)
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

  const updateMucDo1 = (item, index) => {
    const newArr = [...phienKham.donThuoc];
    newArr.map(e => {
      if (e.uniqueKey == item.uniqueKey) {
        e.info.duyet = 'Duyệt'
        e.info.nhaCungCap = userInfo.nhaCungCap.tenNhaCungCap
      }
      return e
    })
    phienKhamRef.update({ donThuoc: newArr });
  }

  const handleThemDonThuoc = (status) => {
    if (!!status) {
      setState(prev => { return { ...prev, isVisibleModal: true } })
      // setIsLoading(true)
    } else {
      setState(prev => { return { ...prev, isVisibleModal: false, isVisibleContent: true } })
      // setIsLoading(false)
      setSearch({
        text: '',
        item: {},
        soLuong: 0,
        huongDanSuDung: ''
      })
    }
  }

  const searchFilter = (text) => {
    if (timeoutSearch.current) {
      clearTimeout(timeoutSearch.current)
    }
    timeoutSearch.current = setTimeout(() => {
      if (text) {
        const newData = khoThuoc.filter((item) => {
          const textData = text.toUpperCase()
          const itemData = `${item.hoatChatChinh.toUpperCase()},${item.maThuoc.toUpperCase()},${item.tenThuoc.toUpperCase()}`
          return itemData.indexOf(textData) > -1
        })
        console.log('newData', newData)
        setKhoThuocFilter(newData)
      } else {
        setKhoThuocFilter(khoThuoc)
      }
      setSearch(prev => { return { ...prev, item: {}, soLuong: 0, huongDanSuDung: '' } })
    }, 300);
    setSearch(prev => { return { ...prev, text, } })
  }

  const handlerIsactived = (item) => {
    setSearch(prev => { return { ...prev, item: !item.isActived ? item : {}, soLuong: 0, huongDanSuDung: '' } })
    const clone = [...khoThuocFilter]
    clone.map(e => {
      if (e.maThuoc == item.maThuoc) {
        e.isActived = !item.isActived
      } else {
        e.isActived = false
      }
      return e
    })
    setKhoThuocFilter(clone)
  }

  const taoDonThuoc = () => {
    // setIsLoading(true)
    const donThuocCu = !!phienKham.donThuoc ? phienKham.donThuoc : []
    const donthuocMoi = {
      uniqueKey: '' + Date.now(),
      info: {
        soLuong: search.soLuong,
        duyet: 'Duyệt',
        nhaCungCap: userInfo.nhaCungCap.tenNhaCungCap,
        huongDanSuDung: search.huongDanSuDung,
        nhapThuoc: search.item.nhapThuoc,
      },
    }
    const donThuocTongHop = [...donThuocCu, donthuocMoi]
    console.log('[donThuocTongHop]', donThuocTongHop)
    phienKhamRef
      .update({ donThuoc: donThuocTongHop })
      .then(() => {
        // setIsLoading(false)
        // setState(prev => { return { ...prev, tab: tab } })
        setState(prev => { return { ...prev, isVisibleContent: true } })
        setSearch(prev => { return { ...prev, item: {}, soLuong: 0, huongDanSuDung: '' } })
      })
      .catch((error) => {
        console.log('error: ', error);
        // setIsLoading(false)
        // setState(prev => { return { ...prev, tab: tab } })
      });

    setSearch({
      text: '',
      item: {},
      soLuong: 0,
      huongDanSuDung: ''
    })
  }


  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity key={item.uniqueKey} style={styles.viewBottom}>
        <View style={styles.viewCenterTop}>
          <View>
            <Text style={{ fontWeight: 'bold', paddingVertical: 5 }}>
              {item.tenThuoc}
            </Text>
            <Text style={{ fontStyle: 'italic', paddingVertical: 5 }}>
              {item.hoatChatChinh}
            </Text>
          </View>
          <Text style={{ textAlign: 'right' }}>
            {item.dang_dong_goi}
          </Text>
        </View>
        <View style={{
          paddingTop: 0
        }}>
          <Text numberOfLines={5} style={styles.txtTime}>
            {item.huong_dan_su_dung}
          </Text>
          {item.duyet !== 'Chờ' ?
            <View>
              <TouchableOpacity
                style={{
                  borderRadius: 30,
                  paddingTop: 10,
                  overlayColor: "#8397af",
                  color: 'red',
                  alignSelf: 'flex-end'
                }}
                disabled
              >
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '500', textTransform: 'capitalize' }}>{item.nha_cung_cap}</Text>
              </TouchableOpacity>
            </View> :
            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginBottom: 8,
            }}>
              <TouchableOpacity
                style={[{
                  backgroundColor: configs.Colors.agree,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  shadowOffset: {
                    width: 1,
                    height: 3,
                  },
                  shadowOpacity: 0.5,
                  shadowRadius: 1.8,
                }]}
                onPress={() => updateMucDo1(item, index)}
              >
                <Text style={{
                  fontSize: 16,
                  color: '#fff',
                  fontWeight: 'normal',
                  paddingVertical: 7
                }}>{`Duyệt`}</Text>
              </TouchableOpacity>
            </View>
          }
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={configs.Colors.blue} />
        </View>
      ) :
        <>
          {!!dsDonThuoc && dsDonThuoc.length > 0 &&
            <FlatList
              data={dsDonThuoc}
              keyExtractor={({ id }, index) => `${id.toString()}-${index.toString()}`}
              renderItem={renderItem}
            />
          }
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 16,
              right: 0,
              width: '45%', height: 40,
              backgroundColor: "#ECD662",
              borderRadius: 8,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              shadowOffset: {
                width: 1,
                height: 2,
              },
              shadowOpacity: 0.35,
              shadowRadius: 1.8,
            }}
            onPress={() => handleThemDonThuoc(true)}
          >
            <FontistoIcons
              name="pills"
              size={24}
              color='#000'
            />
            <AntDesignIcons
              name="plus"
              size={24}
              color='#000'
              style={{ marginLeft: 24 }}
            />
          </TouchableOpacity>
        </>
      }
      <Modal
        isVisible={state.isVisibleModal}
        animationIn="slideInUp"
        backdropOpacity={0.6}
      >
        {!!state.isVisibleModal &&
          <View style={{
            backgroundColor: '#ECD662', minHeight: '70%', maxHeight: '80%',
            padding: 18, alignItems: 'center', borderRadius: 18
          }}>
            <>
              {!!state.isVisibleContent &&
                <>
                  <View style={{
                    minHeight: 48,
                    flexDirection: 'row',
                    // justifyContent: 'center',
                    alignItems: 'center',
                    // marginVertical: 18,
                    width: '100%',
                    paddingHorizontal: 8,
                    borderRadius: 4,
                    backgroundColor: "#F4F5F6",
                  }}>
                    <IonIcons name="ios-search" size={16} color="#6a6a6a" />
                    <TextInput
                      // placeholder="Tên thuốc, hoạt chất chính, liều lượng"
                      placeholderTextColor={configs.Colors.place_holder}
                      style={{
                        textAlign: 'left',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 4,
                        marginRight: 4,
                        flex: 1,
                      }}
                      value={search.text}
                      onChangeText={(val) => searchFilter(val)}
                      clearButtonMode="always"
                    />
                  </View>
                  {!!khoThuocFilter && khoThuocFilter.length > 0 &&
                    <FlatList
                      data={khoThuocFilter}
                      extraData={khoThuocFilter}
                      keyExtractor={(item, index) => item.maThuoc}
                      contentContainerStyle={{ flexGrow: 1 }}
                      bounces={false}
                      renderItem={({ item, index }) => {
                        return (
                          <View
                            style={{
                              backgroundColor: !item.isActived ? '#F4F5F6' : configs.Colors.grey,
                              marginVertical: 4,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}
                          >
                            <TouchableOpacity onPress={() => handlerIsactived(item)} style={{ width: '90%' }}>
                              <Text style={{ padding: 10, fontSize: 12 }}>
                                {`${item.maThuoc} / ${item.hoatChatChinh} / ${item.tenThuoc}`}
                              </Text>
                            </TouchableOpacity>
                            <View style={{
                              width: 40, alignItems: 'center',
                              right: 10,
                            }}>
                              {!!item.isActived &&
                                <IonIcons name="checkmark-done"
                                  size={20} color={configs.Colors.straw}
                                />}
                            </View>
                          </View>
                        )
                      }}
                    />
                  }
                </>
              }
              {!!search && !!search.item && Object.keys(search.item).length > 0 &&
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={{ marginBottom: 36, width: '100%' }}
                >
                  <View style={{
                    width: '100%', borderWidth: 2,
                    marginVertical: 5, borderRadius: 4,
                    borderColor: configs.Colors.light_green
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}>
                      <Text
                        style={{
                          margin: 4,
                          padding: 0,
                          fontWeight: 'bold',
                          fontSize: 16,
                          color: configs.Colors.blue,
                        }}
                      >
                        {search.item.tenThuoc}
                      </Text>
                      <Text>{`( ${search.item.dangDongGoi} )`}</Text>
                    </View>
                    <View style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      marginBottom: 8,
                      paddingHorizontal: 8,
                      width: '100%'
                    }}>
                      <TextInput
                        placeholder="nhập số lượng"
                        placeholderTextColor={configs.Colors.place_holder}
                        keyboardType="decimal-pad"
                        style={{
                          textAlign: 'left',
                          padding: 8,
                          borderRadius: 4,
                          backgroundColor: "#F4F5F6",
                        }}
                        value={search.soLuong}
                        onChangeText={(val) => setSearch(prev => { return { ...prev, soLuong: val } })}
                        onFocus={() => setState(prev => { return { ...prev, isVisibleContent: false } })}
                        onBlur={() => setState(prev => { return { ...prev, isVisibleContent: true } })}
                      />
                    </View>
                    <View style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      marginBottom: 8,
                      width: '100%',
                      paddingHorizontal: 8
                    }}>
                      <TextInput
                        placeholder={search.item.lieuThuongDung}
                        placeholderTextColor={configs.Colors.place_holder}
                        style={{
                          padding: 8, borderRadius: 4,
                          backgroundColor: "#F4F5F6",
                        }}
                        value={search.huongDanSuDung}
                        // multiline={true}
                        numberOfLines={2}
                        onChangeText={(val) => setSearch(prev => { return { ...prev, huongDanSuDung: val } })}
                        onFocus={() => setState(prev => { return { ...prev, isVisibleContent: false } })}
                        onBlur={() => setState(prev => { return { ...prev, isVisibleContent: true } })}
                      />
                    </View>
                  </View>
                </KeyboardAvoidingView>
              }
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                position: 'absolute',
                bottom: 10,
                width: '100%',
              }}>
                <TouchableOpacity
                  style={{
                    width: '50%', height: 36,
                    backgroundColor: (!!search && !!search.item && Object.keys(search.item).length > 0
                      && search.soLuong > 0 && search.huongDanSuDung.length > 0)
                      ? configs.Colors.green
                      : configs.Colors.grey,
                    borderRadius: 8,
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    shadowOffset: {
                      width: 1,
                      height: 2,
                    },
                    shadowOpacity: 0.35,
                    shadowRadius: 1.8,
                    flexDirection: 'row'
                  }}
                  onPress={taoDonThuoc}
                  disabled={!search || !search.item || Object.keys(search.item).length <= 0
                    || search.soLuong <= 0 || search.huongDanSuDung.length <= 0}
                >
                  <Text style={{ color: '#fff', fontWeight: '500', paddingVertical: 5 }}>
                    {`Thêm đơn thuốc`}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
            <TouchableOpacity
              onPress={() => handleThemDonThuoc(false)}
              style={{
                width: 80, alignItems: 'flex-end', backgroundColor: 'tranparent',
                position: 'absolute', top: 0, right: 0
              }}
            >
              <IonIcons name="close-circle-sharp"
                size={40} color={configs.Colors.red}
              />
            </TouchableOpacity>
          </View>
        }
      </Modal>
    </View>
  );
};

export default DonThuoc;