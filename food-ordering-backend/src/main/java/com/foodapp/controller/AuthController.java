package com.foodapp.controller;

import com.foodapp.dto.ApiResponse;
import com.foodapp.dto.AuthResponse;
import com.foodapp.dto.LoginRequest;
import com.foodapp.dto.RegisterRequest;
import com.foodapp.dto.UserResponse;
import com.foodapp.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @RequestBody RegisterRequest request) {

        UserResponse response = authService.register(request);

        ApiResponse<UserResponse> apiResponse =
                new ApiResponse<>(
                        true,
                        "Registration successful",
                        response
                );

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @RequestBody LoginRequest request) {

        AuthResponse response = authService.login(request);

        ApiResponse<AuthResponse> apiResponse =
                new ApiResponse<>(
                        true,
                        "Login successful",
                        response
                );

        return ResponseEntity.ok(apiResponse);
    }
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            Authentication authentication) {

        UserResponse userResponse = authService.getCurrentUser(authentication);

        ApiResponse<UserResponse> response =
                new ApiResponse<>(
                        true,
                        "User retrieved successfully",
                        userResponse
                );

        return ResponseEntity.ok(response);
    }
}