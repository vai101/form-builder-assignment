// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import formBuilderReducer from '../Features/formBuilderSlice';
import formsReducer from '../Features/formsSlice';

export const store = configureStore({
  reducer: {
    formBuilder: formBuilderReducer,
    forms: formsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;