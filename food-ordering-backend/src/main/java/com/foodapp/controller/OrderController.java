package com.foodapp.controller;

import com.foodapp.dto.CheckoutRequest;
import com.foodapp.dto.UpdateOrderStatusRequest;
import com.foodapp.model.Order;
import com.foodapp.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(
            @Valid @RequestBody CheckoutRequest request,
            Authentication authentication) {

        Order order = orderService.checkout(
                authentication.getName(),
                request
        );

        return ResponseEntity.ok(order);
    }
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping
    public ResponseEntity<List<Order>> getCustomerOrders(
            Authentication authentication) {

        List<Order> orders =
                orderService.getCustomerOrders(authentication.getName());

        return ResponseEntity.ok(orders);
    }
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getCustomerOrder(
            @PathVariable String orderId,
            Authentication authentication) {

        Order order = orderService.getCustomerOrder(
                authentication.getName(),
                orderId
        );

        return ResponseEntity.ok(order);
    }
    @PreAuthorize("hasRole('CUSTOMER')")
    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(
            @PathVariable String orderId,
            Authentication authentication) {

        Order order = orderService.cancelOrder(
                authentication.getName(),
                orderId
        );

        return ResponseEntity.ok(order);
    }
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Order>> getRestaurantOrders(
            @PathVariable String restaurantId,
            Authentication authentication) {

        List<Order> orders = orderService.getRestaurantOrders(
                authentication.getName(),
                restaurantId
        );

        return ResponseEntity.ok(orders);
    }
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody UpdateOrderStatusRequest request,
            Authentication authentication) {

        Order order = orderService.updateOrderStatus(
                authentication.getName(),
                orderId,
                request
        );

        return ResponseEntity.ok(order);
    }
}
