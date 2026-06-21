import { configureStore } from '@reduxjs/toolkit';

import { crmApi } from '../api/crmApi';
import sessionReducer from '../features/auth/sessionSlice';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    [crmApi.reducerPath]: crmApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(crmApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
