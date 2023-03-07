import { ADD, SUB } from "../actions/actions-type"
import { takeEvery } from "redux-saga/effects"
function* add() {
    console.log("add saga")
}

export function* watchAdd() {
    yield (takeEvery(ADD, add))
}

function* sub() {
    console.log("sub saga")
}

export function* watchSub() {
    yield (takeEvery(SUB, sub))
}
