package com.ecommerce.sportscenter.entity.Orderaggregate;


// -----------------------Mesmin-Dev---------------------------------
/**
 * Représente les différents états possibles d'une commande dans le système.
 */
public enum OrderStatus {

    /** Commande créée, en attente de traitement ou de règlement */
    PENDING,

    /** Paiement validé et reçu avec succès */
    PAYMENT_RECEIVED,

    /** Échec ou refus de la transaction de paiement */
    PAYMENT_FAILED
}


// -----------------------Mesmin-Dev---------------------------------