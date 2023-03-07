import React from 'react';
import { View, Image, Text } from 'react-native';
import { Label, ThongTinNCC } from "./index"
import Modal from 'react-native-modal';
import { Button } from "."
import { ScrollView } from 'react-native-gesture-handler';
import * as configs from "../configs"
export default function SearchDiaChi({ vanBan, isModalVisible = false, setModalVisible }) {
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <Modal
      style={{ justifyContent: "center", alignItems: "center" }}
      isVisible={isModalVisible}>
      <View style={{ width: configs.AppDimensions.SCREEN_WIDTH * 0.9, height: configs.AppDimensions.SCREEN_HEIGHT * 0.6, borderRadius: 5, backgroundColor: "white" }}>
        <GooglePlacesAutocomplete 
          onPress={(data, details = null) => {
            setLat(details.geometry.location.lat);
            setLong(details.geometry.location.lng);
            setDiaChi(details.formatted_address);
          }}
          fetchDetails={true}
          query={{
            key: configs.AppDefines.GOOGLE_API_KEY,
            language: 'vi',
            components: 'country:vn',
          }}
        />
        <View style={{ marginBottom: 20, justifyContent: "center", alignItems: "center" }}>
          <Button title="Đóng" onPress={toggleModal} Huy />
        </View>
      </View>
    </Modal>
  )
}
