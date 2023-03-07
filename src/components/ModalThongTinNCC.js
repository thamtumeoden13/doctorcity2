import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { Label, ThongTinNCC } from './index';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function ModalThongTinNCC({ nhaCungCap, isModalVisible = false, setModalVisible, goiNCC, position, danhGia, updateDanhGia, videoCall }) {
  const [danhGiaNew, setDanhGiaNew] = useState(danhGia)

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    if (danhGiaNew != danhGia) {
      updateDanhGia(danhGiaNew)
    }
  };

  const updateDanhGiaNew = (danhGiaNew) => {
    setDanhGiaNew(danhGiaNew)
  }

  const preVideoCall = () => {
    setModalVisible(!isModalVisible);
    videoCall()
  }

  return (
    <Modal
      style={{ justifyContent: 'center', alignItems: 'center', }}
      isVisible={isModalVisible} hasBackdrop onBackdropPress={toggleModal}>

      <View style={{ width: 300, backgroundColor: '#fff', padding: 16, borderRadius: 20 }}>
        <TouchableOpacity style={{ position: 'absolute', zIndex: 1, top: 15, right: 20 }} onPress={toggleModal}>
          <Icon
            name={'times'}
            size={25}
            style={{ color: '#000' }}
          />
        </TouchableOpacity>
        <ThongTinNCC
          nhaCungCap={nhaCungCap}
          position={position}
          danhGia={danhGia}
          updateDanhGia={updateDanhGiaNew}
          videoCall={preVideoCall}
        />
      </View>
    </Modal>
  );
}
