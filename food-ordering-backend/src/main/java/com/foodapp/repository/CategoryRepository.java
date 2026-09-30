package com.foodapp.repository;

import com.foodapp.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CategoryRepository extends MongoRepository<Category, String> {

    List<Category> findByRestaurantId(String restaurantId);

    List<Category> findByRestaurantIdAndIsActiveTrue(String restaurantId);
}