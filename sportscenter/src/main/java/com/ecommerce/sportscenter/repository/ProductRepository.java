package com.ecommerce.sportscenter.repository;

import com.ecommerce.sportscenter.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    Page<Product> findAll(Specification<Product> spec, Pageable pageable);

    // 1. Spécification pour la recherche par mot-clé dans le nom (LIKE %keyword%)
    Specification<Product> searchByNameContaining(String keyword);

    // 2. Spécification pour le filtre par Marque (brandId)
    Specification<Product> findByBrandId(Integer brandId);

    // 3. Spécification pour le filtre par Type (typeId)
    Specification<Product> findByTypeId(Integer typeId);

    // 4. Spécification combinée : Marque ET Type
    Specification<Product> findByBrandIdAndTypeId(Integer brandId, Integer typeId);
}

