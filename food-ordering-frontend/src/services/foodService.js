import api from "./api";

export const getRestaurantFoods = async (restaurantId) => {
  const response = await api.get(
    `/foods/restaurant/${restaurantId}/available`
  );

  return response.data;
};

export const getAllRestaurantFoods = async (restaurantId) => {
  const response = await api.get(
    `/foods/restaurant/${restaurantId}`
  );

  return response.data;
};

export const createFood = async (
  restaurantId,
  categoryId,
  foodData
) => {
  const response = await api.post(
    `/foods/restaurant/${restaurantId}/category/${categoryId}`,
    foodData
  );

  return response.data;
};

export const updateFood = async (
  foodId,
  foodData
) => {
  const response = await api.put(
    `/foods/${foodId}`,
    foodData
  );

  return response.data;
};

export const updateFoodAvailability = async (
  foodId,
  available
) => {
  const response = await api.patch(
    `/foods/${foodId}/availability?available=${available}`
  );

  return response.data;
};

export const deleteFood = async (foodId) => {
  const response = await api.delete(
    `/foods/${foodId}`
  );

  return response.data;
};