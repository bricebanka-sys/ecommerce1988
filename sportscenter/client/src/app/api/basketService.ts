import axios from "axios";
import type { Basket, BasketItem, BasketTotals } from "../models/basket";
import type { Product } from "../models/product";
import type { AppDispatch } from "../store/configureStore";
import { setBasket } from "../../features/basket/basketSlice";
import type { Dispatch } from "@reduxjs/toolkit";
import { createId } from '@paralleldrive/cuid2';



class BasketService {

  // URL de base pour l'API du panier(basket)
  apiUrl = `${import.meta.env.VITE_API_URL}/baskets`;

  // 1. Récupération du panier depuis l'API distante
  async getBasketFromApi(){
    try {
      const response = await axios.get<Basket>(`${this.apiUrl}`);
      return response.data;
    } catch (error) {
        throw new Error('Failed to fetch basket from API.', { cause: error });
    }
  }

  // 2. Récupération du panier depuis le Local Storage du navigateur
  async getBasket(){
    try {
      const basket = localStorage.getItem('basket');
      if (basket) {
        return JSON.parse(basket) as Basket;
      }else {
        throw new Error('Basket not found in local storage');
      }
    } catch (error) {
        throw new Error(`Failed to fetch basket from local storage: ${error}`, { cause: error });
    }
  }


  // 3. Ajout d'un produit au panier
  async addItemToBasket(
    item: Product, 
    quantity = 1, 
    dispatch: AppDispatch) {
    try {
      // Étape A : Récupération du panier existant ou création d'un nouveau
      let basket = this.getCurrentBasket();
      if (!basket) {
        basket = await this.createBasket();
      }

      // Étape B : Mapping du type Product vers le type BasketItem
      const itemToAdd = this.mapProductToBasket(item);

      // Étape C : Insertion ou mise à jour (Upsert) des articles dans le panier
      basket.items = this.upsertItems(basket.items, itemToAdd, quantity);

      // Étape D : Enregistrement du panier et dispatch vers le Store Redux    
      this.setBasket(basket, dispatch);
      

      // Étape E : Calcul des totaux et retour du résultat
      const totals = this.calculateTotals(basket);
      return { basket, totals };

    } catch (error) {
      throw new Error('Failed to add item to basket', { cause: error });
    }
  }


  /**
   * Supprime un article du panier local par son ID et met à jour le Store Redux.
   */
  public async remove(itemId: number, dispatch: Dispatch) {
      // 1. Récupération du panier courant
    const basket = this.getCurrentBasket();

    if (basket){
      const itemIndex = basket.items.findIndex(p => p.id === itemId);
      if (itemIndex !== -1) {
        basket.items.splice(itemIndex, 1);
        this.setBasket(basket, dispatch);
      }
      // 5. Si le panier est désormais vide, purge du Local Storage
      if (basket.items.length === 0) {
        localStorage.removeItem('basket_id');
        localStorage.removeItem('basket');
      }
    }
  }

// ==========================================
// INCRÉMENTATION DE LA QUANTITÉ
// ==========================================

public async incrementItemQuantity(itemId: number, quantity = 1, dispatch: Dispatch){
    // 1. Récupération du panier courant
    const basket = this.getCurrentBasket();
    if (!basket) return;

    // 2. Recherche de l'article dans la collection du panier
    const item = basket.items.find((p) => p.id === itemId);

    if (item) {
      // 3. Incrémentation de la quantité
      item.quantity += quantity;

      // 4. Sécurité (Dry check) : Empêcher toute quantité négative
      if (item.quantity <= 0) {
        item.quantity = 1;
      }

      // 5. Persistance du panier et mise à jour de Redux
      this.setBasket(basket, dispatch);
    }
  }

// ==========================================
// DÉCRÉMENTATION DE LA QUANTITÉ
// ==========================================

public async decrementItemQuantity(
    itemId: number,
    quantity = 1,
    dispatch: Dispatch
  ){
    // 1. Récupération du panier courant
    const basket = this.getCurrentBasket();
    if (!basket) return;

    // 2. Recherche de l'article dans le panier
    const item = basket.items.find((p) => p.id === itemId);

    // 3. Vérification de l'existence et du seuil minimal (quantité > 1)
    if (item && item.quantity > 1) {
      item.quantity -= quantity;

      // 4. Persistance du panier et mise à jour de Redux   
      this.setBasket(basket, dispatch);      
    }
  }


  /**
   * Supprime le panier de la base de données / Redis via l'API distante.
   */
  public async deleteBasket(basketId: string): Promise<void> {
    try {
      // Envoi de la requête DELETE à l'API
      await axios.delete(`${this.apiUrl}/${basketId}`);

      // Nettoyage local
      localStorage.removeItem('basket_id');
      localStorage.removeItem('basket');
    } catch (error) {
        throw new Error('Échec de la suppression du panier', { cause: error });
    }
  }

  /**
   * Persiste le panier via l'API, le Local Storage et met à jour Redux.
   */
  public async setBasket(basket: Basket, dispatch: AppDispatch): Promise<void> {
    try {
      // Synchronisation HTTP POST vers l'API distante
      await axios.post<Basket>(this.apiUrl, basket);

      // Persistance dans le Local Storage du navigateur
      localStorage.setItem('basket', JSON.stringify(basket));

      // Mise à jour de l'état global Redux via le reducer setBasket
      dispatch(setBasket(basket));
    } catch (error) {
      throw new Error('Failed to update basket', { cause: error });
    }
  }

  /**
   * Récupère de façon synchrone le panier présent dans le Local Storage.
   */
  private getCurrentBasket(): Basket | null {
    const basket = localStorage.getItem('basket');
    if (basket) {
      return JSON.parse(basket) as Basket;
    }
    return null;
  }

  /**
   * Initialise un nouveau panier et le sauvegarde localement.
   */
  private async createBasket(): Promise<Basket> {
    try {
      // Génération d'un ID temporaire (ex: uuid v4 ou ID généré) => à revoir!!
      const newBasket: Basket = {
        id: createId(), // Fonction fictive pour générer un ID unique
        items: []
      };

      localStorage.setItem('basket_id', JSON.stringify(newBasket));
      return newBasket;
    } catch (error) {
        throw new Error('Failed to create basket', { cause: error });
    }
  }


  /**
   * Mappe les propriétés d'un Product vers un BasketItem (Pattern Builder / Mapper).
   */
  private mapProductToBasket(item: Product): BasketItem {
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      pictureUrl: item.pictureUrl,
      productBrand: item.productBrand,
      productType: item.productType,
      quantity: 0 // La quantité finale sera attribuée lors de l'upsert
    };
  }

  /**
   * Gère l'ajout (push) ou la mise à jour d'incrément (plus-égal) de la quantité.
   */
  private upsertItems(
    items: BasketItem[], 
    itemToAdd: BasketItem, 
    quantity: number
  ): BasketItem[] {
    // Recherche si l'article existe déjà dans la liste
    const existingItem = items.find(x => x.id === itemToAdd.id);

    if (existingItem) {
      // Incrémentation de la quantité existante
      existingItem.quantity += quantity;
    } else {
      // Définition de la quantité initiale et ajout au tableau
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    }

    return items;
  }

  /**
   * Calcule le sous-total, les frais de port et le total général.
   */
  private calculateTotals(basket: Basket): BasketTotals {
    const shipping = 0; // Calcul des frais de livraison (extensible)

    // Calcul du sous-total avec la méthode Array.prototype.reduce()
    const subtotal = basket.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const total = subtotal + shipping;

    return { shipping, subtotal, total };
  }
  
}

export const basketService = new BasketService();