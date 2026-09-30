package com.foodapp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "restaurants")
public class Restaurant {

    @Id
    private String id;

    private String name;

    private String description;

    private String ownerId;

    private String address;

    private String phone;

    private String cuisine;

    private double rating;

    private int deliveryTime;

    private double priceForTwo;

    private String imageUrl;

    private boolean isApproved;

    private boolean isActive;

    private LocalDateTime createdAt;

    public Restaurant() {
    }

    public Restaurant(
            String id,
            String name,
            String description,
            String ownerId,
            String address,
            String phone,
            String cuisine,
            double rating,
            int deliveryTime,
            double priceForTwo,
            String imageUrl,
            boolean isApproved,
            boolean isActive,
            LocalDateTime createdAt) {

        this.id = id;
        this.name = name;
        this.description = description;
        this.ownerId = ownerId;
        this.address = address;
        this.phone = phone;
        this.cuisine = cuisine;
        this.rating = rating;
        this.deliveryTime = deliveryTime;
        this.priceForTwo = priceForTwo;
        this.imageUrl = imageUrl;
        this.isApproved = isApproved;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCuisine() {
        return cuisine;
    }

    public void setCuisine(String cuisine) {
        this.cuisine = cuisine;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getDeliveryTime() {
        return deliveryTime;
    }

    public void setDeliveryTime(int deliveryTime) {
        this.deliveryTime = deliveryTime;
    }

    public double getPriceForTwo() {
        return priceForTwo;
    }

    public void setPriceForTwo(double priceForTwo) {
        this.priceForTwo = priceForTwo;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean isApproved() {
        return isApproved;
    }

    public void setApproved(boolean approved) {
        isApproved = approved;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}