import { GET_LIST_PRODUCT, GET_FAVORITE_FOODS, GET_FOOD_DETAIL } from "../actions/actions-type"
import * as actionsType from "../actions/actions-type"
import { put, takeEvery, takeLatest } from "redux-saga/effects"
import api from "../api"
import * as action from "../actions"
import { isSuccess, handeResponseError } from "./handleResponse"
import { showAlert } from "../common/ultils"
function* getListProduct(params) {
    console.log("params: ", params)
    try {
        let result = yield api.getListProduct(params.params);
        if (isSuccess(result.status)) {
            yield put(action.getListProductSuccess(result.data.foods))
        } else { console.log("LAY DANH SACH THAT BAI") }
    } catch (error) {

        yield handeResponseError(error)
        // yield put(action.getListProductFail(error))        
    }
}

export function* watchGetListProduct() {
    yield (takeLatest(GET_LIST_PRODUCT, getListProduct))
}

function* getFavoriteFoods(params) {
    try {
        yield put(action.loading(true))
        let result = yield api.getFavoriteFoods();
        if (isSuccess(result.status)) {
            let data = result.data.result.favoriteFoods.map(item => {
                let food = item;
                food.key = food._id;
                return food
            })
            yield put(action.loading(false))
            yield put(action.getFavoriteFoodsSuccess(data))
        } else {
            showAlert("Thông báo", "Lấy danh sách thất bại")
        }
    } catch (error) {
        yield put(action.loading(false))
        yield handeResponseError(error)
    }
}

export function* watchGetFavoriteFoods() {
    yield (takeLatest(GET_FAVORITE_FOODS, getFavoriteFoods))
}

function* getFoodDetail(params) {
    try {
        let result = yield api.getFoodDetail(params.params);
        if (isSuccess(result.status)) {
            yield put(action.getFoodDetailSuccess(result.data.result))
        } else { showAlert("Thông báo", "Lấy danh sách thất bại") }
    } catch (error) {
        yield handeResponseError(error)
    }
}

export function* watchGetFoodDetail() {
    yield (takeLatest(GET_FOOD_DETAIL, getFoodDetail))
}

function* createFood(params) {
    try {        
        let result = yield api.createFood(params.params);        
        if (isSuccess(result.status)) {
            showAlert(result.data.message)
            yield put(action.createFoodSuccess(result.data.result))
        } else { showAlert("Thông báo", "Fail") }
    } catch (error) {
        console.log(params, "check2")
        yield handeResponseError(error)
    }
}

export function* watchCreateFood() {
    yield (takeLatest(actionsType.CREATE_FOOD, createFood))
}
