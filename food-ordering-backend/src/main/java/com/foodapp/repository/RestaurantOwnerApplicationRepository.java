package com.foodapp.repository;

import com.foodapp.model.ApplicationStatus;
import com.foodapp.model.RestaurantOwnerApplication;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RestaurantOwnerApplicationRepository
        extends MongoRepository<RestaurantOwnerApplication, String> {

    Optional<RestaurantOwnerApplication> findByUserIdAndStatus(
            String userId,
            ApplicationStatus status
    );

    List<RestaurantOwnerApplication> findByStatus(
            ApplicationStatus status
    );

    List<RestaurantOwnerApplication> findByUserId(
            String userId
    );
}