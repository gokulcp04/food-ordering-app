package com.foodapp.controller;

import com.foodapp.dto.RestaurantOwnerApplicationRequest;
import com.foodapp.dto.OwnerApplicationReviewRequest;
import com.foodapp.model.RestaurantOwnerApplication;
import com.foodapp.service.RestaurantOwnerApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import com.foodapp.model.ApplicationStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owner-applications")
public class RestaurantOwnerApplicationController {

    private final RestaurantOwnerApplicationService applicationService;

    public RestaurantOwnerApplicationController(
            RestaurantOwnerApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<RestaurantOwnerApplication> submitApplication(
            @Valid @RequestBody RestaurantOwnerApplicationRequest request,
            Authentication authentication) {

        RestaurantOwnerApplication application =
                applicationService.submitApplication(
                        request,
                        authentication);

        return ResponseEntity.ok(application);
    }
    @GetMapping("/my")
    public ResponseEntity<RestaurantOwnerApplication> getMyApplication(
            Authentication authentication) {

        RestaurantOwnerApplication application =
                applicationService.getMyApplication(authentication);

        return ResponseEntity.ok(application);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<java.util.List<RestaurantOwnerApplication>> getApplications(
            @RequestParam(required = false) ApplicationStatus status) {

        return ResponseEntity.ok(
                applicationService.getApplications(status)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{applicationId}")
    public ResponseEntity<RestaurantOwnerApplication> getApplicationById(
            @PathVariable String applicationId) {

        return ResponseEntity.ok(
                applicationService.getApplicationById(applicationId)
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{applicationId}/approve")
    public ResponseEntity<RestaurantOwnerApplication> approveApplication(
            @PathVariable String applicationId,
            @RequestBody OwnerApplicationReviewRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                applicationService.approveApplication(
                        applicationId,
                        request.getAdminNote(),
                        authentication)
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{applicationId}/reject")
    public ResponseEntity<RestaurantOwnerApplication> rejectApplication(
            @PathVariable String applicationId,
            @RequestBody OwnerApplicationReviewRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                applicationService.rejectApplication(
                        applicationId,
                        request.getAdminNote(),
                        authentication)
        );
    }
}