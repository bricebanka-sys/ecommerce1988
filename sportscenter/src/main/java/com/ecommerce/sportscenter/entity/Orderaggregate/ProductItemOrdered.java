package com.ecommerce.sportscenter.entity.Orderaggregate;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductItemOrdered {

    private Integer productId;
    private String name;
    private String pictureUrl;
}
