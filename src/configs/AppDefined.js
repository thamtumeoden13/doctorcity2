import { Dimensions, StatusBar, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const NAME_APP = 'DoctorCity';
// export const SDT_KHAN_CAP = '0333333333';
export const SDT_KHAN_CAP = '0981919115' // '02433119115';
export const SDT_TT_NCC = '0981919115';
export const GOOGLE_API_KEY = 'AIzaSyB3ZE-XT5CS0IgEYLyTakWDOOzbDOs8vBU';

export const SUCCESS = 200;
export const CREATED = 201;
export const ACCEPTED = 202;
export const NO_CONTENT = 204;
export const BAD_REQUEST = 400;
export const UNAUTHORIZED = 401;
export const NOT_FOUND = 404;
export const INTERNAL_SERVER = 500;

export const CODE_SUCCESS = [ACCEPTED, NO_CONTENT, SUCCESS, CREATED];

export const CODE_FAILED = [
  BAD_REQUEST,
  UNAUTHORIZED,
  INTERNAL_SERVER,
  NOT_FOUND,
];

export const DEVICE_ID = DeviceInfo.getUniqueId();
export const SYS_VERSION = DeviceInfo.getSystemVersion();
export const VERSION_APP = DeviceInfo.getVersion();
export const BUILD_NUMBER = DeviceInfo.getBuildNumber();
export const DEVICE_NAME = DeviceInfo.getDeviceName();
export const IS_TABLET_OR_IPAD = DeviceInfo.isTablet();
export const hasNotch = DeviceInfo.hasNotch();
export const IS_LOGGED_IN = 'IS_LOGGED_IN';
export const FORMAT_SEPARATOR_NUMBER = '0[,]00';
export const FORMAT_HH_MM_DATE_VN = 'HH:mm DD/MM/YYYY';
export const FORMAT_DATE_YYYY_MM_DD = 'YYYY/MM/DD';
export const FORMAT_DATE_VN = 'DD/MM/YYYY';
export const FORMAT_DATE = 'YYYY-MM-DD';
export const NUMBER_ITEM_PAGE_DEFAULT = 30;
export const TYPE_ROLES_POSTMANER = 1;
export const NAV_BAR_HEIGHT = 50;
export const HEIGHT_STATUS_BAR =
  Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
export const HEIGHT_TOOLBAR = NAV_BAR_HEIGHT + StatusBar.currentHeight;
export const TIME_OUT_LOADING = 40000;
export const WIDTH_SCREEN_DEVICE = Dimensions.get('window').width;
export const HEIGHT_SCREEN_DEVICE = Dimensions.get('window').height;
export const COORDINATES_DEFAULT = [105.780065, 21.030572];
export const COORDINATES_VNPOST = {
  latitude: COORDINATES_DEFAULT[1],
  longitude: COORDINATES_DEFAULT[0],
};

export const LIST_MUCDO = [
  {
    label: '1',
    value: 1,
  },
  {
    label: '2',
    value: 2,
  },
  {
    label: '3',
    value: 3,
  },
  {
    label: '4',
    value: 4,
  },
  {
    label: '5',
    value: 5,
  },
  {
    label: '6',
    value: 6,
  },
  {
    label: '7',
    value: 7,
  },
  {
    label: '8',
    value: 8,
  },
  {
    label: '9',
    value: 9,
  },
  {
    label: '10',
    value: 10,
  },
  {
    label: '11',
    value: 11,
  },
  {
    label: '12',
    value: 12,
  },
  {
    label: '13',
    value: 13,
  },
]


export const AppConfigTable = Object.freeze({
  APP_VERSION: { id: 1, name: 'Phiên bản ứng dụng' },
  APP_INFO: { id: 2, name: 'Thông tin ứng dụng' },
  TOKEN: { id: 3, name: 'Token đăng nhập' },
  FCM_TOKEN: { id: 4, name: 'FCM Token của Firebase' },
  USER_INFO: { id: 5, name: 'Thông tin tài khoản' },
  // FILTER_DATE_SEARCH_ORDER: { id: 4, name: "Thông tin Filter date tìm kiếm đơn hàng" },
});
