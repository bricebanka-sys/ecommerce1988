package com.ecommerce.sportscenter.controller;

import com.ecommerce.sportscenter.model.BrandResponse;
import com.ecommerce.sportscenter.model.ProductResponse;
import com.ecommerce.sportscenter.model.TypeResponse;
import com.ecommerce.sportscenter.service.BrandService;
import com.ecommerce.sportscenter.service.ProductService;
import com.ecommerce.sportscenter.service.TypeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


// -----------------------Mesmin-Dev---------------------------------

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final BrandService brandService;
    private final TypeService typeService;


    // Injection explicite par constructeur
    public ProductController(ProductService productService, BrandService brandService, TypeService typeService) {
        this.productService = productService;
        this.brandService = brandService;
        this.typeService = typeService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable("id") Integer productId) {
        // Appelle la couche service pour récupérer les données du produit
        ProductResponse productResponse = productService.getProductById(productId);

        // Retourne la réponse avec le statut HTTP 200 OK
        return new ResponseEntity<>(productResponse, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<Page<ProductResponse>> getProducts(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "brandId", required = false) Integer brandId,
            @RequestParam(name = "typeId", required = false) Integer typeId,
            @RequestParam(name = "sort", defaultValue = "name") String sort,
            @RequestParam(name = "order", defaultValue = "asc") String order

    ) {

        // Conversion de la chaîne order ('asc' / 'desc') vers l'énumération Sort.Direction
        Sort.Direction direction = order.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        Sort sorting = Sort.by(direction, sort);

        // 2. Création de l'objet Pageable intégrant le tri configuré
        Pageable pageable = PageRequest.of(page, size, sorting);

        // Récupération de la liste des produits via le service
        Page<ProductResponse> productResponses = productService.getProducts(pageable, keyword, brandId,
                typeId);

        // Retourne la liste avec un statut HTTP 200 OK
        return new ResponseEntity<>(productResponses, HttpStatus.OK);
    }

    @GetMapping("/brands")
    public ResponseEntity<List<BrandResponse>> getBrands() {
        // Récupération de toutes les marques via BrandService
        List<BrandResponse> brandResponses = brandService.getAllBrands();

        return new ResponseEntity<>(brandResponses, HttpStatus.OK);
    }

    @GetMapping("/types")
    public ResponseEntity<List<TypeResponse>> getTypes() {
        // Récupération de tous les types via TypeService
        List<TypeResponse> typeResponses = typeService.getAllTypes();

        return new ResponseEntity<>(typeResponses, HttpStatus.OK);
    }

}
