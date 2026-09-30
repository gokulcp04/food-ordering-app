package com.foodapp.repository;

import com.foodapp.model.FoodItem;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FoodRepository extends MongoRepository<FoodItem, String> {

    List<FoodItem> findByRestaurantId(String restaurantId);

    List<FoodItem> findByRestaurantIdAndIsAvailableTrue(String restaurantId);

    List<FoodItem> findByCategoryId(String categoryId);

    List<FoodItem> findByNameContainingIgnoreCase(String name);

    List<FoodItem> findByIsVegTrue();
}