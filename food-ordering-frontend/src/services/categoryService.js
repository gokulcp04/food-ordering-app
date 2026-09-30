import api from "./api";

export const getRestaurantCategories = async (restaurantId) => {
  const response = await api.get(
    `/categories/restaurant/${restaurantId}`
  );

  return response.data;
};

export const createCategory = async (
  restaurantId,
  name,
  description
) => {
  const response = await api.post(
    `/categories/restaurant/${restaurantId}`,
    {
      name,
      description,
    }
  );

  return response.data;
};

export const updateCategory = async (
  categoryId,
  name,
  description
) => {
  const response = await api.put(
    `/categories/${categoryId}`,
    {
      name,
      description,
    }
  );

  return response.data;
};

export const updateCategoryStatus = async (
  categoryId,
  active
) => {
  const response = await api.patch(
    `/categories/${categoryId}/status?active=${active}`
  );

  return response.data;
};

export const deleteCategory = async (categoryId) => {
  const response = await api.delete(
    `/categories/${categoryId}`
  );

  return response.data;
};