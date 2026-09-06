package com.ecommerce.sportscenter.model;


import com.ecommerce.sportscenter.entity.Orderaggregate.OrderStatus;
import com.ecommerce.sportscenter.entity.Orderaggregate.ShippingAddress;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO de réponse renvoyé au client contenant toutes les informations détaillées d'une commande.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {

    private Integer id;
    private String basketId;
    private ShippingAddress shippingAddress;
    private Long subtotal;
    private Long deliveryFee;
    private Double total;
    private LocalDateTime orderDate;
    private OrderStatus orderStatus;
}
