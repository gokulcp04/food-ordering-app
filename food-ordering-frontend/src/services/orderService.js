import api from "./api";

export const checkout = async (
  deliveryAddress,
  paymentMethod
) => {
  const response = await api.post("/orders/checkout", {
    deliveryAddress,
    paymentMethod,
  });

  return response.data;
};
export const getMyOrders = async () => {
  const response = await api.get("/orders");

  return response.data;
};
export const cancelOrder = async (orderId) => {
  const response = await api.patch(
    `/orders/${orderId}/cancel`
  );

  return response.data;
};
export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);

  return response.data;
};
export const getRestaurantOrders = async (restaurantId) => {
  const response = await api.get(
    `/orders/restaurant/${restaurantId}`
  );

  return response.data;
};

export const updateOrderStatus = async (
  orderId,
  orderStatus
) => {
  const response = await api.patch(
    `/orders/${orderId}/status`,
    {
      orderStatus,
    }
  );

  return response.data;
};