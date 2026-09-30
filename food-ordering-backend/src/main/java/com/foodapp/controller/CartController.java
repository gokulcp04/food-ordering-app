package com.foodapp.controller;

import com.foodapp.dto.AddToCartRequest;
import com.foodapp.model.Cart;
import com.foodapp.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.foodapp.dto.UpdateCartItemRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping
    public ResponseEntity<Cart> getCart(Authentication authentication) {

        Cart cart = cartService.getCart(authentication.getName());

        return ResponseEntity.ok(cart);
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/items")
    public ResponseEntity<Cart> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            Authentication authentication) {

        Cart cart = cartService.addToCart(
                authentication.getName(),
                request
        );

        return ResponseEntity.ok(cart);
    }
    @PreAuthorize("hasRole('CUSTOMER')")
    @PutMapping("/items/{foodId}")
    public ResponseEntity<Cart> updateCartItem(
            @PathVariable String foodId,
            @Valid @RequestBody UpdateCartItemRequest request,
            Authentication authentication) {

        Cart cart = cartService.updateCartItem(
                authentication.getName(),
                foodId,
                request
        );

        return ResponseEntity.ok(cart);
    }
    @PreAuthorize("hasRole('CUSTOMER')")
    @DeleteMapping("/items/{foodId}")
    public ResponseEntity<Cart> removeCartItem(
            @PathVariable String foodId,
            Authentication authentication) {

        Cart cart = cartService.removeCartItem(
                authentication.getName(),
                foodId
        );

        return ResponseEntity.ok(cart);
    }
    @PreAuthorize("hasRole('CUSTOMER')")
    @DeleteMapping
    public ResponseEntity<Cart> clearCart(
            Authentication authentication) {

        Cart cart = cartService.clearCart(
                authentication.getName()
        );

        return ResponseEntity.ok(cart);
    }
}