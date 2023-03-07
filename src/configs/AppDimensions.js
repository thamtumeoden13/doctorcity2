import React from 'react';
import { StatusBar, Platform, Dimensions} from 'react-native';

const { height, width } = Dimensions.get('window');
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 592;
export const SCREEN_HEIGHT = Dimensions.get('window').height
export const SCREEN_WIDTH = Dimensions.get('window').width

const scale = size => width / guidelineBaseWidth * size;
export const verticalScale = size => height / guidelineBaseHeight * size;
export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export const heightStatusbar = Platform.OS === 'ios' ? 30 : StatusBar.currentHeight;
export const heightToolBar = Platform.OS === 'ios' ? 45 : 45;
export const heightBackgroundImage = 45
export const height20 = 20
export const widthBackgroundImage = 35
export const minHeighRow = 40
export const minHeighRow45 = 45
export const widthViewScannerBarCode = 250
export const sizeBorder = 0.5
export const sizeLoading = 90
export const widthImageBarCode = 400
export const heightImageBarCode = 200


export const margin = 5
export const marginLeft = 5
export const marginTop = 5
export const marginRight = 5
export const marginBottom = 5


export const padding = 5
export const paddingLeft = 5
export const paddingTop = 5
export const paddingRight = 5
export const paddingBottom = 5


export const margin10 = 10
export const marginLeft10 = 10
export const marginTop10 = 10
export const marginRight10 = 10
export const marginBottom10 = 10

export const padding10 = 10
export const paddingLeft10 = 10
export const paddingTop10 = 10
export const paddingRight10 = 10
export const paddingBottom10 = 10

export const margin15 = 15
export const marginLeft15 = 15
export const marginTop15 = 15
export const marginRight15 = 15
export const marginBottom15 = 15

export const padding15 = 15
export const paddingLeft15 = 15
export const paddingTop15 = 15
export const paddingRight15 = 15
export const paddingBottom15 = 15

export const margin20 = 20
export const marginLeft20 = 20
export const marginTop20 = 20
export const marginRight20 = 20
export const marginBottom20 = 20

export const padding20 = 20
export const paddingLeft20 = 20
export const paddingTop20 = 20
export const paddingRight20 = 20
export const paddingBottom20 = 20

export const margin8 = 8
export const marginLeft8 = 8
export const marginRight8 = 8
export const marginTop8 = 8
export const marginBottom8 = 8

export const borderRadius = 8
export const borderRadius4 = 4

export const fontSize6 = 6
export const fontSize8 = 8
export const fontSize10 = 10
export const fontSize11 = 11
export const fontSize11_5 = 11.5
export const fontSize12 = 12
export const fontSize12_5 = 12.5
export const fontSize13 = 13
export const fontSize13_5 = 13.5
export const fontSize14 = 14
export const fontSize14_5 = 14.5
export const fontSize16 = 16
export const fontSize15 = 15
export const fontSize18 = 18
export const fontSize21 = 21
export const fontSize24 = 24
export const fontSize26 = 26

//Image
export const widthImage = 16
export const heightImage = 16

//TabBar
export const fontSizeTextNormalItemTab = fontSize12
export const fontSizeTextSelectedItemTab = fontSize12
export const widthIcon14 = 14
export const heightIcon14 = 14
export const widthIcon16 = 16
export const heightIcon16 = 16
export const sizeIcon10 = 10
export const sizeIcon12 = 12
export const sizeIcon14 = 14
export const sizeIcon16 = 16
export const sizeIcon18 = 18
export const sizeIcon20 = 20
export const sizeIcon24 = 24
export const sizeIcon28 = 28

//Button
export const heightButton = 45
export const borderRadiusButton = 8

//Input
export const height50 = 50
export const height30 = 30
export const heightDefault = 35
export const heightInput = 45
export const heightInput40 = 40
export const heightInput42 = 42
export const widthIconInput = 30
export const heightIconInput = 40
export const borderWidthInput = 0.5

//CardView
export const borderRadiusCard = 4
export const heightHeader = 45
//CheckBox
export const sizeCheckbox = 20


