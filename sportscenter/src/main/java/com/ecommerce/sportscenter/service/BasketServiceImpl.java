package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.entity.Basket;
import com.ecommerce.sportscenter.entity.BasketItem;
import com.ecommerce.sportscenter.model.BasketItemResponse;
import com.ecommerce.sportscenter.model.BasketResponse;
import com.ecommerce.sportscenter.repository.BasketRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
public class BasketServiceImpl implements BasketService{

    // Injection de dépendance via le constructeur
    private final BasketRepository basketRepository;

    public BasketServiceImpl(BasketRepository basketRepository) {
        this.basketRepository = basketRepository;
    }

    @Override
    public BasketResponse getBasketById(String basketId) {
        log.info("Fetching basket by ID: {}", basketId);
        // Recherche du panier dans Redis (retourne un Optional)
        Optional<Basket> basketOptional = basketRepository.findById(basketId);
        if (basketOptional.isPresent()) {
            Basket basket = basketOptional.get();
            log.info("Fetched basket by ID: {}", basketId);

            // Conversion de l'entité vers le DTO de réponse
            return convertToBasketResponse(basket);
        } else {
            log.info("Basket with ID {} not found", basketId);
            return null;
        }
    }

    @Override
    public List<BasketResponse> getAllBaskets() {
        log.info("Fetching all baskets");
        // Récupération de tous les paniers depuis Redis (transtypage de Iterable vers List)
        List<Basket> basketList = (List<Basket>) basketRepository.findAll();
        // Transformation de chaque entité Basket en BasketResponse à l'aide de l'API Stream
        List<BasketResponse> basketResponses = basketList.stream()
                .map(this::convertToBasketResponse) // Méthode de conversion (à implémenter)
                .collect(Collectors.toList());
        log.info("Successfully fetched all baskets");
        return basketResponses;
    }


    @Override
    public BasketResponse createBasket(Basket basket) {
        log.info("Creating basket");
        Basket savedBasket = basketRepository.save(basket);

        log.info("Basket created with ID: {}", savedBasket.getId());
        return convertToBasketResponse(savedBasket);
    }

    @Override
    public void deleteBasketById(String basketId) {
        log.info("Deleting basket by ID: {}", basketId);
        basketRepository.deleteById(basketId);
        log.info("Deleted basket by ID: {}", basketId);
    }

    private BasketResponse convertToBasketResponse(Basket basket) {

        // 1. Contrôle de sécurité sur la valeur null
        if (basket == null) {
            return null;
        }
        // 2. Conversion de la liste d'articles imbriqués (BasketItem -> BasketItemResponse)
        List<BasketItemResponse> itemResponses = basket.getItems().stream()
                .map(this::convertToBasketItemResponse) // Référence de méthode
                .collect(Collectors.toList());
        // 3. Construction du DTO de réponse à l'aide du Pattern Builder
        return BasketResponse.builder()
                .id(basket.getId())
                .items(itemResponses)
                .build();
    }

    /**
     * Convertit une entité BasketItem en son DTO BasketItemResponse
     * en mappant l'ensemble des propriétés via le Pattern Builder.
     */
    private BasketItemResponse convertToBasketItemResponse(BasketItem basketItem) {

        if (basketItem == null) {
            return null;
        }

        return BasketItemResponse.builder()
                .id(basketItem.getId())
                .name(basketItem.getName())
                .description(basketItem.getDescription())
                .price(basketItem.getPrice())
                .pictureUrl(basketItem.getPictureUrl())
                .productBrand(basketItem.getProductBrand())
                .productType(basketItem.getProductType())
                .quantity(basketItem.getQuantity())
                .build();
    }
}
