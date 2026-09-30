package com.foodapp.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class AddToCartRequest {

    @NotBlank(message = "Food ID is required")
    private String foodId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;

    public AddToCartRequest() {
    }

    public String getFoodId() {
        return foodId;
    }

    public void setFoodId(String foodId) {
        this.foodId = foodId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}