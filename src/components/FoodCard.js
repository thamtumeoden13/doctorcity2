import React, { useEffect } from "react";
import { Colors } from "../configs";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, View, TouchableOpacity, Image } from 'react-native';

export default FoodCard = ({ navigation, item }) => {
  useEffect(() => {

  }, []);
  return (

    <View style={{
      flexDirection: "row", justifyContent: "space-between", borderBottomColor: "gray", borderBottomWidth: 0.3,
      margin: 10
    }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ProductDetailScreen", { foodId: item.key })
        }}
        style={{ flexDirection: "row", justifyContent: "flex-start", flex: 1 }}>
        <Image
          style={{ resizeMode: "contain", width: 80, height: 80, }}
          // source={{ uri: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png' }}
          source={require("../assets/img/fast-food.png")}
        />
        <View style={{ justifyContent: "space-between", margin: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }} >{item.dishName}</Text>
          <Text style={{}} >{item.address}</Text>
        </View>
      </TouchableOpacity>
      {false && <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", width: 60 }}>
        <Icon name="heart" size={23}
          color="red"
        />
      </TouchableOpacity>}
    </View>
  )
}