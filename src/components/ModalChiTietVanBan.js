import React from 'react';
import { View, Image, Text } from 'react-native';
import { Label, ThongTinNCC } from "./index"
import Modal from 'react-native-modal';
import { Button } from "."
import { ScrollView } from 'react-native-gesture-handler';
import * as configs from "../configs"
export default function ModalChiTietVanBan({ vanBan, isModalVisible = false, setModalVisible }) {
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <Modal
      style={{ justifyContent: "center", alignItems: "center" }}
      isVisible={isModalVisible}>
      <View style={{ width: configs.AppDimensions.SCREEN_WIDTH * 0.9, height: configs.AppDimensions.SCREEN_HEIGHT * 0.6, borderRadius: 5, backgroundColor: "white" }}>
        <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "700", marginTop: 20 }} >{vanBan.tieuDe}</Text>
        <ScrollView style={{ borderColor: "gray", borderWidth: 1, margin: 12, borderRadius: 5, padding: 10 }}>
          <Text>{vanBan.noiDung}</Text>
        </ScrollView>
        <View style={{ marginBottom: 20, justifyContent: "center", alignItems: "center" }}>
          <Button title="Đóng" onPress={toggleModal} />
        </View>
      </View>
    </Modal>
  )
}
