import { configureStore, combineReducers } from "@reduxjs/toolkit";

import itemReducer from "./reducers/itemSlice";

const reducer = combineReducers({
  item: itemReducer,
});

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
