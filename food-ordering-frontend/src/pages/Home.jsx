import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getActiveRestaurants } from "../services/restaurantService";
import greenLeafImage from "../assets/food/green-leaf.jpg";
import spiceRouteImage from "../assets/food/spice-route.jpg";
import urbanWokImage from "../assets/food/urban-wok.jpg";
import niyasKitchenImage from "../assets/food/niyas-kitchen.jpg";
import desertFlameImage from "../assets/food/desert-flame.jpg";
import stackAndGrillImage from "../assets/food/stack-and-grill.jpg";
import "./Home.css";

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const restaurantImages = {
  "Spice Route Kitchen": spiceRouteImage,
  "Green Leaf Bistro": greenLeafImage,
  "Urban Wok House": urbanWokImage,
  "Niyas Kitchen": niyasKitchenImage,
  "Desert Flame": desertFlameImage,
  "Stack & Grill": stackAndGrillImage,
};

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setError("");

        const data = await getActiveRestaurants();

        setRestaurants(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load restaurants."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  const cuisines = useMemo(() => {
    const cuisineMap = new Map();

    restaurants.forEach((restaurant) => {
      const cuisine = restaurant.cuisine?.trim();

      if (!cuisine) {
        return;
      }

      const normalized = cuisine.toLowerCase();

      if (!cuisineMap.has(normalized)) {
        cuisineMap.set(normalized, cuisine);
      }
    });

    return Array.from(cuisineMap.values());
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return restaurants;
    }

    return restaurants.filter((restaurant) => {
      const name = restaurant.name?.toLowerCase() || "";
      const cuisine = restaurant.cuisine?.toLowerCase() || "";
      const address = restaurant.address?.toLowerCase() || "";
      const description =
        restaurant.description?.toLowerCase() || "";

      return (
        name.includes(searchText) ||
        cuisine.includes(searchText) ||
        address.includes(searchText) ||
        description.includes(searchText)
      );
    });
  }, [restaurants, search]);

  const featuredRestaurants = useMemo(() => {
    return restaurants
      .filter((restaurant) => restaurantImages[restaurant.name])
      .slice(0, 3)
      .map((restaurant) => ({
        ...restaurant,
        localImage: restaurantImages[restaurant.name],
      }));
  }, [restaurants]);

  const handleCuisineClick = (cuisine) => {
    setSearch(cuisine);
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <main className="home-page">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <span className="home-eyebrow">
              FOODHUB · CHENNAI
            </span>

            <h1>
              Good food is
              <br />
              <span>closer than you think.</span>
            </h1>

            <p>
              Explore restaurants around you, discover new
              cuisines, and order your favourite meals from
              one place.
            </p>

            <div className="home-search">
              <span className="home-search-icon">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="6.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="m16 16 4.2 4.2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>

              <input
                type="text"
                placeholder="Search restaurants, cuisines or locations"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                aria-label="Search restaurants"
              />

              {search && (
                <button
                  type="button"
                  className="home-search-clear"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}

              <button
                type="button"
                className="home-search-button"
                onClick={() => {
                  document
                    .getElementById("restaurants")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
              >
                Search
              </button>
            </div>

            <div className="home-hero-meta">
              <span>
                <strong>{restaurants.length || "—"}</strong>{" "}
                restaurants
              </span>

              <span className="meta-divider" />

              <span>
                <strong>{cuisines.length || "—"}</strong>{" "}
                cuisines
              </span>

              <span className="meta-divider" />

              <span>Easy online ordering</span>
            </div>
          </div>

          {/* Hero image gallery */}
          <div className="home-hero-gallery">
            {featuredRestaurants.length > 0 ? (
              <>
                <div className="hero-gallery-main">
                  <img
                    src={featuredRestaurants[0].localImage}
                    alt={featuredRestaurants[0].name}
                  />

                  <div className="hero-gallery-label">
                    <span>Featured</span>

                    <strong>
                      {featuredRestaurants[0].name}
                    </strong>
                  </div>
                </div>

                {featuredRestaurants[1] && (
                  <div className="hero-gallery-small hero-gallery-small-top">
                    <img
                      src={featuredRestaurants[1].localImage}
                      alt={featuredRestaurants[1].name}
                    />
                  </div>
                )}

                {featuredRestaurants[2] && (
                  <div className="hero-gallery-small hero-gallery-small-bottom">
                    <img
                      src={featuredRestaurants[2].localImage}
                      alt={featuredRestaurants[2].name}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="hero-gallery-empty">
                <span>FoodHub</span>

                <strong>
                  Discover something delicious.
                </strong>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="home-content">
        {/* Cuisine discovery */}
        {cuisines.length > 0 && (
          <section className="cuisine-section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">
                  EXPLORE CUISINES
                </span>

                <h2>
                  What are you in the mood for?
                </h2>
              </div>
            </div>

            <div className="cuisine-list">
              {cuisines.map((cuisine) => {
                const isActive =
                  search.trim().toLowerCase() ===
                  cuisine.toLowerCase();

                return (
                  <button
                    type="button"
                    className={
                      isActive
                        ? "cuisine-chip active"
                        : "cuisine-chip"
                    }
                    key={cuisine.toLowerCase()}
                    onClick={() =>
                      handleCuisineClick(cuisine)
                    }
                  >
                    <span className="cuisine-dot" />

                    {cuisine}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Restaurants */}
        <section
          className="restaurant-section"
          id="restaurants"
        >
          <div className="section-heading restaurant-heading">
            <div>
              <span className="section-kicker">
                DISCOVER
              </span>

              <h2>
                {search
                  ? "Search results"
                  : "Restaurants around you"}
              </h2>
            </div>

            {!loading && !error && (
              <span className="restaurant-count">
                {filteredRestaurants.length}{" "}
                {filteredRestaurants.length === 1
                  ? "restaurant"
                  : "restaurants"}
              </span>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="restaurant-grid">
              {[1, 2, 3].map((item) => (
                <div
                  className="restaurant-card skeleton-card"
                  key={item}
                >
                  <div className="skeleton-image" />

                  <div className="skeleton-content">
                    <div className="skeleton-line large" />
                    <div className="skeleton-line" />
                    <div className="skeleton-line short" />
                    <div className="skeleton-button" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="home-message error-message">
              <div className="message-icon">!</div>

              <h3>Unable to load restaurants</h3>

              <p>{error}</p>
            </div>
          )}

          {/* Empty search */}
          {!loading &&
            !error &&
            filteredRestaurants.length === 0 && (
              <div className="home-message">
                <div className="message-icon">⌕</div>

                <h3>No restaurants found</h3>

                <p>
                  Try another restaurant, cuisine or
                  location.
                </p>

                <button
                  type="button"
                  onClick={clearSearch}
                >
                  View all restaurants
                </button>
              </div>
            )}

          {/* Restaurant cards */}
          {!loading &&
            !error &&
            filteredRestaurants.length > 0 && (
              <div className="restaurant-grid">
                {filteredRestaurants.map((restaurant) => {
                  const hasRating =
                    typeof restaurant.rating === "number" &&
                    restaurant.rating > 0;

                  const hasPrice =
                    typeof restaurant.priceForTwo ===
                      "number" &&
                    restaurant.priceForTwo > 0;

                  const localImage =
                    restaurantImages[restaurant.name];

                  return (
                    <article
                      className="restaurant-card"
                      key={restaurant.id}
                    >
                      <Link
                        to={`/restaurants/${restaurant.id}`}
                        className="restaurant-image-link"
                        aria-label={`View ${restaurant.name}`}
                      >
                        <div className="restaurant-image">
                          {localImage ? (
                            <img
                              src={localImage}
                              alt={restaurant.name}
                            />
                          ) : (
                            <div className="restaurant-image-fallback">
                              <span>FoodHub</span>
                            </div>
                          )}

                          {hasRating && (
                            <div className="restaurant-rating">
                              <span>★</span>

                              {restaurant.rating.toFixed(1)}
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="restaurant-card-content">
                        <div className="restaurant-title-row">
                          <h3>{restaurant.name}</h3>

                          {restaurant.deliveryTime > 0 && (
                            <span className="delivery-time">
                              {restaurant.deliveryTime} min
                            </span>
                          )}
                        </div>

                        <p className="restaurant-cuisine">
                          {restaurant.cuisine ||
                            "Multi-cuisine"}
                        </p>

                        {restaurant.address && (
                          <p className="restaurant-address">
                            <span>•</span>

                            {restaurant.address}
                          </p>
                        )}

                        <div className="restaurant-details">
                          {hasPrice && (
                            <span>
                              ₹{restaurant.priceForTwo} for
                              two
                            </span>
                          )}

                          {restaurant.phone && (
                            <span className="restaurant-phone">
                              {restaurant.phone}
                            </span>
                          )}
                        </div>

                        <Link
                          to={`/restaurants/${restaurant.id}`}
                          className="restaurant-button"
                        >
                          View restaurant

                          <span>→</span>
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
        </section>
      </div>
    </main>
  );
}

export default Home;