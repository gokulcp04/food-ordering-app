package com.foodapp.service;

import com.foodapp.dto.FoodItemRequest;
import com.foodapp.exception.UnauthorizedException;
import com.foodapp.model.Category;
import com.foodapp.model.FoodItem;
import com.foodapp.model.Restaurant;
import com.foodapp.model.User;
import com.foodapp.repository.CategoryRepository;
import com.foodapp.repository.FoodRepository;
import com.foodapp.repository.RestaurantRepository;
import com.foodapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.foodapp.exception.ForbiddenException;
import com.foodapp.exception.ResourceNotFoundException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FoodService {

    private final FoodRepository foodRepository;
    private final RestaurantRepository restaurantRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public FoodService(
            FoodRepository foodRepository,
            RestaurantRepository restaurantRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository) {

        this.foodRepository = foodRepository;
        this.restaurantRepository = restaurantRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    // =========================
    // GET METHODS
    // =========================

    public List<FoodItem> getAllFoodItems() {
        return foodRepository.findAll();
    }

    public Optional<FoodItem> getFoodById(String id) {
        return foodRepository.findById(id);
    }

    public List<FoodItem> getFoodByRestaurant(String restaurantId) {
        return foodRepository.findByRestaurantId(restaurantId);
    }

    public List<FoodItem> getAvailableFoodByRestaurant(String restaurantId) {
        return foodRepository.findByRestaurantIdAndIsAvailableTrue(restaurantId);
    }

    public List<FoodItem> getFoodByCategory(String categoryId) {
        return foodRepository.findByCategoryId(categoryId);
    }

    public List<FoodItem> searchFood(String name) {
        return foodRepository.findByNameContainingIgnoreCase(name);
    }

    public List<FoodItem> getVegetarianFood() {
        return foodRepository.findByIsVegTrue();
    }

    // =========================
    // CREATE
    // =========================

    public FoodItem createFood(
            String restaurantId,
            String categoryId,
            FoodItemRequest request,
            String ownerEmail) {

        User owner = getOwner(ownerEmail);

        Restaurant restaurant = getRestaurant(restaurantId);
        verifyOwnership(restaurant, owner);

        Category category = getCategory(categoryId);
        verifyCategoryBelongsToRestaurant(category, restaurantId);

        FoodItem foodItem = new FoodItem();

        foodItem.setName(request.getName());
        foodItem.setDescription(request.getDescription());
        foodItem.setPrice(request.getPrice());
        foodItem.setImageUrl(request.getImageUrl());
        foodItem.setVeg(request.isVeg());
        foodItem.setPreparationTime(request.getPreparationTime());

        // Backend-controlled fields
        foodItem.setRestaurantId(restaurantId);
        foodItem.setCategoryId(categoryId);
        foodItem.setRating(0.0);
        foodItem.setAvailable(true);
        foodItem.setCreatedAt(LocalDateTime.now());

        return foodRepository.save(foodItem);
    }

    // =========================
    // UPDATE
    // =========================

    public FoodItem updateFood(
            String foodId,
            FoodItemRequest request,
            String ownerEmail) {

        User owner = getOwner(ownerEmail);

        FoodItem existingFood = foodRepository.findById(foodId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Food item not found"));

        Restaurant restaurant =
                getRestaurant(existingFood.getRestaurantId());

        verifyOwnership(restaurant, owner);

        existingFood.setName(request.getName());
        existingFood.setDescription(request.getDescription());
        existingFood.setPrice(request.getPrice());
        existingFood.setImageUrl(request.getImageUrl());
        existingFood.setVeg(request.isVeg());
        existingFood.setPreparationTime(request.getPreparationTime());

        return foodRepository.save(existingFood);
    }

    // =========================
    // AVAILABILITY
    // =========================

    public FoodItem updateFoodAvailability(
            String foodId,
            boolean available,
            String ownerEmail) {

        User owner = getOwner(ownerEmail);

        FoodItem foodItem = foodRepository.findById(foodId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Food item not found"));

        Restaurant restaurant =
                getRestaurant(foodItem.getRestaurantId());

        verifyOwnership(restaurant, owner);

        foodItem.setAvailable(available);

        return foodRepository.save(foodItem);
    }

    // =========================
    // DELETE
    // =========================

    public void deleteFood(
            String foodId,
            String ownerEmail) {

        User owner = getOwner(ownerEmail);

        FoodItem foodItem = foodRepository.findById(foodId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Food item not found"));

        Restaurant restaurant =
                getRestaurant(foodItem.getRestaurantId());

        verifyOwnership(restaurant, owner);

        foodRepository.deleteById(foodId);
    }

    // =========================
    // HELPER METHODS
    // =========================

    private User getOwner(String ownerEmail) {
        return userRepository.findByEmail(ownerEmail)
                .orElseThrow(() ->
                        new UnauthorizedException("Owner not found"));
    }

    private Restaurant getRestaurant(String restaurantId) {
        return restaurantRepository.findById(restaurantId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Restaurant not found"));
    }

    private Category getCategory(String categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found"));
    }

    private void verifyOwnership(
            Restaurant restaurant,
            User owner) {

        if (!restaurant.getOwnerId().equals(owner.getId())) {
            throw new ForbiddenException(
                    "You are not allowed to manage this restaurant");
        }
    }

    private void verifyCategoryBelongsToRestaurant(
            Category category,
            String restaurantId) {

        if (!category.getRestaurantId().equals(restaurantId)) {
            throw new ForbiddenException(
                    "Category does not belong to this restaurant");
        }
    }
}