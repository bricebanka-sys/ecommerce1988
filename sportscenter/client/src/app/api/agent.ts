
import axios, { type AxiosResponse, AxiosError } from 'axios';
import { router } from '../router/Routes'; // Import du routeur global pour les redirections
import { toast } from 'react-toastify';
import { basketService } from './basketService';
import type { Product } from '../models/product';
import type { Dispatch } from '@reduxjs/toolkit';
import type { Basket } from '../models/basket';

// Fonction utilitaire permettant de créer un délai artificiel (ex: 1000 ms = 1 seconde)
const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

// 1. Définition de l'URL de base du backend Spring Boot
// axios.defaults.baseURL = 'http://localhost:8081/api/';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';


// Intercepteur de REQUÊTE : attache automatiquement le token JWT à chaque appel sortant
axios.interceptors.request.use((config) => {
  const userString = localStorage.getItem('user');
  if (userString) {
    const user = JSON.parse(userString);
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

// Configuration de l'intercepteur de réponse Axios
axios.interceptors.response.use(
  async (response: AxiosResponse) => {

    // Attente artificielle avant de retourner la réponse
    await sleep();
 
    // Si la requête réussit sans erreur, on retourne simplement la réponse
    return response;
  },
  (error: AxiosError) => {
    // Capture et déstructuration de la réponse d'erreur via la puissance du typage TypeScript
    const { status } = error.response as AxiosResponse;

    // Analyse du code de statut HTTP avec l'instruction switch
    switch (status) {
      case 401:
        console.error('401 Error : Resource not found');
        // Gestion de l'erreur 401 (ex: notification toast ou redirection vers /login)
        break;

      case 404:
        toast.error('404 Error : Resource not found');
        // Redirection programmatique vers la route d'erreur 404
        router.navigate('/not-found');
        break;

      case 500:
        toast.error('500 Error : Internal server error occured');
        // Redirection programmatique vers la route d'erreur 500
        router.navigate('/server-error');
        break;

      default:        
        break;
    }

    // Rejet de la promesse pour transmettre l'erreur au code appelant si nécessaire
    return Promise.reject(error.response || error.message);
  }
);

// 2. Extraction du corps de la réponse (Response Body)
const responseBody = (response: AxiosResponse) => response.data;


const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

// Service regroupant les requêtes liées au catalogue / magasin
const Store = {
  // URL de base de l'API Spring Boot
   apiUrl: 'http://localhost:8081/api/products',
  list: (page: number = 1, size: number = 10, brandId?: number, typeId?: number, url?: string) => {

    let requestUrl = url || `products?page=${page-1}&size=${size}`;

    // Ajout du paramètre brandId s'il est présent
    if (brandId !== undefined) {
      requestUrl += `&brandId=${brandId}`;
    }

    // Ajout du paramètre typeId s'il est présent
    if (typeId !== undefined) {
      requestUrl += `&typeId=${typeId}`;
    }

    return requests.get(requestUrl);
  
  },

  // Détail d'un produit par ID
  details: (id: number) => requests.get(`products/${id}`),

  // Récupération des types (catégories) avec injection de l'option globale "All"
  types: () => requests.get('products/types').then(types => [
    { id: 0, name: 'All' }, 
    ...types
  ]),

  // Récupération des marques avec injection de l'option globale "All"
  brands: () => requests.get('products/brands').then(brands => [
    { id: 0, name: 'All' }, 
    ...brands
  ]),

  // Recherche par mot-clé (Utilisation des template literals / interpolations de chaînes)
  search: (keyword: string) => requests.get(`products?keyword=${keyword}`),
};

const Basket = {
  /**
   * Récupère le panier courant.
   */
  get: async () => {
    try {
      return await basketService.getBasket();
    } catch (error) {
      console.error('Failed to get basket :', error);
      throw error;
    }
  },

  /**
   * Ajoute un produit au panier et met à jour le Store Redux.
   */
  addItem: async (product: Product, dispatch: Dispatch) => {
    try {
      const result = await basketService.addItemToBasket(product, 1, dispatch);
      console.log(result);
      return result;
    } catch (error) {
        console.error('Failed to add new item to basket :', error);
        throw error;
    }
  },
  
  /**
   * Supprime un article du panier par son identifiant.
   */
  removeItem: async (itemId: number, dispatch: Dispatch) => {
    try {
      return await basketService.remove(itemId, dispatch);
    }catch (error) {
        console.error('Failed to remove an item from basket :', error);
        throw error;
    }
  },

    incrementItemQuantity: async (itemId: number, quantity: number = 1, dispatch: Dispatch) => {
      try {
          await basketService.incrementItemQuantity(itemId, quantity, dispatch);
      } catch (error) {
          console.error("Failed to increment item quantity in basket:", error);
          throw error;
      }
  },
  decrementItemQuantity: async (itemId: number, quantity: number = 1, dispatch: Dispatch) => {
      try {
          await basketService.decrementItemQuantity(itemId, quantity, dispatch);
      } catch (error) {
          console.error("Failed to decrement item quantity in basket:", error);
          throw error;
      }
  },
  setBasket: async (basket: Basket, dispatch: Dispatch) => {
      try {
          await basketService.setBasket(basket, dispatch);
      } catch (error) {
          console.error("Failed to set basket:", error);
          throw error;
      }
  },
  deleteBasket: async (basketId: string) => {
      try {
          await basketService.deleteBasket(basketId);
      } catch(error) {
          console.log("Failed to delete the Basket");
          throw error;
      }
  }
}

// ============================================================================
// Module Account : Appels API liés à l'authentification et au compte utilisateur
// ============================================================================
const Account = {
    // Méthode de connexion (Login)
    // Envoie une requête POST vers /api/auth/login avec les identifiants (username, password)
    login: (values: Record<string, unknown>) => requests.post('auth/login', values),

    // 🔧 NOUVELLE MÉTHODE — appelle l'endpoint d'inscription
    register: (values: Record<string, unknown>) => requests.post('auth/register', values),

    // Méthode pour récupérer les détails de l'utilisateur actuellement connecté via son JWT
    // currentUser: () => requests.get('auth/user'),
};


// Définition de l'objet de gestion des commandes (Orders)
const Orders = {
  // 1. Récupération de la liste de toutes les commandes de l'utilisateur
  list: () => requests.get('orders'),

  // 2. Récupération d'une commande spécifique via son ID
  fetch: (id: number) => requests.get(`orders/${id}`),

  // 3. Soumission / Création d'une nouvelle commande (POST)
  create: (values: Record<string, unknown>) => requests.post('orders', values),
};

// Exportation globale des modules de l'agent
const agent = {
  Store, // Module produit
  Basket, // Module panier
  Account, //module d'authentification
  Orders // Module de gestion des commandes
};

export default agent;