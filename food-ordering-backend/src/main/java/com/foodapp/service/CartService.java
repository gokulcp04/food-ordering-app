package com.foodapp.service;

import com.foodapp.dto.AddToCartRequest;
import com.foodapp.dto.UpdateCartItemRequest;
import com.foodapp.exception.BadRequestException;
import com.foodapp.model.Cart;
import com.foodapp.model.CartItem;
import com.foodapp.model.FoodItem;
import com.foodapp.model.User;
import com.foodapp.repository.CartRepository;
import com.foodapp.repository.FoodRepository;
import com.foodapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final FoodRepository foodRepository;

    public CartService(
            CartRepository cartRepository,
            UserRepository userRepository,
            FoodRepository foodRepository) {

        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.foodRepository = foodRepository;
    }

    // =========================
    // GET CART
    // =========================

    public Cart getCart(String customerEmail) {

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() ->
                        new BadRequestException("Customer not found"));

        return cartRepository.findByCustomerId(customer.getId())
                .orElseGet(() -> {

                    Cart cart = new Cart();
                    cart.setCustomerId(customer.getId());
                    cart.setTotalAmount(BigDecimal.ZERO);

                    return cartRepository.save(cart);
                });
    }

    // =========================
    // ADD TO CART
    // =========================

    public Cart addToCart(
            String customerEmail,
            AddToCartRequest request) {

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() ->
                        new BadRequestException("Customer not found"));

        if (request.getQuantity() <= 0) {
            throw new BadRequestException(
                    "Quantity must be greater than zero");
        }

        FoodItem foodItem = foodRepository.findById(request.getFoodId())
                .orElseThrow(() ->
                        new BadRequestException("Food item not found"));

        if (!foodItem.isAvailable()) {
            throw new BadRequestException(
                    "Food item is currently unavailable");
        }

        Cart cart = cartRepository.findByCustomerId(customer.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setCustomerId(customer.getId());
                    newCart.setTotalAmount(BigDecimal.ZERO);
                    return newCart;
                });

        String restaurantId = foodItem.getRestaurantId();

        // One restaurant per cart
        if (cart.getRestaurantId() != null
                && !cart.getRestaurantId().equals(restaurantId)) {

            throw new BadRequestException(
                    "Cart already contains items from another restaurant");
        }

        cart.setRestaurantId(restaurantId);

        CartItem existingItem = cart.getItems()
                .stream()
                .filter(item ->
                        item.getFoodId().equals(foodItem.getId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {

            existingItem.setQuantity(
                    existingItem.getQuantity()
                            + request.getQuantity());

            existingItem.setSubtotal(
                    existingItem.getPrice().multiply(
                            BigDecimal.valueOf(
                                    existingItem.getQuantity()
                            )
                    )
            );

        } else {

            CartItem cartItem = new CartItem();

            cartItem.setFoodId(foodItem.getId());
            cartItem.setFoodName(foodItem.getName());
            cartItem.setPrice(foodItem.getPrice());
            cartItem.setQuantity(request.getQuantity());

            cartItem.setSubtotal(
                    foodItem.getPrice().multiply(
                            BigDecimal.valueOf(
                                    request.getQuantity()
                            )
                    )
            );

            cart.getItems().add(cartItem);
        }

        calculateTotal(cart);

        cart.setUpdatedAt(LocalDateTime.now());

        return cartRepository.save(cart);
    }

    // =========================
    // UPDATE CART ITEM
    // =========================

    public Cart updateCartItem(
            String customerEmail,
            String foodId,
            UpdateCartItemRequest request) {

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() ->
                        new BadRequestException("Customer not found"));

        if (request.getQuantity() <= 0) {
            throw new BadRequestException(
                    "Quantity must be greater than zero");
        }

        Cart cart = cartRepository.findByCustomerId(customer.getId())
                .orElseThrow(() ->
                        new BadRequestException("Cart not found"));

        CartItem cartItem = cart.getItems()
                .stream()
                .filter(item ->
                        item.getFoodId().equals(foodId))
                .findFirst()
                .orElseThrow(() ->
                        new BadRequestException(
                                "Food item is not in cart"));

        cartItem.setQuantity(request.getQuantity());

        cartItem.setSubtotal(
                cartItem.getPrice().multiply(
                        BigDecimal.valueOf(
                                request.getQuantity()
                        )
                )
        );

        calculateTotal(cart);

        cart.setUpdatedAt(LocalDateTime.now());

        return cartRepository.save(cart);
    }

    // =========================
    // REMOVE CART ITEM
    // =========================

    public Cart removeCartItem(
            String customerEmail,
            String foodId) {

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() ->
                        new BadRequestException("Customer not found"));

        Cart cart = cartRepository.findByCustomerId(customer.getId())
                .orElseThrow(() ->
                        new BadRequestException("Cart not found"));

        CartItem cartItem = cart.getItems()
                .stream()
                .filter(item ->
                        item.getFoodId().equals(foodId))
                .findFirst()
                .orElseThrow(() ->
                        new BadRequestException(
                                "Food item is not in cart"));

        cart.getItems().remove(cartItem);

        if (cart.getItems().isEmpty()) {
            cart.setRestaurantId(null);
        }

        calculateTotal(cart);

        cart.setUpdatedAt(LocalDateTime.now());

        return cartRepository.save(cart);
    }

    // =========================
    // CLEAR CART
    // =========================

    public Cart clearCart(String customerEmail) {

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() ->
                        new BadRequestException("Customer not found"));

        Cart cart = cartRepository.findByCustomerId(customer.getId())
                .orElseThrow(() ->
                        new BadRequestException("Cart not found"));

        cart.getItems().clear();

        cart.setRestaurantId(null);
        cart.setTotalAmount(BigDecimal.ZERO);

        cart.setUpdatedAt(LocalDateTime.now());

        return cartRepository.save(cart);
    }

    // =========================
    // CALCULATE TOTAL
    // =========================

    private void calculateTotal(Cart cart) {

        BigDecimal total = cart.getItems()
                .stream()
                .map(CartItem::getSubtotal)
                .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add
                );

        cart.setTotalAmount(total);
    }
}