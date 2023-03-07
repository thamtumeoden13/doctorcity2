import * as actionsType from "./actions-type"
export const getListProduct = (params) => {
    return ({ type: actionsType.GET_LIST_PRODUCT, params })
};

export const getListProductSuccess = (data) => {
    return ({ type: actionsType.GET_LIST_PRODUCT_SUCCESS, data })
};

export const getListProductFail = (error) => {
    return ({ type: actionsType.GET_LIST_PRODUCT_FAIL, error })
};

export const getFavoriteFoods = (params) => {
    return ({ type: actionsType.GET_FAVORITE_FOODS, params })
};

export const getFavoriteFoodsSuccess = (data) => {
    return ({ type: actionsType.GET_FAVORITE_FOODS_SUCCESS, data })
};

export const getFavoriteFoodsFail = (error) => {
    return ({ type: actionsType.GET_FAVORITE_FOODS_FAIL, error })
};

export const getFoodDetail = (params) => {
    return ({ type: actionsType.GET_FOOD_DETAIL, params })
};

export const getFoodDetailSuccess = (data) => {
    return ({ type: actionsType.GET_FOOD_DETAIL_SUCCESS, data })
};

export const getFoodDetailFail = (error) => {
    return ({ type: actionsType.GET_FOOD_DETAIL_FAIL, error })
};

export const createFood = (params) => {
    return ({ type: actionsType.CREATE_FOOD, params })
};

export const createFoodSuccess = (data) => {
    return ({ type: actionsType.CREATE_FOOD_SUCCESS, data })
};

export const createFoodFail = (error) => {
    return ({ type: actionsType.CREATE_FOOD_FAIL, error })
};

