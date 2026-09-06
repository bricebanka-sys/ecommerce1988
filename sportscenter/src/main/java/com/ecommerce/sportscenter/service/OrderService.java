package com.ecommerce.sportscenter.service;


import com.ecommerce.sportscenter.model.OrderDto;
import com.ecommerce.sportscenter.model.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Interface définissant les opérations métier liées à la gestion des commandes.
 */
public interface OrderService {

    /**
     * Récupère les détails d'une commande spécifique par son identifiant unique.
     *
     * @param orderId L'identifiant de la commande.
     * @return Le DTO OrderResponse correspondant.
     */
    OrderResponse getOrderById(Integer orderId);

    /**
     * Récupère la liste complète de toutes les commandes.
     *
     * @return Une liste de DTOs OrderResponse.
     */
    List<OrderResponse> getAllOrders();

    Page<OrderResponse> getAllOrders(Pageable pageable);

    /**
     * Crée et enregistre une nouvelle commande dans le système.
     *
     * @param orderDto Les données de création de la commande.
     * @return L'identifiant (ID) de la commande créée.
     */
    Integer createOrder(OrderDto orderDto);

    /**
     * Supprime une commande à partir de son identifiant.
     *
     * @param orderId L'identifiant de la commande à supprimer.
     */
    void deleteOrder(Integer orderId);
}
