import * as urlDefined from "../configs/urlDefined"
import { models } from "../models"
import axios from "axios";

const instance = axios.create({
    baseURL: urlDefined.baseURL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    timeout: 60000
})
instance.interceptors.request.use(async request => {
    if (models.getToken()) {
        let token = models.getToken();
        request.headers = {
            'x-access-token': token
        };
        console.log(token, request)
    }
    // __DEV__ && console.log("Request: ", request.url)    
    return request
});

export default instance