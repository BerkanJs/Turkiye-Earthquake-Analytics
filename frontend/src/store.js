import { configureStore } from '@reduxjs/toolkit';
import earthquakeReducer from './features/earthquakeSlice';

export const store = configureStore({
  reducer: {
    earthquake: earthquakeReducer,
  },
});
