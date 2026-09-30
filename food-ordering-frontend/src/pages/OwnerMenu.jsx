import { useEffect, useState } from "react";
import { getMyRestaurants } from "../services/restaurantService";
import {
  getRestaurantCategories,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
} from "../services/categoryService";
import {
  getAllRestaurantFoods,
  createFood,
  updateFood,
  updateFoodAvailability,
  deleteFood,
} from "../services/foodService";
import "./OwnerMenu.css";

function OwnerMenu() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] =
    useState("");

  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);

  const [loadingRestaurants, setLoadingRestaurants] =
    useState(true);
  const [loadingMenu, setLoadingMenu] = useState(false);

  const [error, setError] = useState("");

  const [showCategoryForm, setShowCategoryForm] =
    useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] =
    useState("");
  const [creatingCategory, setCreatingCategory] =
    useState(false);

  const [editingCategoryId, setEditingCategoryId] =
    useState(null);
  const [editCategoryName, setEditCategoryName] =
    useState("");
  const [editCategoryDescription, setEditCategoryDescription] =
    useState("");
  const [updatingCategory, setUpdatingCategory] =
    useState(false);

  const [showFoodForm, setShowFoodForm] = useState(false);
  const [foodName, setFoodName] = useState("");
  const [foodDescription, setFoodDescription] =
    useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [foodImageUrl, setFoodImageUrl] = useState("");
  const [foodIsVeg, setFoodIsVeg] = useState(true);
  const [foodPreparationTime, setFoodPreparationTime] =
    useState("");
  const [foodCategoryId, setFoodCategoryId] =
    useState("");
  const [creatingFood, setCreatingFood] = useState(false);

  const [editingFoodId, setEditingFoodId] = useState(null);
  const [editFoodName, setEditFoodName] = useState("");
  const [editFoodDescription, setEditFoodDescription] =
    useState("");
  const [editFoodPrice, setEditFoodPrice] = useState("");
  const [editFoodImageUrl, setEditFoodImageUrl] =
    useState("");
  const [editFoodIsVeg, setEditFoodIsVeg] = useState(true);
  const [editFoodPreparationTime, setEditFoodPreparationTime] =
    useState("");
  const [updatingFood, setUpdatingFood] = useState(false);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setError("");

        const response = await getMyRestaurants();

        setRestaurants(response);

        if (response.length > 0) {
          setSelectedRestaurantId(response[0].id);
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load your restaurants."
        );
      } finally {
        setLoadingRestaurants(false);
      }
    };

    loadRestaurants();
  }, []);

  const loadMenu = async (restaurantId) => {
    if (!restaurantId) {
      return;
    }

    setLoadingMenu(true);
    setError("");

    try {
      const [categoryResponse, foodResponse] =
        await Promise.all([
          getRestaurantCategories(restaurantId),
          getAllRestaurantFoods(restaurantId),
        ]);

      setCategories(categoryResponse);
      setFoods(foodResponse);

      if (categoryResponse.length > 0) {
        setFoodCategoryId(categoryResponse[0].id);
      } else {
        setFoodCategoryId("");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load menu."
      );
    } finally {
      setLoadingMenu(false);
    }
  };

  useEffect(() => {
    loadMenu(selectedRestaurantId);
  }, [selectedRestaurantId]);

  const handleCreateCategory = async (event) => {
    event.preventDefault();

    if (!categoryName.trim()) {
      setError("Category name is required.");
      return;
    }

    setCreatingCategory(true);
    setError("");

    try {
      const newCategory = await createCategory(
        selectedRestaurantId,
        categoryName,
        categoryDescription
      );

      setCategories((currentCategories) => [
        ...currentCategories,
        newCategory,
      ]);

      setFoodCategoryId(newCategory.id);
      setCategoryName("");
      setCategoryDescription("");
      setShowCategoryForm(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create category."
      );
    } finally {
      setCreatingCategory(false);
    }
  };

  const startEditingCategory = (category) => {
    setEditingCategoryId(category.id);
    setEditCategoryName(category.name);
    setEditCategoryDescription(
      category.description || ""
    );
    setError("");
  };

  const cancelEditingCategory = () => {
    setEditingCategoryId(null);
    setEditCategoryName("");
    setEditCategoryDescription("");
  };

  const handleUpdateCategory = async (event) => {
    event.preventDefault();

    if (!editCategoryName.trim()) {
      setError("Category name is required.");
      return;
    }

    setUpdatingCategory(true);
    setError("");

    try {
      const updatedCategory = await updateCategory(
        editingCategoryId,
        editCategoryName,
        editCategoryDescription
      );

      setCategories((currentCategories) =>
        currentCategories.map((category) =>
          category.id === updatedCategory.id
            ? updatedCategory
            : category
        )
      );

      cancelEditingCategory();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update category."
      );
    } finally {
      setUpdatingCategory(false);
    }
  };

  const handleToggleCategoryStatus = async (category) => {
    try {
      setError("");

      const updatedCategory =
        await updateCategoryStatus(
          category.id,
          !category.active
        );

      setCategories((currentCategories) =>
        currentCategories.map((currentCategory) =>
          currentCategory.id === updatedCategory.id
            ? updatedCategory
            : currentCategory
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update category status."
      );
    }
  };

  const handleDeleteCategory = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteCategory(category.id);

      setCategories((currentCategories) =>
        currentCategories.filter(
          (currentCategory) =>
            currentCategory.id !== category.id
        )
      );

      if (foodCategoryId === category.id) {
        setFoodCategoryId("");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete category."
      );
    }
  };

  const handleCreateFood = async (event) => {
    event.preventDefault();

    if (!foodName.trim()) {
      setError("Food name is required.");
      return;
    }

    if (!foodPrice || Number(foodPrice) <= 0) {
      setError("Food price must be greater than 0.");
      return;
    }

    if (!foodCategoryId) {
      setError("Please select a category.");
      return;
    }

    setCreatingFood(true);
    setError("");

    try {
      const newFood = await createFood(
        selectedRestaurantId,
        foodCategoryId,
        {
          name: foodName,
          description: foodDescription,
          price: Number(foodPrice),
          imageUrl: foodImageUrl,
          isVeg: foodIsVeg,
          preparationTime:
            Number(foodPreparationTime) || 0,
        }
      );

      setFoods((currentFoods) => [
        ...currentFoods,
        newFood,
      ]);

      setFoodName("");
      setFoodDescription("");
      setFoodPrice("");
      setFoodImageUrl("");
      setFoodIsVeg(true);
      setFoodPreparationTime("");
      setShowFoodForm(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create food item."
      );
    } finally {
      setCreatingFood(false);
    }
  };

  const startEditingFood = (food) => {
    setEditingFoodId(food.id);
    setEditFoodName(food.name);
    setEditFoodDescription(food.description || "");
    setEditFoodPrice(food.price);
    setEditFoodImageUrl(food.imageUrl || "");
    setEditFoodIsVeg(food.isVeg);
    setEditFoodPreparationTime(
      food.preparationTime
    );
    setError("");
  };

  const cancelEditingFood = () => {
    setEditingFoodId(null);
    setEditFoodName("");
    setEditFoodDescription("");
    setEditFoodPrice("");
    setEditFoodImageUrl("");
    setEditFoodIsVeg(true);
    setEditFoodPreparationTime("");
  };

  const handleUpdateFood = async (event) => {
    event.preventDefault();

    if (!editFoodName.trim()) {
      setError("Food name is required.");
      return;
    }

    if (!editFoodPrice || Number(editFoodPrice) <= 0) {
      setError("Food price must be greater than 0.");
      return;
    }

    setUpdatingFood(true);
    setError("");

    try {
      const updatedFood = await updateFood(
        editingFoodId,
        {
          name: editFoodName,
          description: editFoodDescription,
          price: Number(editFoodPrice),
          imageUrl: editFoodImageUrl,
          isVeg: editFoodIsVeg,
          preparationTime:
            Number(editFoodPreparationTime) || 0,
        }
      );

      setFoods((currentFoods) =>
        currentFoods.map((food) =>
          food.id === updatedFood.id
            ? updatedFood
            : food
        )
      );

      cancelEditingFood();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update food item."
      );
    } finally {
      setUpdatingFood(false);
    }
  };

  const handleToggleFoodAvailability = async (food) => {
    try {
      setError("");

      const updatedFood =
        await updateFoodAvailability(
          food.id,
          !food.available
        );

      setFoods((currentFoods) =>
        currentFoods.map((currentFood) =>
          currentFood.id === updatedFood.id
            ? updatedFood
            : currentFood
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update food availability."
      );
    }
  };

  const handleDeleteFood = async (food) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${food.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteFood(food.id);

      setFoods((currentFoods) =>
        currentFoods.filter(
          (currentFood) =>
            currentFood.id !== food.id
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete food."
      );
    }
  };

  if (loadingRestaurants) {
    return (
      <main className="owner-menu-page">
        <div className="owner-menu-container">
          <div className="owner-menu-loading">
            <div className="owner-menu-spinner" />

            <h2>Loading menu management...</h2>

            <p>
              Getting your restaurants and menu ready.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error && restaurants.length === 0) {
    return (
      <main className="owner-menu-page">
        <div className="owner-menu-container">
          <div className="owner-menu-state">
            <div className="owner-menu-state-icon">
              ⚠️
            </div>

            <h2>Unable to load restaurants</h2>

            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="owner-menu-page">
      <div className="owner-menu-container">
        <div className="owner-menu-header">
          <div>
            <span className="owner-menu-kicker">
              RESTAURANT MANAGEMENT
            </span>

            <h1>Menu Management</h1>

            <p>
              Organize categories and manage the food
              items available to your customers.
            </p>
          </div>
        </div>

        {restaurants.length === 0 ? (
          <section className="owner-menu-empty">
            <div className="owner-menu-empty-icon">
              🍽️
            </div>

            <h2>No restaurant found</h2>

            <p>
              Create a restaurant before managing its
              menu.
            </p>
          </section>
        ) : (
          <>
            {/* Restaurant selector */}
            <section className="restaurant-selector-card">
              <div className="restaurant-selector-icon">
                🏪
              </div>

              <div className="restaurant-selector-content">
                <label htmlFor="restaurant">
                  MANAGING RESTAURANT
                </label>

                <select
                  id="restaurant"
                  value={selectedRestaurantId}
                  onChange={(event) =>
                    setSelectedRestaurantId(
                      event.target.value
                    )
                  }
                >
                  {restaurants.map((restaurant) => (
                    <option
                      key={restaurant.id}
                      value={restaurant.id}
                    >
                      {restaurant.name}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {error && (
              <div className="owner-menu-error">
                <span>⚠️</span>
                <p>{error}</p>
              </div>
            )}

            {loadingMenu ? (
              <div className="owner-menu-loading-inline">
                <div className="owner-menu-spinner small" />

                <p>Loading menu...</p>
              </div>
            ) : (
              <>
                {/* Overview */}
                <section className="menu-overview">
                  <div className="menu-overview-card">
                    <span className="overview-icon">
                      📂
                    </span>

                    <div>
                      <span>Categories</span>
                      <strong>
                        {categories.length}
                      </strong>
                    </div>
                  </div>

                  <div className="menu-overview-card">
                    <span className="overview-icon">
                      🍛
                    </span>

                    <div>
                      <span>Total Items</span>
                      <strong>{foods.length}</strong>
                    </div>
                  </div>

                  <div className="menu-overview-card">
                    <span className="overview-icon available">
                      ✓
                    </span>

                    <div>
                      <span>Available</span>
                      <strong>
                        {
                          foods.filter(
                            (food) => food.available
                          ).length
                        }
                      </strong>
                    </div>
                  </div>

                  <div className="menu-overview-card">
                    <span className="overview-icon unavailable">
                      ×
                    </span>

                    <div>
                      <span>Unavailable</span>
                      <strong>
                        {
                          foods.filter(
                            (food) => !food.available
                          ).length
                        }
                      </strong>
                    </div>
                  </div>
                </section>

                {/* Categories */}
                <section className="owner-menu-section">
                  <div className="owner-menu-section-heading">
                    <div>
                      <span className="menu-section-kicker">
                        ORGANIZE
                      </span>

                      <h2>Categories</h2>

                      <p>
                        Group your food items into
                        categories for easier browsing.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="menu-primary-button"
                      onClick={() =>
                        setShowCategoryForm(
                          !showCategoryForm
                        )
                      }
                    >
                      <span>
                        {showCategoryForm ? "×" : "+"}
                      </span>

                      {showCategoryForm
                        ? "Close"
                        : "Add Category"}
                    </button>
                  </div>

                  {showCategoryForm && (
                    <form
                      className="menu-form-card"
                      onSubmit={handleCreateCategory}
                    >
                      <div className="menu-form-header">
                        <div>
                          <span className="menu-form-kicker">
                            NEW CATEGORY
                          </span>

                          <h3>Create Category</h3>
                        </div>
                      </div>

                      <div className="menu-form-grid">
                        <div className="menu-field">
                          <label htmlFor="categoryName">
                            Category Name
                          </label>

                          <input
                            id="categoryName"
                            type="text"
                            value={categoryName}
                            onChange={(event) =>
                              setCategoryName(
                                event.target.value
                              )
                            }
                            placeholder="e.g. Starters"
                            required
                          />
                        </div>

                        <div className="menu-field">
                          <label htmlFor="categoryDescription">
                            Description
                          </label>

                          <input
                            id="categoryDescription"
                            type="text"
                            value={
                              categoryDescription
                            }
                            onChange={(event) =>
                              setCategoryDescription(
                                event.target.value
                              )
                            }
                            placeholder="Describe this category"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="menu-submit-button"
                        disabled={creatingCategory}
                      >
                        {creatingCategory
                          ? "Creating..."
                          : "Create Category"}
                      </button>
                    </form>
                  )}

                  {categories.length === 0 ? (
                    <div className="menu-section-empty">
                      <div>📂</div>

                      <h3>No categories yet</h3>

                      <p>
                        Create your first category to
                        start organizing the menu.
                      </p>
                    </div>
                  ) : (
                    <div className="category-grid">
                      {categories.map((category) => (
                        <article
                          className="category-card"
                          key={category.id}
                        >
                          {editingCategoryId ===
                          category.id ? (
                            <form
                              className="category-edit-form"
                              onSubmit={
                                handleUpdateCategory
                              }
                            >
                              <span className="category-edit-kicker">
                                EDIT CATEGORY
                              </span>

                              <input
                                type="text"
                                value={
                                  editCategoryName
                                }
                                onChange={(event) =>
                                  setEditCategoryName(
                                    event.target.value
                                  )
                                }
                                required
                              />

                              <textarea
                                value={
                                  editCategoryDescription
                                }
                                onChange={(event) =>
                                  setEditCategoryDescription(
                                    event.target.value
                                  )
                                }
                                rows={3}
                                placeholder="Category description"
                              />

                              <div className="category-edit-actions">
                                <button
                                  type="submit"
                                  className="menu-small-primary"
                                  disabled={
                                    updatingCategory
                                  }
                                >
                                  {updatingCategory
                                    ? "Saving..."
                                    : "Save"}
                                </button>

                                <button
                                  type="button"
                                  className="menu-small-secondary"
                                  onClick={
                                    cancelEditingCategory
                                  }
                                  disabled={
                                    updatingCategory
                                  }
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <div className="category-card-top">
                                <div className="category-icon">
                                  📂
                                </div>

                                <span
                                  className={
                                    category.active
                                      ? "category-status active"
                                      : "category-status inactive"
                                  }
                                >
                                  {category.active
                                    ? "Active"
                                    : "Inactive"}
                                </span>
                              </div>

                              <h3>{category.name}</h3>

                              <p>
                                {category.description ||
                                  "No description provided."}
                              </p>

                              <div className="category-actions">
                                <button
                                  type="button"
                                  onClick={() =>
                                    startEditingCategory(
                                      category
                                    )
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleToggleCategoryStatus(
                                      category
                                    )
                                  }
                                >
                                  {category.active
                                    ? "Deactivate"
                                    : "Activate"}
                                </button>

                                <button
                                  type="button"
                                  className="danger"
                                  onClick={() =>
                                    handleDeleteCategory(
                                      category
                                    )
                                  }
                                >
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </article>
                      ))}
                    </div>
                  )}
                </section>

                {/* Food items */}
                <section className="owner-menu-section food-section">
                  <div className="owner-menu-section-heading">
                    <div>
                      <span className="menu-section-kicker">
                        MENU ITEMS
                      </span>

                      <h2>Food Items</h2>

                      <p>
                        Add and manage the dishes your
                        customers can order.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="menu-primary-button"
                      onClick={() =>
                        setShowFoodForm(!showFoodForm)
                      }
                      disabled={categories.length === 0}
                    >
                      <span>
                        {showFoodForm ? "×" : "+"}
                      </span>

                      {showFoodForm
                        ? "Close"
                        : "Add Food"}
                    </button>
                  </div>

                  {categories.length === 0 && (
                    <div className="menu-warning">
                      <span>💡</span>

                      <p>
                        Create a category before adding
                        food items.
                      </p>
                    </div>
                  )}

                  {showFoodForm &&
                    categories.length > 0 && (
                      <form
                        className="menu-form-card food-form"
                        onSubmit={handleCreateFood}
                      >
                        <div className="menu-form-header">
                          <div>
                            <span className="menu-form-kicker">
                              NEW MENU ITEM
                            </span>

                            <h3>Create Food Item</h3>
                          </div>
                        </div>

                        <div className="food-form-grid">
                          <div className="menu-field full">
                            <label htmlFor="foodName">
                              Food Name
                            </label>

                            <input
                              id="foodName"
                              type="text"
                              value={foodName}
                              onChange={(event) =>
                                setFoodName(
                                  event.target.value
                                )
                              }
                              placeholder="e.g. Chicken Biryani"
                              required
                            />
                          </div>

                          <div className="menu-field full">
                            <label htmlFor="foodDescription">
                              Description
                            </label>

                            <textarea
                              id="foodDescription"
                              value={
                                foodDescription
                              }
                              onChange={(event) =>
                                setFoodDescription(
                                  event.target.value
                                )
                              }
                              placeholder="Describe the dish"
                              rows={3}
                            />
                          </div>

                          <div className="menu-field">
                            <label htmlFor="foodPrice">
                              Price
                            </label>

                            <input
                              id="foodPrice"
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={foodPrice}
                              onChange={(event) =>
                                setFoodPrice(
                                  event.target.value
                                )
                              }
                              placeholder="250"
                              required
                            />
                          </div>

                          <div className="menu-field">
                            <label htmlFor="foodCategory">
                              Category
                            </label>

                            <select
                              id="foodCategory"
                              value={foodCategoryId}
                              onChange={(event) =>
                                setFoodCategoryId(
                                  event.target.value
                                )
                              }
                              required
                            >
                              {categories.map(
                                (category) => (
                                  <option
                                    key={
                                      category.id
                                    }
                                    value={
                                      category.id
                                    }
                                  >
                                    {category.name}
                                  </option>
                                )
                              )}
                            </select>
                          </div>

                          <div className="menu-field">
                            <label htmlFor="foodImageUrl">
                              Image URL
                            </label>

                            <input
                              id="foodImageUrl"
                              type="url"
                              value={foodImageUrl}
                              onChange={(event) =>
                                setFoodImageUrl(
                                  event.target.value
                                )
                              }
                              placeholder="https://example.com/food.jpg"
                            />
                          </div>

                          <div className="menu-field">
                            <label htmlFor="foodPreparationTime">
                              Preparation Time
                            </label>

                            <div className="input-with-suffix">
                              <input
                                id="foodPreparationTime"
                                type="number"
                                min="0"
                                value={
                                  foodPreparationTime
                                }
                                onChange={(event) =>
                                  setFoodPreparationTime(
                                    event.target.value
                                  )
                                }
                                placeholder="20"
                              />

                              <span>min</span>
                            </div>
                          </div>
                        </div>

                        <label className="veg-checkbox">
                          <input
                            type="checkbox"
                            checked={foodIsVeg}
                            onChange={(event) =>
                              setFoodIsVeg(
                                event.target.checked
                              )
                            }
                          />

                          <span className="custom-checkbox">
                            ✓
                          </span>

                          <span>
                            Vegetarian item
                          </span>
                        </label>

                        <button
                          type="submit"
                          className="menu-submit-button"
                          disabled={creatingFood}
                        >
                          {creatingFood
                            ? "Creating..."
                            : "Create Food Item"}
                        </button>
                      </form>
                    )}

                  {foods.length === 0 ? (
                    <div className="menu-section-empty">
                      <div>🍛</div>

                      <h3>No food items yet</h3>

                      <p>
                        Add your first dish to start
                        building your restaurant menu.
                      </p>
                    </div>
                  ) : (
                    <div className="food-grid">
                      {foods.map((food) => (
                        <article
                          className="owner-food-card"
                          key={food.id}
                        >
                          {editingFoodId === food.id ? (
                            <form
                              className="food-edit-form"
                              onSubmit={
                                handleUpdateFood
                              }
                            >
                              <span className="menu-form-kicker">
                                EDIT MENU ITEM
                              </span>

                              <input
                                type="text"
                                value={editFoodName}
                                onChange={(event) =>
                                  setEditFoodName(
                                    event.target.value
                                  )
                                }
                                placeholder="Food name"
                                required
                              />

                              <textarea
                                value={
                                  editFoodDescription
                                }
                                onChange={(event) =>
                                  setEditFoodDescription(
                                    event.target.value
                                  )
                                }
                                rows={3}
                                placeholder="Food description"
                              />

                              <div className="edit-food-row">
                                <input
                                  type="number"
                                  min="0.01"
                                  step="0.01"
                                  value={
                                    editFoodPrice
                                  }
                                  onChange={(event) =>
                                    setEditFoodPrice(
                                      event.target.value
                                    )
                                  }
                                  placeholder="Price"
                                  required
                                />

                                <input
                                  type="number"
                                  min="0"
                                  value={
                                    editFoodPreparationTime
                                  }
                                  onChange={(event) =>
                                    setEditFoodPreparationTime(
                                      event.target.value
                                    )
                                  }
                                  placeholder="Prep time"
                                />
                              </div>

                              <input
                                type="url"
                                value={
                                  editFoodImageUrl
                                }
                                onChange={(event) =>
                                  setEditFoodImageUrl(
                                    event.target.value
                                  )
                                }
                                placeholder="Image URL"
                              />

                              <label className="veg-checkbox">
                                <input
                                  type="checkbox"
                                  checked={
                                    editFoodIsVeg
                                  }
                                  onChange={(event) =>
                                    setEditFoodIsVeg(
                                      event.target
                                        .checked
                                    )
                                  }
                                />

                                <span className="custom-checkbox">
                                  ✓
                                </span>

                                <span>
                                  Vegetarian item
                                </span>
                              </label>

                              <div className="food-edit-actions">
                                <button
                                  type="submit"
                                  className="menu-small-primary"
                                  disabled={
                                    updatingFood
                                  }
                                >
                                  {updatingFood
                                    ? "Saving..."
                                    : "Save Changes"}
                                </button>

                                <button
                                  type="button"
                                  className="menu-small-secondary"
                                  onClick={
                                    cancelEditingFood
                                  }
                                  disabled={
                                    updatingFood
                                  }
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <div className="food-card-image">
                                {food.imageUrl ? (
                                  <img
                                    src={
                                      food.imageUrl
                                    }
                                    alt={food.name}
                                    onError={(
                                      event
                                    ) => {
                                      event.currentTarget.style.display =
                                        "none";

                                      const fallback =
                                        event
                                          .currentTarget
                                          .parentElement.querySelector(
                                            ".food-image-fallback"
                                          );

                                      if (fallback) {
                                        fallback.style.display =
                                          "grid";
                                      }
                                    }}
                                  />
                                ) : null}

                                <div
                                  className="food-image-fallback"
                                  style={{
                                    display:
                                      food.imageUrl
                                        ? "none"
                                        : "grid",
                                  }}
                                >
                                  <span>🍛</span>
                                </div>

                                <span
                                  className={
                                    food.available
                                      ? "food-availability available"
                                      : "food-availability unavailable"
                                  }
                                >
                                  {food.available
                                    ? "Available"
                                    : "Unavailable"}
                                </span>
                              </div>

                              <div className="food-card-content">
                                <div className="food-card-title-row">
                                  <div>
                                    <h3>{food.name}</h3>

                                    <span
                                      className={
  food.isVeg
    ? "food-type veg"
    : "food-type non-veg"
}
                                    >
                                      <span className="food-type-dot" />

                                      {food.isVeg
  ? "Veg"
  : "Non-Veg"}
                                    </span>
                                  </div>

                                  <strong>
                                    ₹{food.price}
                                  </strong>
                                </div>

                                <p className="food-card-description">
                                  {food.description ||
                                    "No description provided."}
                                </p>

                                <div className="food-card-meta">
                                  <span>
                                    🕐{" "}
                                    {
                                      food.preparationTime
                                    }{" "}
                                    min
                                  </span>
                                </div>

                                <div className="food-card-actions">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      startEditingFood(
                                        food
                                      )
                                    }
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleToggleFoodAvailability(
                                        food
                                      )
                                    }
                                  >
                                    {food.available
                                      ? "Unavailable"
                                      : "Available"}
                                  </button>

                                  <button
                                    type="button"
                                    className="danger"
                                    onClick={() =>
                                      handleDeleteFood(
                                        food
                                      )
                                    }
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default OwnerMenu;