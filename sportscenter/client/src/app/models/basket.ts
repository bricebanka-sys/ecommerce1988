
/**
 * Représente le panier complet stocké et synchronisé avec Redis.
 */
export interface Basket {
    id: string;
    items: BasketItem[];
}

/**
 * Représente un article individuel dans le panier d'achat.
 */
export interface BasketItem {
    id: number;
    name: string;
    description: string;
    price: number;
    pictureUrl: string;
    productBrand: string;
    productType: string;
    quantity: number;
}

/**
 * Représente le récapitulatif des montants du panier.
 */
export interface BasketTotals {
    shipping: number;
    subtotal: number;
    total: number;
}