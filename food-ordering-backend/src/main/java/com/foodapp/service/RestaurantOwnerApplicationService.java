package com.foodapp.service;

import com.foodapp.dto.RestaurantOwnerApplicationRequest;
import com.foodapp.exception.BadRequestException;
import com.foodapp.exception.ResourceNotFoundException;
import com.foodapp.model.ApplicationStatus;
import com.foodapp.model.RestaurantOwnerApplication;
import com.foodapp.model.Role;
import com.foodapp.model.User;
import com.foodapp.repository.RestaurantOwnerApplicationRepository;
import com.foodapp.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RestaurantOwnerApplicationService {

    private final RestaurantOwnerApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public RestaurantOwnerApplicationService(
            RestaurantOwnerApplicationRepository applicationRepository,
            UserRepository userRepository) {

        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    public RestaurantOwnerApplication submitApplication(
            RestaurantOwnerApplicationRequest request,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.CUSTOMER) {
            throw new BadRequestException(
                    "Only customers can apply to become restaurant owners");
        }

        applicationRepository
                .findByUserIdAndStatus(
                        user.getId(),
                        ApplicationStatus.PENDING)
                .ifPresent(existingApplication -> {
                    throw new BadRequestException(
                            "You already have a pending owner application");
                });

        RestaurantOwnerApplication application =
                new RestaurantOwnerApplication();

        application.setUserId(user.getId());
        application.setFullName(request.getFullName());
        application.setEmail(user.getEmail());
        application.setPhone(request.getPhone());
        application.setRestaurantName(request.getRestaurantName());
        application.setDescription(request.getDescription());
        application.setCuisine(request.getCuisine());
        application.setAddress(request.getAddress());
        application.setStatus(ApplicationStatus.PENDING);
        application.setCreatedAt(LocalDateTime.now());

        return applicationRepository.save(application);
    }
    public RestaurantOwnerApplication getMyApplication(
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return applicationRepository.findByUserId(user.getId())
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No owner application found"));
    }
    public java.util.List<RestaurantOwnerApplication> getApplications(
            ApplicationStatus status) {

        if (status == null) {
            return applicationRepository.findAll();
        }

        return applicationRepository.findByStatus(status);
    }

    public RestaurantOwnerApplication getApplicationById(String applicationId) {

        return applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Owner application not found"));
    }
    public RestaurantOwnerApplication approveApplication(
            String applicationId,
            String adminNote,
            Authentication authentication) {

        RestaurantOwnerApplication application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Owner application not found"));

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new BadRequestException(
                    "Only pending applications can be approved");
        }

        User user = userRepository.findById(application.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Applicant user not found"));

        if (user.getRole() != Role.CUSTOMER) {
            throw new BadRequestException(
                    "Only customer accounts can be approved");
        }

        user.setRole(Role.RESTAURANT_OWNER);
        userRepository.save(user);

        application.setStatus(ApplicationStatus.APPROVED);
        application.setAdminNote(adminNote);
        application.setReviewedAt(LocalDateTime.now());
        application.setReviewedBy(authentication.getName());

        return applicationRepository.save(application);
    }
    public RestaurantOwnerApplication rejectApplication(
            String applicationId,
            String adminNote,
            Authentication authentication) {

        RestaurantOwnerApplication application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Owner application not found"));

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new BadRequestException(
                    "Only pending applications can be rejected");
        }

        application.setStatus(ApplicationStatus.REJECTED);
        application.setAdminNote(adminNote);
        application.setReviewedAt(LocalDateTime.now());
        application.setReviewedBy(authentication.getName());

        return applicationRepository.save(application);
    }
}