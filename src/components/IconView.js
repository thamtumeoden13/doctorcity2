import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome"
import PropTypes from 'prop-types';
import { Colors, dimensions } from '../configs'

class IconView extends Component {

    constructor(props) {
        super(props)
        this.onPress = this.onPress.bind(this)
    }

    onPress = () => {
        this.props.onPress && this.props.onPress(this.props.id)
    }

    static propTypes = {
        style: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        size: PropTypes.number,
        color: PropTypes.string
    };

    static defaultProps = {
        style: {},
        iconLeftStyle: {},
        size: 14,
        color: Colors.colorIcon,
    };

    render() {
        const {
            style,
            name,
            source,
            size,
            color,
            isRequiredField,
            onPress,
        } = this.props;
        let disabledOnPress = onPress ? false : true
        return (
            <TouchableOpacity style={[styles.containerStyle, style]} disabled={disabledOnPress} onPress={this.onPress}>
                {name ?
                    <Icon
                        name={name}
                        size={size}
                        color={color} />
                    : (source &&
                        <Image source={source}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: size,
                                height: size
                            }}
                            resizeMode="contain"
                            tintColor={color}
                        />
                    )}
                {isRequiredField ? <View style={{ width: '100%', height: '100%', position: 'absolute', paddingLeft: 2, }}>
                    <Text style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        marginTop: -(5),
                        width: 24,
                        height: 24,
                        color: 'red',
                    }}>*</Text>
                </View> : <View />}
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default IconView

