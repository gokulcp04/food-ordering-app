package com.foodapp.controller;

import com.foodapp.dto.RestaurantRequest;
import com.foodapp.model.Restaurant;
import com.foodapp.model.User;
import com.foodapp.repository.UserRepository;
import com.foodapp.service.RestaurantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final UserRepository userRepository;

    public RestaurantController(
            RestaurantService restaurantService,
            UserRepository userRepository) {

        this.restaurantService = restaurantService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        List<Restaurant> restaurants =
                restaurantService.getAllRestaurants();

        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Restaurant>> getActiveRestaurants() {
        List<Restaurant> restaurants =
                restaurantService.getActiveRestaurants();

        return ResponseEntity.ok(restaurants);
    }

    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @GetMapping("/my")
    public ResponseEntity<List<Restaurant>> getMyRestaurants(
            Authentication authentication) {

        User owner = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("Owner not found"));

        List<Restaurant> restaurants =
                restaurantService.getRestaurantsByOwner(owner.getId());

        return ResponseEntity.ok(restaurants);
    }

    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @PostMapping
    public ResponseEntity<Restaurant> createRestaurant(
            @Valid @RequestBody RestaurantRequest request,
            Authentication authentication) {

        Restaurant savedRestaurant =
                restaurantService.createRestaurant(
                        request,
                        authentication.getName());

        return ResponseEntity.ok(savedRestaurant);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(
            @PathVariable String id) {

        return restaurantService.getRestaurantById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Restaurant>> searchRestaurants(
            @RequestParam String name) {

        List<Restaurant> restaurants =
                restaurantService.searchRestaurants(name);

        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/cuisine")
    public ResponseEntity<List<Restaurant>> getRestaurantsByCuisine(
            @RequestParam String cuisine) {

        List<Restaurant> restaurants =
                restaurantService.getRestaurantsByCuisine(cuisine);

        return ResponseEntity.ok(restaurants);
    }

    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(
            @PathVariable String id,
            @Valid @RequestBody RestaurantRequest request,
            Authentication authentication) {

        Restaurant updatedRestaurant =
                restaurantService.updateRestaurant(
                        id,
                        request,
                        authentication.getName());

        return ResponseEntity.ok(updatedRestaurant);
    }

    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(
            @PathVariable String id,
            Authentication authentication) {

        restaurantService.deleteRestaurant(
                id,
                authentication.getName());

        return ResponseEntity.noContent().build();
    }
}