import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./authSlice";
import socketSlice from "./socketSlice";
import contactSlice from "./contactSlice";

const socketTransform = createTransform(
  (inboundState: any) => {
    const { instance, ...rest } = inboundState;
    return rest;
  },
  null,
  { whitelist: ["socket"] } 
);

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  transforms: [socketTransform],
};

const rootReducer = combineReducers({
  auth: authSlice,
  socket: socketSlice,
  contact: contactSlice
});

type RootState = Partial<{
  auth: ReturnType<typeof authSlice>;
  socket: ReturnType<typeof socketSlice>;
}>;

//@ts-expect-error idk wtf is the problem
const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppStore = typeof store;
export default store;