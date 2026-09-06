package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.model.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    ProductResponse getProductById(Integer id);

    // Modification de la signature pour inclure la pagination
    Page<ProductResponse> getProducts(Pageable pageable, String keyword, Integer brandId, Integer typeId);
}
