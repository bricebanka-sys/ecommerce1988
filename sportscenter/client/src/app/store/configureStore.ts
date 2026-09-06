
// Sera implémenté sous peu
import { configureStore } from '@reduxjs/toolkit';
import {  useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { basketSlice } from '../../features/basket/basketSlice';
import {accountSlice} from '../../features/account/accountSlice';
// 1. Configuration du Redux Store
export const store = configureStore({
  reducer: {
    basket: basketSlice.reducer, // Associe le reducer de la tranche "basket"
    account: accountSlice.reducer, // Associe le reducer de la tranche "account"
  },
});

// 2. Extractions des Types TypeScript pour le Store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 3. Hooks personnalisés et typés pour l'application
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;