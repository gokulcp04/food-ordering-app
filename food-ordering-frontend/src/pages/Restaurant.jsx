import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { getRestaurantFoods } from "../services/foodService";
import { addToCart } from "../services/cartService";

import greenLeafImage from "../assets/food/green-leaf.jpg";
import spiceRouteImage from "../assets/food/spice-route.jpg";
import urbanWokImage from "../assets/food/urban-wok.jpg";
import niyasKitchenImage from "../assets/food/niyas-kitchen.jpg";
import desertFlameImage from "../assets/food/desert-flame.jpg";
import stackAndGrillImage from "../assets/food/stack-and-grill.jpg";

import "./Restaurant.css";

function Restaurant() {
  const { restaurantId } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingFoodId, setAddingFoodId] = useState(null);

  const restaurantImages = {
    "Spice Route Kitchen": spiceRouteImage,
    "Green Leaf Bistro": greenLeafImage,
    "Urban Wok House": urbanWokImage,
    "Niyas Kitchen": niyasKitchenImage,
    "Desert Flame": desertFlameImage,
    "Stack & Grill": stackAndGrillImage,
  };

  const handleAddToCart = async (foodId) => {
    try {
      setAddingFoodId(foodId);

      await addToCart(foodId, 1);

      alert("Food added to cart");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to add food to cart."
      );
    } finally {
      setAddingFoodId(null);
    }
  };

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        setError("");

        const restaurantResponse = await api.get(
          `/restaurants/${restaurantId}`
        );

        const foodResponse =
          await getRestaurantFoods(restaurantId);

        setRestaurant(restaurantResponse.data);
        setFoods(foodResponse);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load restaurant."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRestaurant();
  }, [restaurantId]);

  if (loading) {
    return (
      <main className="restaurant-page">
        <div className="restaurant-loading">
          <div className="restaurant-loading-spinner" />

          <h2>Loading restaurant...</h2>

          <p>Getting the menu ready for you.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="restaurant-page">
        <div className="restaurant-state">
          <div className="restaurant-state-icon">⚠️</div>

          <h2>Unable to load restaurant</h2>

          <p>{error}</p>

          <Link to="/" className="restaurant-state-button">
            Back to restaurants
          </Link>
        </div>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="restaurant-page">
        <div className="restaurant-state">
          <div className="restaurant-state-icon">🍽️</div>

          <h2>Restaurant not found</h2>

          <p>
            The restaurant you're looking for doesn't
            exist or is no longer available.
          </p>

          <Link to="/" className="restaurant-state-button">
            Browse restaurants
          </Link>
        </div>
      </main>
    );
  }

  /*
   * Prefer our local curated image.
   * If no local image exists, use the backend imageUrl.
   */
  const localRestaurantImage =
    restaurantImages[restaurant.name];

  const restaurantImage =
    localRestaurantImage || restaurant.imageUrl;

  return (
    <main className="restaurant-page">
      <div className="restaurant-container">
        <Link to="/" className="restaurant-back">
          ← Back to restaurants
        </Link>

        {/* Restaurant Header */}
        <section className="restaurant-hero">
          <div className="restaurant-hero-image">
            {restaurantImage ? (
              <img
                src={restaurantImage}
                alt={restaurant.name}
                onError={(event) => {
                  event.currentTarget.style.display = "none";

                  const fallback =
                    event.currentTarget.parentElement.querySelector(
                      ".restaurant-hero-fallback"
                    );

                  if (fallback) {
                    fallback.style.display = "grid";
                  }
                }}
              />
            ) : null}

            <div
              className="restaurant-hero-fallback"
              style={{
                display: restaurantImage
                  ? "none"
                  : "grid",
              }}
            >
              <span>🍛</span>
            </div>
          </div>

          <div className="restaurant-hero-content">
            <span className="restaurant-hero-kicker">
              RESTAURANT
            </span>

            <h1>{restaurant.name}</h1>

            {restaurant.description && (
              <p className="restaurant-description">
                {restaurant.description}
              </p>
            )}

            <div className="restaurant-meta">
              {restaurant.rating > 0 && (
                <span className="restaurant-meta-item rating">
                  ⭐ {Number(restaurant.rating).toFixed(1)}
                </span>
              )}

              {restaurant.cuisine && (
                <span className="restaurant-meta-item">
                  🍽️ {restaurant.cuisine}
                </span>
              )}

              {restaurant.deliveryTime > 0 && (
                <span className="restaurant-meta-item">
                  🕐 {restaurant.deliveryTime} min
                </span>
              )}

              {restaurant.priceForTwo > 0 && (
                <span className="restaurant-meta-item">
                  ₹{restaurant.priceForTwo} for two
                </span>
              )}
            </div>

            <div className="restaurant-location">
              <span>📍</span>

              <div>
                <strong>Location</strong>
                <p>{restaurant.address}</p>
              </div>
            </div>

            {restaurant.phone && (
              <div className="restaurant-phone">
                <span>☎️</span>

                <div>
                  <strong>Contact</strong>
                  <p>{restaurant.phone}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Menu */}
        <section className="menu-section">
          <div className="menu-heading">
            <div>
              <span className="section-kicker">
                OUR MENU
              </span>

              <h2>Delicious food, made for you</h2>

              <p>
                Choose from our available dishes and add
                your favorites to the cart.
              </p>
            </div>

            <Link to="/cart" className="view-cart-button">
              View Cart →
            </Link>
          </div>

          {foods.length === 0 ? (
            <div className="menu-empty">
              <div>🍽️</div>

              <h3>No food items available</h3>

              <p>
                This restaurant hasn't added any available
                dishes yet.
              </p>
            </div>
          ) : (
            <div className="food-list">
              {foods.map((food) => (
                <article
                  className="food-card"
                  key={food.id}
                >
                  <div className="food-image">
                    {food.imageUrl ? (
                      <img
                        src={food.imageUrl}
                        alt={food.name}
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";

                          const fallback =
                            event.currentTarget.parentElement.querySelector(
                              ".food-image-fallback"
                            );

                          if (fallback) {
                            fallback.style.display = "grid";
                          }
                        }}
                      />
                    ) : null}

                    <div
                      className="food-image-fallback"
                      style={{
                        display: food.imageUrl
                          ? "none"
                          : "grid",
                      }}
                    >
                      <span>🍛</span>
                    </div>
                  </div>

                  <div className="food-content">
                    <div className="food-top-row">
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

                      <strong className="food-price">
                        ₹{food.price}
                      </strong>
                    </div>

                    {food.description && (
                      <p className="food-description">
                        {food.description}
                      </p>
                    )}

                    <div className="food-bottom-row">
                      <span className="preparation-time">
                        🕐 Preparation:{" "}
                        {food.preparationTime} min
                      </span>

                      <button
                        type="button"
                        className="add-to-cart-button"
                        onClick={() =>
                          handleAddToCart(food.id)
                        }
                        disabled={
                          addingFoodId === food.id
                        }
                      >
                        {addingFoodId === food.id
                          ? "Adding..."
                          : "+ Add to Cart"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Restaurant;