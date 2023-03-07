import * as actions_type from "../actions/actions-type"

const initState = {
    productList: null,
    favoriteFoodList: [],
    foodDetail:{}
}

const productsReducer = (state = initState, action) => {
    const { type, data, error } = action
    switch (type) {
        case actions_type.GET_LIST_PRODUCT: {
            return Object.assign({}, state, {
                productList: null,
            });
        }
        case actions_type.GET_LIST_PRODUCT_SUCCESS: {
            return Object.assign({}, state, {
                productList: data,
            });
        }
        case actions_type.GET_LIST_PRODUCT_FAIL: {
            return error;
        }
        case actions_type.GET_FAVORITE_FOODS: {            
            return Object.assign({}, state, {
                favoriteFoodList: null,
            });
        }
        case actions_type.GET_FAVORITE_FOODS_SUCCESS: {
            return Object.assign({}, state, {
                favoriteFoodList: data,
            });
        }
        case actions_type.GET_FAVORITE_FOODS_FAIL: {
            return error;
        }
        case actions_type.GET_FOOD_DETAIL: {            
            return Object.assign({}, state, {
                foodDetail: {},
            });
        }
        case actions_type.GET_FOOD_DETAIL_SUCCESS: {
            return Object.assign({}, state, {
                foodDetail: data,
            });
        }
        case actions_type.GET_FOOD_DETAIL_FAIL: {
            return error;
        }
        case actions_type.CREATE_FOOD: {            
            return Object.assign({}, state, {
                createFoodData: {},
            });
        }
        case actions_type.CREATE_FOOD_SUCCESS: {
            return Object.assign({}, state, {
                createFoodData: data,
            });
        }
        case actions_type.CREATE_FOOD_FAIL: {
            return error;
        }
        default: {
            return state
        }
    }
}
export default productsReducer