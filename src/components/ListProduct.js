import React, { Component } from "react";
import { FlatList, TouchableOpacity, TouchableOpacityBase } from "react-native";
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { connect } from "react-redux";
import { getListProduct } from "../actions"
import { Colors } from "../configs"
import Icon from 'react-native-vector-icons/FontAwesome';
import { margin } from "../configs/AppDimensions";
import { FoodCard } from "../components";

class ListProduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listProducts: null
        }

    }

    componentDidMount() {
        this.props.onGetProduct({
            skip: 0,
            limit: 100
        })
    }
    componentDidUpdate(nextProps) {
        if (this.props.products.productList && this.props.products != nextProps.products) {
            const x = this.props.products.productList;
            const list = x.map(item => {
                a = item;
                a.key = item._id
                return a
            })
            this.setState({ listProducts: list })
        }
    }

    render() {
        return (
            <FlatList
                data={this.state.listProducts}
                renderItem={({ item }) => {
                    return (<FoodCard
                        navigation={this.props.navigation}
                        item={item}
                    />)
                }}
            />
        )
    }
}

mapStateToProps = (state) => ({
    products: state.productsReducer ? state.productsReducer : null
})


mapDispathToProps = (dispatch) => {
    return {
        onGetProduct: (params) => dispatch(getListProduct(params))
    }
}

export default connect(mapStateToProps, mapDispathToProps)(ListProduct)