package com.ecommerce.sportscenter.repository;


import com.ecommerce.sportscenter.entity.Orderaggregate.Order;
import com.ecommerce.sportscenter.entity.Orderaggregate.OrderStatus;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Interface Repository gérant les opérations de persistance pour l'agrégat Order.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    /**
     * Recherche la liste des commandes associées à un identifiant de panier.
     */
    List<Order> findByBasketId(String basketId);

    /**
     * Recherche les commandes filtrées par leur statut (ex. PENDING, PAYMENT_RECEIVED).
     */
    List<Order> findByOrderStatus(OrderStatus orderStatus);

    /**
     * Recherche les commandes créées entre deux dates données.
     */
    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Requête JPQL personnalisée : Recherche les commandes contenant un produit
     * dont le nom contient la chaîne recherchée (insensible ou partielle).
     */
    @Query("SELECT o FROM Order o JOIN o.orderItems oi WHERE oi.itemOrdered.name LIKE CONCAT('%', :productName, '%')")
    List<Order> findByProductNameInOrderItems(@Param("productName") String productName);

    /**
     * Requête JPQL personnalisée : Recherche les commandes selon la ville
     * spécifiée dans l'adresse de livraison embarquée (@Embeddable).
     */
    @Query("SELECT o FROM Order o WHERE o.shippingAddress.city = :city")
    List<Order> findByShippingAddressCity(@Param("city") String city);
}
