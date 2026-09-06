package com.ecommerce.sportscenter.entity;


import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@RedisHash("Basket")
public class Basket {
    // Clé primaire identifiant le panier dans Redis
    @Id
    private String id;

    // Liste des articles contenus dans le panier (initialisée à vide)
    private List<BasketItem> items = new ArrayList<>();

    // Constructeur surchargé permettant de créer un panier directement avec un ID
    public Basket(String id) {
        this.id = id;
    }
}
