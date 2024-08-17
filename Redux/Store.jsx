import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import userReducer from "./Slice/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import taskReducer from "./Slice/taskSlice";

const rootReducer = combineReducers({
    user:userReducer,
    task: taskReducer
})

const persistConfig = {
    key:'root',
    storage,
    version:1
}

const persistedReducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({serializableCheck:false})
})

export const persistor = persistStore(store)