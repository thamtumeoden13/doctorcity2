import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ImageBackground, StatusBar, View, TouchableOpacity, Text, SafeAreaView,
  ScrollView, Keyboard, TouchableWithoutFeedback, StyleSheet, ActivityIndicator
} from 'react-native';
import { IconView, InputView } from '.';
import { commonsConfigs as configs } from '../configs';
import LinearGradient from 'react-native-linear-gradient';
import ToolbarView from './ToolbarView';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { Colors } from '../configs';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const AppStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);
const ic_back = require('../assets/icon/ic_back.png');

// const BaseView = ({title, children }) => {
class BaseScreen extends Component {
  constructor(props) {
    super(props);
    this.requestSearch = this.props.requestSearch;
    this.state = {
      keySearch: '',
    };
    this.getMenuLeftElement = this.getMenuLeftElement.bind(this);
    this.getCenterElement = this.getCenterElement.bind(this);
    this.getRightElement = this.getRightElement.bind(this);
  }

  getMenuLeftElement = () => {
    return {
      menuLeftElement: (this.props.menuLeftElement
        || (this.props.menuLeftElement && this.props.menuLeftElement.props))
        ? this.props.menuLeftElement :
        (<IconView
          onPress={this.props.onPressMenuLeft}
          style={this.props.styleMenuLeft || {
            height: '100%',
            width: 40,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: '#a45'
            // transform: [{ rotate: '250deg' }]
          }}
          name={this.props.nameMenuLeft}
          source={this.props.sourceMenuLeft || ic_back}
          size={this.props.sizeMenuLeft || configs.sizeIcon18}
          color={this.props.colorMenuLeft ? this.props.colorMenuLeft : 'white'}
        />)
    };
  }

  getRightElement = () => {
    return {
      viewRightElement: (this.props.rightElement
        || (this.props.rightElement && this.props.rightElement.props))
        ? this.props.rightElement :
        ((this.props.nameMenuRight || this.props.sourceMenuRight) && <IconView
          onPress={this.props.onPressMenuRight}
          style={this.props.styleMenuRight || {
            height: '100%',
            width: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          name={this.props.nameMenuRight}
          source={this.props.sourceMenuRight}
          size={this.props.sizeMenuRight || configs.sizeIcon18}
          color={this.props.colorMenuRight || 'white'}
        />)
    };
  }

  getCenterElement = () => {
    return {
      centerElement: (this.props.centerElement
        || (this.props.centerElement && this.props.centerElement.props))
        ? this.props.centerElement :
        ({
          style: this.props.styleTitleScreen || { fontSize: 18, fontWeight: 'bold', },
          titleScreen: this.props.titleScreen,
          styleSubTitle: this.props.styleSubTitle,
          subTitle: this.props.subTitle,
          onPressSubTitle: this.props.onPressSubTitle
        })
    };
  }

  render() {
    //nếu dùng viewIconLeft thì để isShowIconBack = false or k truyền
    let { style, imageBg, isScroll = true, styleContent, colorsLinearGradient, styleLinearGradient, isMenuLeft = true, isToolbar = true } = this.props;
    return (
      <ImageBackground style={[styles.style, style]} source={imageBg} >
        <StatusBar barStyle="light-content" hidden />
        <LinearGradient locations={[0, 0.5, 0.8]}
          colors={colorsLinearGradient}
          style={[styles.styleLinearGradient, styleLinearGradient]}>
          <AppStatusBar
            backgroundColor='transparent'
            style={{ height: StatusBar.currentHeight }}
          />
          {/* <SafeAreaView
            backgroundColor={colorsLinearGradient[0]}
          /> */}
          {isToolbar ? <ToolbarView
            {...this.props}
            {...this.getRightElement()}
            {...isMenuLeft ? this.getMenuLeftElement() : {}}
            {...this.getCenterElement()}
          /> : <View />}
        </LinearGradient>
        {isScroll ? <KeyboardAwareScrollView
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
          nestedScrollEnabled={true}
        >
          {this.props.children}
        </KeyboardAwareScrollView> : this.props.children}
      </ImageBackground >
    );
  }
}
BaseScreen.defaultProps = {
  colorsLinearGradient: [Colors.bgWhite, Colors.bgWhite, Colors.bgWhite],
  linearGradient: {
  }
};

const styles = StyleSheet.create({
  style: {
    flex: 1,
    backgroundColor: Colors.agree,
    position: 'relative',
    paddingHorizontal: 15,
    ...ifIphoneX({
      paddingTop: 30
    }, {
      paddingTop: 20
    })
  },

  styleLinearGradient: {
    position: 'relative'
  },

  styleContent: {
    backgroundColor: 'transparent',
  },
  stylesViewSearch: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'absolute',
    borderWidth: configs.borderWidthInput,
    borderColor: configs.colorMain,
    borderRadius: configs.borderRadius,
    marginLeft: configs.marginLeft10,
    marginRight: configs.marginRight10,
    backgroundColor: 'white',
    fontSize: configs.fontSize14,
    height: 40,
    right: 0,
    left: 0,
  },

  stylesIconLeft: {
    color: configs.colorMain,
    width: configs.widthIconInput,
    justifyContent: 'center',
    alignItems: 'center',
    padding: configs.padding,
    backgroundColor: '#F9F7F6',
    paddingLeft: configs.paddingLeft15,
    paddingRight: configs.paddingRight15,
    borderBottomLeftRadius: configs.borderRadius4,
    borderTopLeftRadius: configs.borderRadius4
  },

  stylesAnimitale: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    left: 0,
    height: '100%'
  },

  styleTextInputElement: {
    flexDirection: 'row',
    backgroundColor: 'white',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: configs.borderWidthInput,
    height: '100%',
    width: '100%'
  },
});

export default BaseScreen;
