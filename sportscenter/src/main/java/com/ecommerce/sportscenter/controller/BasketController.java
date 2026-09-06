package com.ecommerce.sportscenter.controller;


import com.ecommerce.sportscenter.entity.Basket;
import com.ecommerce.sportscenter.entity.BasketItem;
import com.ecommerce.sportscenter.model.BasketItemResponse;
import com.ecommerce.sportscenter.model.BasketResponse;
import com.ecommerce.sportscenter.service.BasketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

// -----------------------Mesmin-Dev---------------------------------
@RestController
@RequestMapping("/api/baskets")
public class BasketController {

    private final BasketService basketService;

    // Injection de dépendance via le constructeur
    public BasketController(BasketService basketService) {
        this.basketService = basketService;
    }

    /**
     * Endpoint pour récupérer la liste de tous les paniers.
     * HTTP GET /api/baskets
     */
    @GetMapping
    public List<BasketResponse> getAllBaskets() {
        return basketService.getAllBaskets();
    }

    /**
     * Endpoint pour récupérer un panier spécifique par son ID.
     * HTTP GET /api/baskets/{basketId}
     */
    @GetMapping("/{basketId}")
    public BasketResponse getBasketById(@PathVariable String basketId) {
        return basketService.getBasketById(basketId);
    }

    /**
     * Endpoint pour supprimer un panier par son ID.
     * HTTP DELETE /api/baskets/{basketId}
     */
    @DeleteMapping("/{basketId}")
    public void deleteBasketById(@PathVariable String basketId) {
        basketService.deleteBasketById(basketId);
    }

    /**
     * Endpoint HTTP POST pour créer ou mettre à jour un panier.
     * Consomme le JSON fourni dans le corps de la requête (@RequestBody).
     */
    @PostMapping
    public ResponseEntity<BasketResponse> createBasket(@RequestBody BasketResponse basketResponse) {
        // 1. Conversion du DTO de réponse (basketResponse) en entité Basket
        Basket basket = convertToBasketEntity(basketResponse);

        // 2. Persistance dans Redis via la couche service
        BasketResponse createdBasket = basketService.createBasket(basket);

        // 3. Retour du DTO avec le statut HTTP 201 CREATED
        return new ResponseEntity<>(createdBasket, HttpStatus.CREATED);
    }

    private Basket convertToBasketEntity(BasketResponse basketResponse) {

        if (basketResponse == null) {
            return null;
        }

        Basket basket = new Basket();
        basket.setId(basketResponse.getId());
        basket.setItems(mapBasketItemResponsesToEntity(basketResponse.getItems()));
        return basket;
    }

    private List<BasketItem> mapBasketItemResponsesToEntity(List<BasketItemResponse> itemResponses) {
      return itemResponses.stream()
              .map(this::convertToBasketItemEntity)
              .collect(Collectors.toList());
    }

    private BasketItem convertToBasketItemEntity(BasketItemResponse itemResponse) {
        if (itemResponse == null) {
            return null;
        }

        BasketItem basketItem = new BasketItem();
        basketItem.setId(itemResponse.getId());
        basketItem.setName(itemResponse.getName());
        basketItem.setDescription(itemResponse.getDescription());
        basketItem.setPrice(itemResponse.getPrice());
        basketItem.setPictureUrl(itemResponse.getPictureUrl());
        basketItem.setProductBrand(itemResponse.getProductBrand());
        basketItem.setProductType(itemResponse.getProductType());
        basketItem.setQuantity(itemResponse.getQuantity());

        return basketItem;
    }
}
