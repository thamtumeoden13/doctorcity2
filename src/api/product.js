import axios from "./axiosInstance";
import { urlDefined } from '../configs'

export const getListProduct = async (prams) => {
    return axios.post(urlDefined.GET_LIST_PRODUCT.url, prams)
}

export const getFavoriteFoods = async () => {
    return axios.post(urlDefined.GET_FAVORITE_FOODS.url)
}

export const getFoodDetail = async (params) => {
    return axios.post(urlDefined.GET_FOOD_DETAIL.url, params)
}

export const createFood = async (params) => {
    return axios.post(urlDefined.CREATE_FOOD.url, params)
}