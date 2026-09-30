package com.foodapp.service;

import com.foodapp.dto.CategoryRequest;
import com.foodapp.exception.ForbiddenException;
import com.foodapp.exception.ResourceNotFoundException;
import com.foodapp.exception.UnauthorizedException;
import com.foodapp.model.Category;
import com.foodapp.model.Restaurant;
import com.foodapp.model.User;
import com.foodapp.repository.CategoryRepository;
import com.foodapp.repository.RestaurantRepository;
import com.foodapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    public CategoryService(
            CategoryRepository categoryRepository,
            RestaurantRepository restaurantRepository,
            UserRepository userRepository) {

        this.categoryRepository = categoryRepository;
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }

    // =========================
    // GET METHODS
    // =========================

    public List<Category> getCategoriesByRestaurant(String restaurantId) {
        return categoryRepository.findByRestaurantId(restaurantId);
    }

    public List<Category> getActiveCategoriesByRestaurant(String restaurantId) {
        return categoryRepository.findByRestaurantIdAndIsActiveTrue(restaurantId);
    }

    public Optional<Category> getCategoryById(String id) {
        return categoryRepository.findById(id);
    }

    // =========================
    // CREATE
    // =========================

    public Category createCategory(
            String restaurantId,
            CategoryRequest request,
            String ownerEmail) {

        User owner = getOwner(ownerEmail);

        Restaurant restaurant = getRestaurant(restaurantId);

        verifyOwnership(restaurant, owner);

        Category category = new Category();

        category.setRestaurantId(restaurantId);
        category.setName(request.getName());
        category.setDescription(request.getDescription());

        // Backend-controlled fields
        category.setActive(true);
        category.setCreatedAt(LocalDateTime.now());

        return categoryRepository.save(category);
    }

    // =========================
    // UPDATE
    // =========================

    public Category updateCategory(
            String categoryId,
            CategoryRequest request,
            String ownerEmail) {

        User owner = getOwner(ownerEmail);

        Category existingCategory =
                categoryRepository.findById(categoryId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Category not found"));

        Restaurant restaurant =
                getRestaurant(existingCategory.getRestaurantId());

        verifyOwnership(restaurant, owner);

        existingCategory.setName(request.getName());
        existingCategory.setDescription(request.getDescription());

        return categoryRepository.save(existingCategory);
    }

    // =========================
    // DELETE
    // =========================

    public void deleteCategory(
            String categoryId,
            String ownerEmail) {

        User owner = getOwner(ownerEmail);

        Category category =
                categoryRepository.findById(categoryId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Category not found"));

        Restaurant restaurant =
                getRestaurant(category.getRestaurantId());

        verifyOwnership(restaurant, owner);

        categoryRepository.deleteById(categoryId);
    }

    // =========================
    // STATUS
    // =========================

    public Category updateCategoryStatus(
            String categoryId,
            boolean active,
            String ownerEmail) {

        User owner = getOwner(ownerEmail);

        Category category =
                categoryRepository.findById(categoryId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Category not found"));

        Restaurant restaurant =
                getRestaurant(category.getRestaurantId());

        verifyOwnership(restaurant, owner);

        category.setActive(active);

        return categoryRepository.save(category);
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
                        new ResourceNotFoundException(
                                "Restaurant not found"));
    }

    private void verifyOwnership(
            Restaurant restaurant,
            User owner) {

        if (!restaurant.getOwnerId().equals(owner.getId())) {
            throw new ForbiddenException(
                    "You are not allowed to manage this restaurant");
        }
    }
}