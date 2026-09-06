package com.ecommerce.sportscenter.mapper;


import com.ecommerce.sportscenter.entity.Orderaggregate.Order;
import com.ecommerce.sportscenter.model.OrderDto;
import com.ecommerce.sportscenter.model.OrderResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * Mapper MapStruct gérant la conversion entre les entités JPA du domaine (Order)
 * et les DTOs d'échange (OrderResponse).
 */
@Mapper
public interface OrderMapper {

    /**
     * Instance Singleton standard pour accéder au Mapper.
     */
    OrderMapper INSTANCE = Mappers.getMapper(OrderMapper.class);

    /**
     * Convertit une entité Order en DTO OrderResponse.
     * Si les noms de champs diffèrent entre la source et la cible,
     * vous pouvez personnaliser le mapping avec l'annotation @Mapping.
     */
    @Mapping(source = "id", target = "id")
    @Mapping(source = "basketId", target = "basketId")
    @Mapping(source = "shippingAddress", target = "shippingAddress")
    @Mapping(source = "subTotal", target = "subtotal")
    @Mapping(source = "deliveryFee", target = "deliveryFee")
    @Mapping(target = "total", expression = "java(order.getSubTotal()+ order.getDeliveryFee())")
    @Mapping(target = "orderDate", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "orderStatus", constant = "PENDING")
    OrderResponse orderToOrderResponse(Order order);

    /**
     * Convertit un DTO OrderResponse en entité Order (Mapping inverse).
     */
    @Mapping(target = "orderDate", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "orderStatus", constant = "PENDING")
    Order orderResponseToOrder(OrderDto orderResponse);

    /**
     * Convertit une liste d'entités Order en une liste de DTOs OrderResponse.
     * MapStruct applique automatiquement orderToOrderResponse(...) sur chaque élément.
     */
    List<OrderResponse> ordersToOrderResponses(List<Order> orders);

    void updateOrderFromOrderResponse(OrderDto orderDto, @MappingTarget Order order);

}
