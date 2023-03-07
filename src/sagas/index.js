import { watchAdd, watchSub } from "./counterSaga"
import * as watchProduct from "./productsSaga"
import { watchLogin, watchRegister } from "./authSaga"
import { all } from "redux-saga/effects"
export default function* rootSaga() {
    yield all([
        watchAdd(),
        watchSub(),
        watchLogin(),
        watchRegister(),
        watchProduct.watchGetListProduct(),
        watchProduct.watchGetFavoriteFoods(),
        watchProduct.watchGetFoodDetail(),
        watchProduct.watchCreateFood(),
    ])
}