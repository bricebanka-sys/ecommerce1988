package com.ecommerce.sportscenter.entity;


import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.redis.core.RedisHash;

// -----------------------Mesmin-Dev---------------------------------

@Data
@RedisHash("BasketItem")
public class BasketItem {


    // Identifiant unique de l'article (ex: ID du produit)
    @Id
    private Integer id;

    // Nom du produit
    private String name;

    // Description détaillée du produit
    private String description;

    // Prix du produit (exprimé en centimes ou unités de base)
    private Long price;

    // Lien vers l'image du produit
    private String pictureUrl;

    // Marque du produit
    private String productBrand;

    // Catégorie / Type de produit
    private String productType;

    // Quantité commandée pour cet article
    private Integer quantity;
}
