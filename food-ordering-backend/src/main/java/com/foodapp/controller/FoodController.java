package com.foodapp.controller;

import com.foodapp.dto.FoodItemRequest;
import com.foodapp.model.FoodItem;
import com.foodapp.service.FoodService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.Valid;
@RestController
@RequestMapping("/api/foods")
public class FoodController {

    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    // =========================
    // GET METHODS
    // =========================

    @GetMapping
    public ResponseEntity<List<FoodItem>> getAllFoodItems() {
        return ResponseEntity.ok(foodService.getAllFoodItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodItem> getFoodById(
            @PathVariable String id) {

        return foodService.getFoodById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<FoodItem>> getFoodByRestaurant(
            @PathVariable String restaurantId) {

        return ResponseEntity.ok(
                foodService.getFoodByRestaurant(restaurantId));
    }

    @GetMapping("/restaurant/{restaurantId}/available")
    public ResponseEntity<List<FoodItem>> getAvailableFoodByRestaurant(
            @PathVariable String restaurantId) {

        return ResponseEntity.ok(
                foodService.getAvailableFoodByRestaurant(restaurantId));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<FoodItem>> getFoodByCategory(
            @PathVariable String categoryId) {

        return ResponseEntity.ok(
                foodService.getFoodByCategory(categoryId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<FoodItem>> searchFood(
            @RequestParam String name) {

        return ResponseEntity.ok(
                foodService.searchFood(name));
    }

    @GetMapping("/vegetarian")
    public ResponseEntity<List<FoodItem>> getVegetarianFood() {
        return ResponseEntity.ok(
                foodService.getVegetarianFood());
    }

    // =========================
    // CREATE
    // =========================

    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @PostMapping("/restaurant/{restaurantId}/category/{categoryId}")
    public ResponseEntity<FoodItem> createFood(
            @PathVariable String restaurantId,
            @PathVariable String categoryId,
            @Valid @RequestBody FoodItemRequest request,
            Authentication authentication) {

        FoodItem savedFood =
                foodService.createFood(
                        restaurantId,
                        categoryId,
                        request,
                        authentication.getName());

        return ResponseEntity.ok(savedFood);
    }

    // =========================
    // UPDATE
    // =========================

    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @PutMapping("/{foodId}")
    public ResponseEntity<FoodItem> updateFood(
            @PathVariable String foodId,
            @Valid @RequestBody FoodItemRequest request,
            Authentication authentication) {

        FoodItem updatedFood =
                foodService.updateFood(
                        foodId,
                        request,
                        authentication.getName());

        return ResponseEntity.ok(updatedFood);
    }

    // =========================
    // AVAILABILITY
    // =========================

    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @PatchMapping("/{foodId}/availability")
    public ResponseEntity<FoodItem> updateFoodAvailability(
            @PathVariable String foodId,
            @RequestParam boolean available,
            Authentication authentication) {

        FoodItem updatedFood =
                foodService.updateFoodAvailability(
                        foodId,
                        available,
                        authentication.getName());

        return ResponseEntity.ok(updatedFood);
    }

    // =========================
    // DELETE
    // =========================

    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @DeleteMapping("/{foodId}")
    public ResponseEntity<Void> deleteFood(
            @PathVariable String foodId,
            Authentication authentication) {

        foodService.deleteFood(
                foodId,
                authentication.getName());

        return ResponseEntity.noContent().build();
    }
}