package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.entity.Orderaggregate.Order;
import com.ecommerce.sportscenter.entity.Orderaggregate.OrderItem;
import com.ecommerce.sportscenter.entity.Orderaggregate.ProductItemOrdered;
import com.ecommerce.sportscenter.mapper.OrderMapper;
import com.ecommerce.sportscenter.model.BasketItemResponse;
import com.ecommerce.sportscenter.model.BasketResponse;
import com.ecommerce.sportscenter.model.OrderDto;
import com.ecommerce.sportscenter.model.OrderResponse;
import com.ecommerce.sportscenter.repository.BrandRepository;
import com.ecommerce.sportscenter.repository.OrderRepository;
import com.ecommerce.sportscenter.repository.TypeRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    private final BrandRepository brandRepository;

    private final TypeRepository typeRepository;

    private final BasketService basketService;

    private final OrderMapper orderMapper;

    public OrderServiceImpl(OrderRepository orderRepository, BrandRepository brandRepository, TypeRepository typeRepository, BasketService basketService, OrderMapper orderMapper) {
        this.orderRepository = orderRepository;
        this.brandRepository = brandRepository;
        this.typeRepository = typeRepository;
        this.basketService = basketService;
        this.orderMapper = orderMapper;
    }

    @Override
    public OrderResponse getOrderById(Integer orderId) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        return optionalOrder.map(orderMapper::orderToOrderResponse)
                            .orElse(null);
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(orderMapper::orderToOrderResponse).collect(Collectors.toList());
    }

    @Override
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map(orderMapper::orderToOrderResponse);
    }

    @Override
    public void deleteOrder(Integer orderId) {
        orderRepository.deleteById(orderId);
    }

    @Override
    public Integer createOrder(OrderDto orderDto) {
        // 1. Récupération des détails du panier depuis le BasketService
        BasketResponse basketResponse = basketService.getBasketById(orderDto.getBasketId());

        // 2. Vérification de l'existence du panier
        if (basketResponse == null) {
            log.error("Command failed: Cart with ID {} not found.", orderDto.getBasketId());
            return null; // Il est recommandé de lever une exception métier personnalisée
        }
        // 3. Transformation des articles du panier (BasketItem) en articles de commande (OrderItem)
        List<OrderItem> orderItems = basketResponse.getItems().stream()
                .map(this::mapBasketItemToOrderItem)
                .collect(Collectors.toList());

        // 4. Calcul du sous-total de la commande
        double subTotal = basketResponse.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

        // 5. Instanciation et initialisation de l'entité Order via le Mapper
        Order order = orderMapper.orderResponseToOrder(orderDto);
        order.setOrderItems(orderItems);
        order.setSubTotal(subTotal);

        // 6. Sauvegarde en base de données
        Order savedOrder = orderRepository.save(order);
        log.info("Order successfully created with ID: {}", savedOrder.getId());

        // 7. Suppression du panier devenu obsolète
        basketService.deleteBasketById(orderDto.getBasketId());

        // 8. Retour de l'identifiant de la nouvelle commande
        return savedOrder.getId();
    }

    private OrderItem mapBasketItemToOrderItem(BasketItemResponse basketItemResponse) {

        if (basketItemResponse!=null){

            OrderItem orderItem = new OrderItem();
            orderItem.setItemOrdered(mapBasketItemToProduct(basketItemResponse));
            orderItem.setQuantity(basketItemResponse.getQuantity());
            return orderItem;
        }else{
            return null; // Il est recommandé de lever une exception métier personnalisée
        }
    }

    private ProductItemOrdered mapBasketItemToProduct(BasketItemResponse basketItemResponse) {
        ProductItemOrdered productItemOrdered = new ProductItemOrdered();
        productItemOrdered.setName(basketItemResponse.getName());
        productItemOrdered.setPictureUrl(basketItemResponse.getPictureUrl());
        productItemOrdered.setProductId(basketItemResponse.getId());
        return productItemOrdered;
    }

}
