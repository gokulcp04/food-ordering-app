package com.foodapp.dto;

import com.foodapp.model.OrderStatus;

public class UpdateOrderStatusRequest {

    private OrderStatus orderStatus;

    public UpdateOrderStatusRequest() {
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }
}