package com.foodapp.controller;

import com.foodapp.dto.UserResponse;
import com.foodapp.model.Restaurant;
import com.foodapp.model.User;
import com.foodapp.service.RestaurantService;
import com.foodapp.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final RestaurantService restaurantService;

    public AdminController(
            UserService userService,
            RestaurantService restaurantService) {

        this.userService = userService;
        this.restaurantService = restaurantService;
    }

    // =========================
    // USER MANAGEMENT
    // =========================

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {

        List<UserResponse> users =
                userService.getAllUsers()
                        .stream()
                        .map(this::toUserResponse)
                        .toList();

        return ResponseEntity.ok(users);
    }

    @PatchMapping("/users/{userId}/status")
    public ResponseEntity<UserResponse> updateUserStatus(
            @PathVariable String userId,
            @RequestParam boolean active,
            Authentication authentication) {

        User targetUser =
                userService.getUserById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));

        // Prevent an admin from deactivating their own account.
        if (targetUser.getEmail().equals(authentication.getName())
                && !active) {

            throw new IllegalArgumentException(
                    "You cannot deactivate your own account");
        }

        User updatedUser =
                userService.updateUserStatus(
                        userId,
                        active);

        return ResponseEntity.ok(
                toUserResponse(updatedUser)
        );
    }

    // =========================
    // RESTAURANT MANAGEMENT
    // =========================

    @GetMapping("/restaurants")
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {

        List<Restaurant> restaurants =
                restaurantService.getAllRestaurants();

        return ResponseEntity.ok(restaurants);
    }

    @PatchMapping("/restaurants/{restaurantId}/approval")
    public ResponseEntity<Restaurant> updateRestaurantApproval(
            @PathVariable String restaurantId,
            @RequestParam boolean approved) {

        Restaurant updatedRestaurant =
                restaurantService.updateRestaurantApproval(
                        restaurantId,
                        approved);

        return ResponseEntity.ok(updatedRestaurant);
    }

    @PatchMapping("/restaurants/{restaurantId}/status")
    public ResponseEntity<Restaurant> updateRestaurantStatus(
            @PathVariable String restaurantId,
            @RequestParam boolean active) {

        Restaurant updatedRestaurant =
                restaurantService.updateRestaurantStatus(
                        restaurantId,
                        active);

        return ResponseEntity.ok(updatedRestaurant);
    }

    // =========================
    // USER RESPONSE MAPPER
    // =========================

    private UserResponse toUserResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.isActive()
        );
    }
}