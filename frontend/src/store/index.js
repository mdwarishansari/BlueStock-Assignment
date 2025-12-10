import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import companyReducer from "./slices/companySlice";
import uiReducer from "./slices/uiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
