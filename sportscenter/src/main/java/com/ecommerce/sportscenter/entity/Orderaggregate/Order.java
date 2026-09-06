package com.ecommerce.sportscenter.entity.Orderaggregate;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Entité racine (Aggregate Root) représentant une commande dans le système.
 */
@Entity
@Table(name = "Orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "Basket_Id")
    private String basketId;

    /**
     * Adresse de livraison intégrée directement dans la table 'orders'.
     */
    @Embedded
    private ShippingAddress shippingAddress;

    @Column(name = "Order_Date")
    private LocalDateTime orderDate = LocalDateTime.now();

    /**
     * Relation 1-N vers les articles de la commande.
     * La suppression ou sauvegarde d'une commande se propage à ses articles (CascadeType.ALL).
     */
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    @Column(name = "sub_Total")
    private Double subTotal;

    @Column(name = "Delivery_Fee")
    private Long deliveryFee;

    /**
     * Stocke le statut sous forme de chaîne de caractères (ex. 'PENDING') en BDD.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "Order_Status")
    private OrderStatus orderStatus = OrderStatus.PENDING;

    /**
     * Méthode utilitaire pour calculer le total global de la commande.
     *
     * @return la somme du sous-total et des frais de livraison.
     */
    public Double getTotal() {
        return getSubTotal() + getDeliveryFee();
    }
}
