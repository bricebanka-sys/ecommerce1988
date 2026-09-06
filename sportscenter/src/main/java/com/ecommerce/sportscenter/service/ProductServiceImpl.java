package com.ecommerce.sportscenter.service;


import com.ecommerce.sportscenter.entity.Product;
import com.ecommerce.sportscenter.exceptions.ProductNotFoundException;
import com.ecommerce.sportscenter.model.ProductResponse;
import com.ecommerce.sportscenter.repository.ProductRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    // Injection par constructeur
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public ProductResponse getProductById(Integer productId) {
        log.info("Fetching Product by Id : {}", productId);
        // 1. Recherche dans la base de données ou levée d'exception
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product with Id " + productId + " doesn't exist."));
        // 2. Conversion de l'entité en DTO ProductResponse
        ProductResponse productResponse = convertToProductResponse(product);

        log.info("Fetched Product by Product Id: {}", productId);
        return productResponse;
    }

    @Override
    public Page<ProductResponse> getProducts(Pageable pageable, String keyword, Integer brandId, Integer typeId) {
        log.info("Fetching Products !!");

        // 1. Initialisation d'une spécification neutre (WHERE 1=1)
        Specification<Product> spec = (root, query, criteriaBuilder) -> null;

        // 2. Filtre par Marque (brandId)
        if (brandId != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("brand").get("id"), brandId)
            );
        }

        // 3. Filtre par Type (typeId)
        if (typeId != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("type").get("id"), typeId)
            );
        }

        // 4. Filtre par Mot-Clé / Nom (keyword)
        if (keyword != null && !keyword.trim().isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("name")),
                            "%" + keyword.toLowerCase() + "%"
                    )
            );
        }
        log.info("Fetched All Products !!!.");

        // Map vers DTO Response
        return productRepository.findAll(spec, pageable)
                .map(this::convertToProductResponse);
    }

    // --- METHODE PRIVEE UTILITAIRE (MAPPING) ---

    private ProductResponse convertToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .pictureUrl(product.getPictureUrl())
                .productBrand(product.getBrand().getName()) // Extraction du nom de la marque
                .productType(product.getType().getName())   // Extraction du nom du type
                .build();
    }
}
