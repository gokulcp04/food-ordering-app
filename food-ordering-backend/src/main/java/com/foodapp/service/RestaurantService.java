package com.foodapp.service;

import com.foodapp.dto.RestaurantRequest;
import com.foodapp.exception.ForbiddenException;
import com.foodapp.exception.ResourceNotFoundException;
import com.foodapp.exception.UnauthorizedException;
import com.foodapp.model.Restaurant;
import com.foodapp.model.User;
import com.foodapp.repository.RestaurantRepository;
import com.foodapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    public RestaurantService(
            RestaurantRepository restaurantRepository,
            UserRepository userRepository) {

        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }

    // =========================
    // GET METHODS
    // =========================

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Optional<Restaurant> getRestaurantById(String id) {
        return restaurantRepository.findById(id);
    }

    public List<Restaurant> getActiveRestaurants() {
        return restaurantRepository.findByIsApprovedTrueAndIsActiveTrue();
    }

    public List<Restaurant> getRestaurantsByOwner(String ownerId) {
        return restaurantRepository.findByOwnerId(ownerId);
    }

    public List<Restaurant> searchRestaurants(String name) {
        return restaurantRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Restaurant> getRestaurantsByCuisine(String cuisine) {
        return restaurantRepository.findByCuisineIgnoreCase(cuisine);
    }

    public Restaurant saveRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    // =========================
    // CREATE
    // =========================

    public Restaurant createRestaurant(
            RestaurantRequest request,
            String ownerEmail) {

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() ->
                        new UnauthorizedException("Owner not found"));

        Restaurant restaurant = new Restaurant();

        restaurant.setName(request.getName());
        restaurant.setDescription(request.getDescription());
        restaurant.setAddress(request.getAddress());
        restaurant.setPhone(request.getPhone());
        restaurant.setCuisine(request.getCuisine());
        restaurant.setDeliveryTime(request.getDeliveryTime());
        restaurant.setPriceForTwo(request.getPriceForTwo());
        restaurant.setImageUrl(request.getImageUrl());

        // Backend-controlled fields
        restaurant.setOwnerId(owner.getId());
        restaurant.setRating(0.0);
        restaurant.setApproved(false);
        restaurant.setActive(true);
        restaurant.setCreatedAt(LocalDateTime.now());

        return restaurantRepository.save(restaurant);
    }

    // =========================
    // UPDATE
    // =========================

    public Restaurant updateRestaurant(
            String id,
            RestaurantRequest request,
            String ownerEmail) {

        Restaurant existingRestaurant =
                restaurantRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Restaurant not found"));

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() ->
                        new UnauthorizedException("Owner not found"));

        if (!existingRestaurant.getOwnerId().equals(owner.getId())) {
            throw new ForbiddenException(
                    "You are not allowed to modify this restaurant");
        }

        existingRestaurant.setName(request.getName());
        existingRestaurant.setDescription(request.getDescription());
        existingRestaurant.setAddress(request.getAddress());
        existingRestaurant.setPhone(request.getPhone());
        existingRestaurant.setCuisine(request.getCuisine());
        existingRestaurant.setDeliveryTime(request.getDeliveryTime());
        existingRestaurant.setPriceForTwo(request.getPriceForTwo());
        existingRestaurant.setImageUrl(request.getImageUrl());

        return restaurantRepository.save(existingRestaurant);
    }

    // =========================
    // DELETE
    // =========================

    public void deleteRestaurant(
            String id,
            String ownerEmail) {

        Restaurant restaurant =
                restaurantRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Restaurant not found"));

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() ->
                        new UnauthorizedException("Owner not found"));

        if (!restaurant.getOwnerId().equals(owner.getId())) {
            throw new ForbiddenException(
                    "You are not allowed to delete this restaurant");
        }

        restaurantRepository.deleteById(id);
    }

    // =========================
    // ADMIN METHODS
    // =========================

    public Restaurant updateRestaurantApproval(
            String restaurantId,
            boolean approved) {

        Restaurant restaurant =
                restaurantRepository.findById(restaurantId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Restaurant not found"));

        restaurant.setApproved(approved);

        return restaurantRepository.save(restaurant);
    }

    public Restaurant updateRestaurantStatus(
            String restaurantId,
            boolean active) {

        Restaurant restaurant =
                restaurantRepository.findById(restaurantId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Restaurant not found"));

        restaurant.setActive(active);

        return restaurantRepository.save(restaurant);
    }
}