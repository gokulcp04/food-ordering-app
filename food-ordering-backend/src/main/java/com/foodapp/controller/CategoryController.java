package com.foodapp.controller;

import com.foodapp.dto.CategoryRequest;
import com.foodapp.model.Category;
import com.foodapp.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // =========================
    // GET METHODS
    // =========================

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Category>> getCategoriesByRestaurant(
            @PathVariable String restaurantId) {

        return ResponseEntity.ok(
                categoryService.getCategoriesByRestaurant(restaurantId));
    }

    @GetMapping("/restaurant/{restaurantId}/active")
    public ResponseEntity<List<Category>> getActiveCategoriesByRestaurant(
            @PathVariable String restaurantId) {

        return ResponseEntity.ok(
                categoryService.getActiveCategoriesByRestaurant(restaurantId));
    }

    // =========================
    // CREATE
    // =========================

    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @PostMapping("/restaurant/{restaurantId}")
    public ResponseEntity<Category> createCategory(
            @PathVariable String restaurantId,
            @Valid @RequestBody CategoryRequest request,
            Authentication authentication) {

        Category savedCategory =
                categoryService.createCategory(
                        restaurantId,
                        request,
                        authentication.getName());

        return ResponseEntity.ok(savedCategory);
    }

    // =========================
    // UPDATE
    // =========================

    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @PutMapping("/{categoryId}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable String categoryId,
            @Valid @RequestBody CategoryRequest request,
            Authentication authentication) {

        Category updatedCategory =
                categoryService.updateCategory(
                        categoryId,
                        request,
                        authentication.getName());

        return ResponseEntity.ok(updatedCategory);
    }

    // =========================
    // DELETE
    // =========================

    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable String categoryId,
            Authentication authentication) {

        categoryService.deleteCategory(
                categoryId,
                authentication.getName());

        return ResponseEntity.noContent().build();
    }

    // =========================
    // STATUS
    // =========================

    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @PatchMapping("/{categoryId}/status")
    public ResponseEntity<Category> updateCategoryStatus(
            @PathVariable String categoryId,
            @RequestParam boolean active,
            Authentication authentication) {

        Category updatedCategory =
                categoryService.updateCategoryStatus(
                        categoryId,
                        active,
                        authentication.getName());

        return ResponseEntity.ok(updatedCategory);
    }
}