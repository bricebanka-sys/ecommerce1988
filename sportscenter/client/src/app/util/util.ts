import type { Basket } from "../models/basket";



/**
 * Récupère et analyse le panier stocké dans le localStorage.
 * Renvoie l'objet Basket s'il existe et est valide, sinon null.
 */
export function getBasketFromLocalStorage(): Basket | null {
    const storedBasket = localStorage.getItem('basket');
    
   if (storedBasket) {
        try {
            const parsedBasket: Basket = JSON.parse(storedBasket);
            return parsedBasket;
        } catch (error) {
            console.error("Error parsing basket from localStorage:", error);
            localStorage.removeItem('basket'); // Nettoyage en cas de données corrompues
            return null;
        }
    }
    
    return null;
}