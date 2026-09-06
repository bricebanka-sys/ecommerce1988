package com.ecommerce.sportscenter.repository;


import com.ecommerce.sportscenter.entity.Basket;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface de dépôt pour la gestion du stockage du panier dans Redis.
 * Étend CrudRepository spécifique aux bases de données NoSQL.
 */
@Repository
public interface BasketRepository extends CrudRepository<Basket, String> {
}
