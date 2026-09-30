package com.foodapp.repository;

import com.foodapp.model.Restaurant;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RestaurantRepository extends MongoRepository<Restaurant, String> {

    List<Restaurant> findByIsApprovedTrueAndIsActiveTrue();

    List<Restaurant> findByOwnerId(String ownerId);

    List<Restaurant> findByCuisineIgnoreCase(String cuisine);

    List<Restaurant> findByNameContainingIgnoreCase(String name);
}