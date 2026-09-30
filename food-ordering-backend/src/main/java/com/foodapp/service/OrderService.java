package com.foodapp.service;

import com.foodapp.dto.CheckoutRequest;
import com.foodapp.dto.UpdateOrderStatusRequest;
import com.foodapp.exception.BadRequestException;
import com.foodapp.exception.ForbiddenException;
import com.foodapp.exception.ResourceNotFoundException;
import com.foodapp.model.Cart;
import com.foodapp.model.CartItem;
import com.foodapp.model.FoodItem;
import com.foodapp.model.Order;
import com.foodapp.model.OrderItem;
import com.foodapp.model.OrderStatus;
import com.foodapp.model.PaymentMethod;
import com.foodapp.model.PaymentStatus;
import com.foodapp.model.User;
import com.foodapp.repository.CartRepository;
import com.foodapp.repository.FoodRepository;
import com.foodapp.repository.OrderRepository;
import com.foodapp.repository.RestaurantRepository;
import com.foodapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final FoodRepository foodRepository;
    private final RestaurantRepository restaurantRepository;

    public OrderService(
            OrderRepository orderRepository,
            CartRepository cartRepository,
            UserRepository userRepository,
            FoodRepository foodRepository,
            RestaurantRepository restaurantRepository) {

        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.foodRepository = foodRepository;
        this.restaurantRepository = restaurantRepository;
    }

    // =========================
    // CHECKOUT
    // =========================

    public Order checkout(
            String customerEmail,
            CheckoutRequest request) {

        // 1. Find customer
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() ->
                        new BadRequestException("Customer not found"));

        // 2. Find cart
        Cart cart = cartRepository.findByCustomerId(customer.getId())
                .orElseThrow(() ->
                        new BadRequestException("Cart not found"));

        // 3. Cart must contain items
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        // 4. Restaurant must exist
        var restaurant = restaurantRepository.findById(cart.getRestaurantId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Restaurant not found"));

        // 5. Restaurant must be approved
        if (!restaurant.isApproved()) {
            throw new BadRequestException(
                    "Restaurant is not approved for ordering");
        }

        // 6. Restaurant must be active
        if (!restaurant.isActive()) {
            throw new BadRequestException(
                    "Restaurant is currently inactive");
        }

        // 7. Online payment is not available yet
        if (request.getPaymentMethod() == PaymentMethod.ONLINE) {
            throw new BadRequestException(
                    "Online payment is not available yet");
        }

        // 8. Build order
        Order order = new Order();

        order.setCustomerId(customer.getId());
        order.setRestaurantId(cart.getRestaurantId());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setPaymentMethod(request.getPaymentMethod());

        // 9. Initial statuses
        order.setOrderStatus(OrderStatus.PLACED);
        order.setPaymentStatus(PaymentStatus.PENDING);

        // 10. Copy and validate cart items
        for (CartItem cartItem : cart.getItems()) {

            FoodItem foodItem = foodRepository.findById(
                    cartItem.getFoodId()
            ).orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Food item not found: "
                                    + cartItem.getFoodId()
                    ));

            if (!foodItem.getRestaurantId().equals(cart.getRestaurantId())) {
                throw new BadRequestException(
                        "Food item does not belong to the cart restaurant");
            }

            if (cartItem.getQuantity() < 1) {
                throw new BadRequestException(
                        "Cart item quantity must be at least 1");
            }

            if (!foodItem.isAvailable()) {
                throw new BadRequestException(
                        foodItem.getName() + " is currently unavailable");
            }

            // Use CURRENT database price
            BigDecimal currentPrice = foodItem.getPrice();

            OrderItem orderItem = new OrderItem();

            orderItem.setFoodId(foodItem.getId());
            orderItem.setFoodName(foodItem.getName());
            orderItem.setPrice(currentPrice);
            orderItem.setQuantity(cartItem.getQuantity());

            BigDecimal subtotal = currentPrice.multiply(
                    BigDecimal.valueOf(cartItem.getQuantity())
            );

            orderItem.setSubtotal(subtotal);

            order.getItems().add(orderItem);
        }

        // 11. Calculate final order total
        BigDecimal total = order.getItems()
                .stream()
                .map(OrderItem::getSubtotal)
                .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add
                );

        order.setTotalAmount(total);

        // 12. Set creation time
        order.setCreatedAt(LocalDateTime.now());

        // 13. Save order
        Order savedOrder = orderRepository.save(order);

        // 14. Clear cart after successful order creation
        cart.getItems().clear();
        cart.setRestaurantId(null);
        cart.setTotalAmount(BigDecimal.ZERO);
        cart.setUpdatedAt(LocalDateTime.now());

        cartRepository.save(cart);

        return savedOrder;
    }

    // =========================
    // CUSTOMER ORDERS
    // =========================

    public List<Order> getCustomerOrders(String customerEmail) {

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() ->
                        new BadRequestException("Customer not found"));

        return orderRepository.findByCustomerId(customer.getId());
    }

    public Order getCustomerOrder(
            String customerEmail,
            String orderId) {

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() ->
                        new BadRequestException("Customer not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        if (!order.getCustomerId().equals(customer.getId())) {
            throw new ForbiddenException(
                    "You are not allowed to view this order");
        }

        return order;
    }

    // =========================
    // CUSTOMER CANCEL ORDER
    // =========================

    public Order cancelOrder(
            String customerEmail,
            String orderId) {

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() ->
                        new BadRequestException("Customer not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        // Customer can cancel only their own order
        if (!order.getCustomerId().equals(customer.getId())) {
            throw new ForbiddenException(
                    "You are not allowed to cancel this order");
        }

        OrderStatus currentStatus = order.getOrderStatus();

        // Customer can cancel only before preparation starts
        if (currentStatus != OrderStatus.PLACED
                && currentStatus != OrderStatus.CONFIRMED) {

            throw new BadRequestException(
                    "Order cannot be cancelled at this stage");
        }

        order.setOrderStatus(OrderStatus.CANCELLED);

        return orderRepository.save(order);
    }

    // =========================
    // RESTAURANT OWNER ORDERS
    // =========================

    public List<Order> getRestaurantOrders(
            String ownerEmail,
            String restaurantId) {

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() ->
                        new BadRequestException("Owner not found"));

        var restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Restaurant not found"));

        if (!restaurant.getOwnerId().equals(owner.getId())) {
            throw new ForbiddenException(
                    "You are not allowed to view orders for this restaurant");
        }

        return orderRepository.findByRestaurantId(restaurantId);
    }

    // =========================
    // UPDATE ORDER STATUS
    // =========================

    public Order updateOrderStatus(
            String ownerEmail,
            String orderId,
            UpdateOrderStatusRequest request) {

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() ->
                        new BadRequestException("Owner not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        var restaurant = restaurantRepository.findById(
                order.getRestaurantId()
        ).orElseThrow(() ->
                new ResourceNotFoundException("Restaurant not found"));

        if (!restaurant.getOwnerId().equals(owner.getId())) {
            throw new ForbiddenException(
                    "You are not allowed to update this order");
        }

        if (request.getOrderStatus() == null) {
            throw new BadRequestException("Order status is required");
        }

        OrderStatus currentStatus = order.getOrderStatus();
        OrderStatus newStatus = request.getOrderStatus();

        boolean validTransition = switch (currentStatus) {

            case PLACED ->
                    newStatus == OrderStatus.CONFIRMED
                            || newStatus == OrderStatus.CANCELLED;

            case CONFIRMED ->
                    newStatus == OrderStatus.PREPARING
                            || newStatus == OrderStatus.CANCELLED;

            case PREPARING ->
                    newStatus == OrderStatus.OUT_FOR_DELIVERY;

            case OUT_FOR_DELIVERY ->
                    newStatus == OrderStatus.DELIVERED;

            case DELIVERED, CANCELLED -> false;
        };

        if (!validTransition) {
            throw new BadRequestException(
                    "Invalid order status transition from "
                            + currentStatus
                            + " to "
                            + newStatus);
        }

        order.setOrderStatus(newStatus);

        return orderRepository.save(order);
    }
}