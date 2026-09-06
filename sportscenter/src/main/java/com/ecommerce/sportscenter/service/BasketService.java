package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.entity.Basket;
import com.ecommerce.sportscenter.model.BasketResponse;

import java.util.List;

public interface BasketService {

    // Récupérer un panier par son ID (Méthode la plus sollicitée)
    BasketResponse getBasketById(String basketId);

    // Récupérer l'ensemble des paniers
    List<BasketResponse> getAllBaskets();

    // Créer ou mettre à jour un panier
    BasketResponse createBasket(Basket basket);

    // Supprimer un panier (ex: après validation de la commande / checkout)
    void deleteBasketById(String basketId);
}
