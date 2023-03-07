import { ADD, SUB } from "./actions-type"
export const add = (data) => {    
    return ({
        type: ADD,
        payload: data
    })
}
export const sub = (data) => {    
    return ({
        type: SUB,
        payload: data
    })
}

