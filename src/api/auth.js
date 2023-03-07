import axios from "./axiosInstance";
import { urlDefined } from '../configs'

export const login = async (params) => {    
    return axios.post(urlDefined.LOGIN.url, params)
}
export const register = async (params) => {
    return axios.post(urlDefined.REGISTER.url, params)
}