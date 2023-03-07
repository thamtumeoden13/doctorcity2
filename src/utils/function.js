
const rad = (x) => {
    return x * Math.PI / 180;
};

export const getDistance = (p1, p2) => {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.lat - p1.lat);
    var dLong = rad(p2.lng - p1.lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
};

export const formatMoney = (amount, decimalCount = 2, decimal = ".", thousands = ",", symbolSign) => {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";
        const currencySymbol = symbolSign ? symbolSign : ""
        let amountConvert = amount.toString().replace(new RegExp(thousands, 'g'), "")
        let i = parseInt(amountConvert = Math.abs(Number(amountConvert) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;
        return currencySymbol + negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amountConvert - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.error('formatMoney', e)
        return 'null'
    }
};

export const removeAccents = (str) => {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

function pad(number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

export const get_vietnam_time = (time) => {
    const now = new Date(time.getTime() + 25200000);
    return pad(now.getFullYear()) + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate()) + "T" + pad(now.getHours()) + ":" + pad(now.getMinutes());
}

export function ConvertStr(intNum) {
    if (intNum > 9)
        return intNum.toString();
    return "0" + intNum.toString();
}

export function createIV(d = new Date()) {
    const dateString = `${d.getFullYear().toString()}-${ConvertStr(d.getMonth() + 1)}-${ConvertStr(d.getDate())}T${ConvertStr(d.getHours())}:${ConvertStr(d.getMinutes())}:${ConvertStr(d.getSeconds())}`;
    return dateString;
}