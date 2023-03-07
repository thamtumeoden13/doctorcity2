import React, { Component } from 'react';
import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { Colors, commonsConfigs as configs } from '../configs'

function getCenterElement(data) {
  if (!data || data.props) {
    return <View style={styles.customTitle}>{data}</View>;
  }
  const colorStyle = data.tintColor ? { color: data.tintColor } : null;
  return (
    <View style={[styles.navBarTitleContainer]}>
      <Text ellipsizeMode={data.ellipsizeMode} numberOfLines={data.numberOfLines} style={[styles.navBarTitleText, data.style, colorStyle,]}>
        {data.titleScreen}
      </Text>
      {data.subTitle && <Text onPress={data.onPressSubTitle} ellipsizeMode={data.ellipsizeMode} numberOfLines={data.numberOfLines} style={[styles.subTitleText, data.styleSubTitle, colorStyle,]}>
        {data.subTitle}
      </Text>
      }
    </View>
  );
}

export default class Toolbar extends Component {
  render() {
    let {
      styleToolbar,
      menuLeftElement,
      centerElement,
      viewRightElement,
    } = this.props;
    return (
      <View style={styles.styleContainerToolbar}
        onStartShouldSetResponder={() => Keyboard.dismiss()}
      >
        <View style={[styles.styleToolbar, styleToolbar]}>
          {getCenterElement(centerElement)}
          {menuLeftElement}
          {viewRightElement}
        </View>

      </View>
    );
  }
}


const styles = StyleSheet.create({

  statusBar: {
    height: StatusBar.currentHeight,
  },

  styleContainerToolbar: {
    width: '100%',
    backgroundColor: 'transparent',
  },

  styleToolbar: {
    height: configs.NAV_BAR_HEIGHT,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },

  navBarTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: Colors.agree
  },
  navBarTitleText: {
    fontSize: 17,
    letterSpacing: 0.5,
    color: 'white',
    fontWeight: '500',
  },
  subTitleText: {
    fontSize: 12,
    letterSpacing: 0.5,
    color: 'white',
  },

  customTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 7,
    alignItems: 'center',
  },
})