import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyRestaurants,
  deleteRestaurant,
} from "../services/restaurantService";
import { useAuth } from "../context/AuthContext";

import greenLeafImage from "../assets/food/green-leaf.jpg";
import spiceRouteImage from "../assets/food/spice-route.jpg";
import urbanWokImage from "../assets/food/urban-wok.jpg";
import niyasKitchenImage from "../assets/food/niyas-kitchen.jpg";
import desertFlameImage from "../assets/food/desert-flame.jpg";
import stackAndGrillImage from "../assets/food/stack-and-grill.jpg";

import "./OwnerDashboard.css";

function OwnerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [restaurants, setRestaurants] = useState([]);
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

        const response = await getMyRestaurants();

        setRestaurants(response);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load your restaurants."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  const handleDeleteRestaurant = async (restaurant) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${restaurant.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteRestaurant(restaurant.id);

      setRestaurants((currentRestaurants) =>
        currentRestaurants.filter(
          (currentRestaurant) =>
            currentRestaurant.id !== restaurant.id
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete restaurant."
      );
    }
  };

  const stats = useMemo(() => {
    return {
      total: restaurants.length,
      active: restaurants.filter(
        (restaurant) => restaurant.active
      ).length,
      approved: restaurants.filter(
        (restaurant) => restaurant.approved
      ).length,
      pending: restaurants.filter(
        (restaurant) => !restaurant.approved
      ).length,
    };
  }, [restaurants]);

  if (loading) {
    return (
      <main className="owner-dashboard-page">
        <div className="owner-dashboard-container">
          <div className="owner-dashboard-loading">
            <div className="owner-dashboard-spinner" />

            <h2>Loading your dashboard...</h2>

            <p>
              Getting your restaurant information ready.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error && restaurants.length === 0) {
    return (
      <main className="owner-dashboard-page">
        <div className="owner-dashboard-container">
          <div className="owner-dashboard-state">
            <div className="owner-state-icon">⚠️</div>

            <h2>Unable to load dashboard</h2>

            <p>{error}</p>

            <button
              type="button"
              className="owner-primary-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="owner-dashboard-page">
      <div className="owner-dashboard-container">
        <div className="owner-dashboard-header">
          <div>
            <span className="owner-dashboard-kicker">
              RESTAURANT MANAGEMENT
            </span>

            <h1>
              Welcome, {user?.name || "Restaurant Owner"}
            </h1>

            <p>
              Manage your restaurants, menus and customer
              orders from one place.
            </p>
          </div>

          <button
            type="button"
            className="owner-create-button"
            onClick={() =>
              navigate("/owner/restaurants/new")
            }
          >
            <span>+</span>
            Create Restaurant
          </button>
        </div>

        {error && (
          <div className="owner-inline-error">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Dashboard stats */}
        <section className="owner-stats">
          <div className="owner-stat-card">
            <div className="owner-stat-icon restaurants">
              🍽️
            </div>

            <div>
              <span>Total Restaurants</span>
              <strong>{stats.total}</strong>
            </div>
          </div>

          <div className="owner-stat-card">
            <div className="owner-stat-icon active">
              ✓
            </div>

            <div>
              <span>Active</span>
              <strong>{stats.active}</strong>
            </div>
          </div>

          <div className="owner-stat-card">
            <div className="owner-stat-icon approved">
              ✓
            </div>

            <div>
              <span>Approved</span>
              <strong>{stats.approved}</strong>
            </div>
          </div>

          <div className="owner-stat-card">
            <div className="owner-stat-icon pending">
              ⏳
            </div>

            <div>
              <span>Pending Approval</span>
              <strong>{stats.pending}</strong>
            </div>
          </div>
        </section>

        {/* Restaurants */}
        <section className="owner-section">
          <div className="owner-section-heading">
            <div>
              <span className="owner-section-kicker">
                YOUR BUSINESS
              </span>

              <h2>Your Restaurants</h2>

              <p>
                Manage the restaurants associated with your
                account.
              </p>
            </div>

            <span className="owner-section-count">
              {restaurants.length}{" "}
              {restaurants.length === 1
                ? "restaurant"
                : "restaurants"}
            </span>
          </div>

          {restaurants.length === 0 ? (
            <div className="owner-empty">
              <div className="owner-empty-icon">
                🍽️
              </div>

              <h3>No restaurant yet</h3>

              <p>
                Create your first restaurant to start
                managing your menu and receiving orders.
              </p>

              <button
                type="button"
                className="owner-primary-button"
                onClick={() =>
                  navigate("/owner/restaurants/new")
                }
              >
                + Create Restaurant
              </button>
            </div>
          ) : (
            <div className="owner-restaurant-grid">
              {restaurants.map((restaurant) => {
                const restaurantImage =
                  restaurantImages[restaurant.name] ||
                  restaurant.imageUrl;

                return (
                  <article
                    className="owner-restaurant-card"
                    key={restaurant.id}
                  >
                    <div className="owner-restaurant-image">
                      {restaurantImage ? (
                        <img
                          src={restaurantImage}
                          alt={restaurant.name}
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";

                            const fallback =
                              event.currentTarget.parentElement.querySelector(
                                ".owner-image-fallback"
                              );

                            if (fallback) {
                              fallback.style.display = "grid";
                            }
                          }}
                        />
                      ) : null}

                      <div
                        className="owner-image-fallback"
                        style={{
                          display: restaurantImage
                            ? "none"
                            : "grid",
                        }}
                      >
                        <span>🍛</span>
                      </div>

                      <div className="owner-status-badges">
                        <span
                          className={
                            restaurant.active
                              ? "owner-badge active"
                              : "owner-badge inactive"
                          }
                        >
                          <span className="badge-dot" />

                          {restaurant.active
                            ? "Active"
                            : "Inactive"}
                        </span>

                        <span
                          className={
                            restaurant.approved
                              ? "owner-badge approved"
                              : "owner-badge pending"
                          }
                        >
                          {restaurant.approved
                            ? "Approved"
                            : "Pending"}
                        </span>
                      </div>
                    </div>

                    <div className="owner-restaurant-content">
                      <div className="owner-restaurant-title">
                        <h3>{restaurant.name}</h3>

                        <span>
                          ⭐ {restaurant.rating ?? 0}
                        </span>
                      </div>

                      {restaurant.description && (
                        <p className="owner-restaurant-description">
                          {restaurant.description}
                        </p>
                      )}

                      <div className="owner-restaurant-info">
                        <div>
                          <span>CUISINE</span>

                          <strong>
                            {restaurant.cuisine ||
                              "Multi-cuisine"}
                          </strong>
                        </div>

                        <div>
                          <span>PRICE FOR TWO</span>

                          <strong>
                            {restaurant.priceForTwo > 0
                              ? `₹${restaurant.priceForTwo}`
                              : "Not set"}
                          </strong>
                        </div>
                      </div>

                      <div className="owner-restaurant-location">
                        <span>📍</span>

                        <p>{restaurant.address}</p>
                      </div>

                      {restaurant.phone && (
                        <div className="owner-restaurant-phone">
                          <span>☎️</span>

                          <p>{restaurant.phone}</p>
                        </div>
                      )}

                      <div className="owner-restaurant-actions">
                        <button
                          type="button"
                          className="owner-edit-button"
                          onClick={() =>
                            navigate(
                              `/owner/restaurants/${restaurant.id}/edit`
                            )
                          }
                        >
                          Edit Restaurant
                        </button>

                        <button
                          type="button"
                          className="owner-delete-button"
                          onClick={() =>
                            handleDeleteRestaurant(
                              restaurant
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Management */}
        <section className="owner-section owner-management-section">
          <div className="owner-section-heading">
            <div>
              <span className="owner-section-kicker">
                QUICK ACCESS
              </span>

              <h2>Manage your business</h2>

              <p>
                Jump directly to the tools you use most.
              </p>
            </div>
          </div>

          <div className="owner-management-grid">
            <button
              type="button"
              className="owner-management-card"
              onClick={() => navigate("/owner/menu")}
            >
              <div className="management-icon menu">
                🍽️
              </div>

              <div>
                <h3>Menu Management</h3>

                <p>
                  Add, edit and manage your food items.
                </p>
              </div>

              <span className="management-arrow">
                →
              </span>
            </button>

            <button
              type="button"
              className="owner-management-card"
              onClick={() => navigate("/owner/orders")}
            >
              <div className="management-icon orders">
                🧾
              </div>

              <div>
                <h3>Order Management</h3>

                <p>
                  View customer orders and update their
                  status.
                </p>
              </div>

              <span className="management-arrow">
                →
              </span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default OwnerDashboard;