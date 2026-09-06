import { createSlice } from "@reduxjs/toolkit";
import type { Basket } from "../../app/models/basket";


// 1. Définition de l'interface de l'état du panier
export interface BasketState {
  basket: Basket | null;
}

// 2. Définition de l'état initial
const initialState: BasketState = {
  basket: null,
};

// 3. Création de la Slice Redux
export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    // Action / Reducer pour définir ou mettre à jour le panier
    setBasket: (state, action) => {
      state.basket = action.payload;
    },
  },
});

// 4. Exportation de l'action générée
export const { setBasket } = basketSlice.actions;