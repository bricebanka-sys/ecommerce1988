package com.ecommerce.sportscenter.entity.Orderaggregate;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// -----------------------Mesmin-Dev---------------------------------

/**
 * Représente un article individuel (une ligne) au sein d'une commande.
 */
@Entity
@Table(name = "orderItem")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    /**
     * Contient l'instantané du produit au moment de l'achat (productId, name, pictureUrl).
     * Mappé directement dans la table 'order_item' grâce à @Embedded.
     */
    @Embedded
    private ProductItemOrdered itemOrdered;

    @Column(name = "Price")
    private Long price;

    @Column(name = "Quantity")
    private Integer quantity;

    /**
     * Relation N-1 vers la commande parente.
     * Chargement paresseux (FetchType.LAZY) pour optimiser les performances.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
}
