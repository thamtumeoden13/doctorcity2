// export const baseURL = "http://localhost:1998/api/v1"
export const baseURL = "http://172.16.4.127:1999/api/v1"

//Auth
export const LOGIN = { name: "Login", url: '/user/signin' }
export const REGISTER = { name: "Register", url: '/user/signup' }
export const LOGOUT = { name: "Logout", url: '/user/signout' }

//CHOTDON123
export const GET_LIST_PRODUCT = { name: "Get product list of shop", url: '/food/get_foods' }

//Hom nay an gi
export const GET_FAVORITE_FOODS = { name: "Get favorite foods", url: '/food/getFavoristFoodList' }
export const GET_FOOD_DETAIL = { name: "Get food detail", url: '/food/getFoodById' }
export const CREATE_FOOD = { name: "Create food", url: '/food/create_food' }

