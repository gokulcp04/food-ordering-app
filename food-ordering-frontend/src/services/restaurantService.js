import api from "./api";

export const getActiveRestaurants = async () => {
  const response = await api.get("/restaurants/active");

  return response.data;
};

export const getMyRestaurants = async () => {
  const response = await api.get("/restaurants/my");

  return response.data;
};
export const createRestaurant = async (restaurantData) => {
  const response = await api.post(
    "/restaurants",
    restaurantData
  );

  return response.data;
};
export const getRestaurantById = async (restaurantId) => {
  const response = await api.get(
    `/restaurants/${restaurantId}`
  );

  return response.data;
};

export const updateRestaurant = async (
  restaurantId,
  restaurantData
) => {
  const response = await api.put(
    `/restaurants/${restaurantId}`,
    restaurantData
  );

  return response.data;
};
export const deleteRestaurant = async (restaurantId) => {
  const response = await api.delete(
    `/restaurants/${restaurantId}`
  );

  return response.data;
};