import Moment from 'moment';
import { commonsConfigs as configs } from '../configs'
import PropTypes from 'prop-types';
import { Alert } from 'react-native';

/**
 * Chuyen doi mot thoi gian sang dinh dang hh:mm ngay/thang/nam
 * @param {*} valueDate 
 */
export const dateTimeNowFormat = (format) => {
  return convertTimeDate(new Date(), format)
}
export const convertDateFormatVN = (valueDate) => {
  return convertTimeDate(valueDate, configs.FORMAT_DATE_VN)
}
export const convertTimeDateFormatVN = (valueDate) => {
  return convertTimeDate(valueDate, configs.FORMAT_HH_MM_DATE_VN)
}

export const convertFromTimeDateToDate = (valueDate) => {
  return convertTimeDate(valueDate, configs.FORMAT_DATE)
}

export const convertTimeDate = (valueDate, format) => {
  return Moment(valueDate).format(format);
}

export const dateTimeYesterdayFormat = (format) => {
  return Moment().subtract(1, 'days').format(format)
}
export const dateTimeLast7DayFormat = (format) => {
  return Moment().subtract(6, 'days').format(format)
}
export const dateTimeLast30DayFormat = (format) => {
  return Moment().subtract(29, 'days').format(format)
}
export const dateTimeLast90DayFormat = (format) => {
  return Moment().subtract(89, 'days').format(format)
}

export function getDateBeginningWeekNowFormat(formatDate) {
  return Moment().startOf('isoWeeks').format(formatDate)
}

export function getDateBeginningMonthNowFormat(formatDate) {
  return getDateBeginningMonthFormat(0, formatDate)
}

export function getDateBeginningMonthFormat(offset, formatDate) {
  return Moment().startOf('month').add(offset, 'months').format(formatDate)
}

/**
 * So sanh ngay voi ngay
 * @param {} date1 
 * @param {*} date2 
 */
export const checkDateAfterDateNow = (valueDate) => {
  return checkDateAfterDate(valueDate, dateTimeNowFormat(configs.FORMAT_DATE_VN), configs.FORMAT_DATE, configs.FORMAT_DATE_VN)
}
export const checkDateAfterDateNowFormat = (valueDate, formatDate) => {
  return checkDateAfterDate(valueDate, dateTimeNowFormat(formatDate), formatDate)
}

export const checkDateAfterDate = (valueDate1, valueDate2, formatDate1, formarDate2) => {
  var momentA = Moment(valueDate1, formatDate1, true).format()
  var momentB = Moment(valueDate2, formarDate2, true).format()

  if (momentA > momentB) return 1;
  else if (momentA < momentB) return -1;
  else return 0;
}

export const convertTextToNumber = (numberFormat, minus) => {
  if (!numberFormat) {
    return ''
  }
  numberFormat = convertNumberVNToStandard(numberFormat)
  // var parts = numberFormat.toString().split(",");
  numberFormat = numberFormat.replace(/[^0-9,.]/g, '')
  return numberFormat && convertNumberStandardToVN(numberFormat.toString())
}

export const checkIsNumberOrKyTu = (numberFormat) => {
  if (!numberFormat) {
    return false
  }
  let newText = '';
  numberFormat = numberFormat.toString()
  let regex = /[^a-z]/
  if (regex.test(numberFormat)) {
    return true;
  }
  // let numbers = '0123456789,-';
  // if (numbers.indexOf(numberFormat) > -1) {
  //   return true
  // }

  return false
}

export const formatNumberMoney = (numberFormat) => {
  if (!numberFormat) return '';

  const number = numberFormat.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  return number
}


export const convertNumberVNToStandard = (numberFormat) => {
  if (numberFormat) {
    numberFormat = numberFormat.toString().replace(/\./g, '')
    var parts = numberFormat.toString().split(",");
    return parts.join(".");
  }
  return 0
}

export const convertNumberStandardToVN = (numberFormat) => {
  if (numberFormat) {
    numberFormat = numberFormat.toString().replace(/\./g, ',')
    var parts = numberFormat.toString().split(",");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
  }
  return 0
}

export const eraseCharacterVietnameseAndSpecialCharacters = (str) => {
  str = str.replace(/[^A-Za-z0-9]/g, "")
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Combining Diacritical Marks
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // huyền, sắc, hỏi, ngã, nặng 
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); //mũ â (ê), mũ ă, mũ ơ (ư)
  return str;
}

export const eraseCharacterVietnamese = (str) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Combining Diacritical Marks
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // huyền, sắc, hỏi, ngã, nặng 
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); //mũ â (ê), mũ ă, mũ ơ (ư)
  return str;
}

export const eraseCharacterVietnameseToLowerCase = (str) => {
  str = str.trim()
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ|Ì|Í|Ị|Ỉ|Ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ|Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "y");
  str = str.replace(/đ|Đ/g, "d");
  // Combining Diacritical Marks
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // huyền, sắc, hỏi, ngã, nặng 
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); //mũ â (ê), mũ ă, mũ ơ (ư)
  return str.toLowerCase();
}

//Viet hoa chư cai dau
export const capitalizeTheFirstLetter = (str) => {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

export function validatePhoneNumber(phoneNumber) {
    var re = /^[0-9\+]{9,14}$/;
    return re.test(phoneNumber);
}

// export function validateNumberPhone(phoneNumber) {
//   if (phoneNumber && phoneNumber.charAt(0) !== "0") {
//     phoneNumber = "0".concat(phoneNumber)
//   }
//   var phoneno = /(09|08|07|05|03|02)+([0-9]{8,9})\b/g;
//   if (phoneNumber) {
//     var phone = phoneNumber.trim();
//     if (phone != '') {
//       if (phone.match(phoneno)) {
//         return phone;
//       }
//     }
//   }
//   return null;
// }

export function validateUserLogin(userName) {
  if (userName) {
    if (validationEmail(userName)) { //validate email
      return userName
    } else { //validate phone number
      userName = convertUniqueNumber(userName)
      if (userName.length === 6) {
        return userName
      } else if (validatePhoneLogin(userName)) {
        if (userName && userName.charAt(0) !== "0") {
          userName = "0".concat(userName)
        }
        return userName
      } else {
        showAlert('Tài khoản không đúng định dạng. Vui lòng kiểm tra lại!')
        return false
      }
    }

  } else {
    showAlert('Vui lòng nhập tài khoản đăng nhập!')
    return false
  }

}

export const convertUniqueNumber = (phoneNumber) => {
  phoneNumber = phoneNumber.replace(/[^0-9]/g, "")
  return phoneNumber;
}


export const validatePhoneLogin = (phoneNumber) => {
  if (phoneNumber && phoneNumber.charAt(0) !== "0") {
    phoneNumber = "0".concat(phoneNumber)
  }
  var phoneno = /(09|08|07|05|03|02|01)+([0-9]{8,9})\b/g;
  if (phoneNumber) {
    var phone = phoneNumber.trim();
    if (phone != '') {
      if (phone.match(phoneno)) {
        return true;
      }
    }
  }
  return false;
}


export function validationEmail(email) {
  if (!email || email === '') {
    return false;
  }
  let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
  if (regex.test(email)) {
    return true;
  }
  return false
}

export function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}


export function dynamicSortMultiple() {
  var props = arguments;
  return function (obj1, obj2) {
    var i = 0, result = 0, numberOfProperties = props.length;
    while (result === 0 && i < numberOfProperties) {
      result = dynamicSort(props[i])(obj1, obj2);
      i++;
    }
    return result;
  }
}

export function convertToArray(objectsArray) {
  let copyOfJsonArray = Array.from(objectsArray);
  let jsonArray = JSON.parse(JSON.stringify(copyOfJsonArray));
  return jsonArray;
}

export function showAlert(contentAlert, title) {
  Alert.alert(
    title ? title : configs.NAME_APP,
    contentAlert,
    [
      {
        text: 'Đồng ý', onPress: () => { }
      }
    ]
  );
}

export function findUrl(text) {
  // let regex = /(http|https|ftp|ftps)\:\/\/[-a-zA-Z0-9@:%._\+~#=]+\.[a-zA-Z]{2,3}(\/\S*)?/g;
  let text1 = text.replace(",", "")
  if (!text) return ""
  let regex = /(^|\s)((http|https|ftp|ftps)?:\/\/)?(www\.)?[-a-zA-Z0-9@:%.,_\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.,~#?&//=]*)($|\s)/g;
  let match;
  let result = "";
  let lastIndex = 0;
  while ((match = regex.exec(text)) != null) {
    result += text.substring(lastIndex, match.index);
    let url = match[0].trim();
    if (match[0].length > 30) {
      result += `<a href="${url}" target="_blank">${url.substring(0, 20)}...${url.substring(url.length - 7, url.length)}</a>`;
    } else {
      result += `<a href="${url}" target="_blank">${url}</a>`;

    }
    lastIndex = match.index + match[0].length;
  }
  result += text.substring(lastIndex, text.length);
  return this.findByPhoneNumber(result);

}
export function findByPhoneNumber(text) {
  // let regex = /(http|https|ftp|ftps)\:\/\/[-a-zA-Z0-9@:%._\+~#=]+\.[a-zA-Z]{2,3}(\/\S*)?/g;
  let regex = /(^|\s)(0([-., ]?[0-9]{1}){9,10}[-., ]?)($|\s)/g;
  let match;
  let result = "";
  let lastIndex = 0;
  while ((match = regex.exec(text)) != null) {
    let phoneNumber = match[0];
    result += text.substring(lastIndex, match.index);
    result += `<a href="tel:${phoneNumber.replace(" ", "")}" target="_blank">${phoneNumber}</a>`;
    lastIndex = match.index + match[0].length;
  }
  result += text.substring(lastIndex, text.length);
  return result;
}

export function getImageFromHTML(text) {
  if (text.includes('src="')) {
    try {
      let text1 = text.substring(text.indexOf('src="'), text.length)
      let text2 = text1.substring(5, text1.length)
      let text3 = text2.substring(0, text2.indexOf('"'))

      return text3
    } catch (error) { }
  }
  return ''
}

export function change_alias(alias) {
  if (alias === null || alias === undefined) {
      return '';
  }
  let str = alias;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/̀|́|̂|̃|̆|̉|̣|/g, '');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\'|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ');
  str = str.replace(/ + /g, ' ');
  str = str.trim();
  return str;
}
