package com.ecommerce.sportscenter.model;


import com.ecommerce.sportscenter.entity.Orderaggregate.ShippingAddress;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


// -----------------------Mesmin-Dev---------------------------------
/**
 * DTO servant à recevoir les données nécessaires à la création d'une commande.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDto {

    private String basketId;
    private ShippingAddress shippingAddress;
    private Long subtotal;
    private Long deliveryFee;
    private LocalDateTime orderDate;
}
