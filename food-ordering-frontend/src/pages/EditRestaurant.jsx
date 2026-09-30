import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRestaurantById,
  updateRestaurant,
} from "../services/restaurantService";
import "./EditRestaurant.css";

function EditRestaurant() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    cuisine: "",
    deliveryTime: "",
    priceForTwo: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        setError("");

        const restaurant =
          await getRestaurantById(restaurantId);

        setFormData({
          name: restaurant.name || "",
          description: restaurant.description || "",
          address: restaurant.address || "",
          phone: restaurant.phone || "",
          cuisine: restaurant.cuisine || "",
          deliveryTime: restaurant.deliveryTime || "",
          priceForTwo: restaurant.priceForTwo ?? "",
          imageUrl: restaurant.imageUrl || "",
        });
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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      const restaurantData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        phone: formData.phone,
        cuisine: formData.cuisine,
        deliveryTime: Number(formData.deliveryTime),
        priceForTwo: Number(formData.priceForTwo),
        imageUrl: formData.imageUrl,
      };

      await updateRestaurant(
        restaurantId,
        restaurantData
      );

      navigate("/owner");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update restaurant."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="edit-restaurant-page">
        <div className="edit-restaurant-container">
          <div className="edit-loading">
            <div className="loading-spinner" />
            <p>Loading restaurant...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="edit-restaurant-page">
      <div className="edit-restaurant-container">
        <div className="edit-restaurant-header">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/owner")}
          >
            ← Back to dashboard
          </button>

          <p className="page-eyebrow">
            Restaurant management
          </p>

          <h1>Edit your restaurant</h1>

          <p className="page-description">
            Update your restaurant information and keep
            your customer-facing details accurate.
          </p>
        </div>

        <form
          className="restaurant-form"
          onSubmit={handleSubmit}
        >
          <section className="form-section">
            <div className="form-section-header">
              <div className="section-number">01</div>

              <div>
                <h2>Basic information</h2>
                <p>
                  Update the details customers see about
                  your restaurant.
                </p>
              </div>
            </div>

            <div className="form-fields">
              <div className="form-group full-width">
                <label htmlFor="restaurant-name">
                  Restaurant name
                </label>

                <input
                  id="restaurant-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="restaurant-description">
                  Description
                </label>

                <textarea
                  id="restaurant-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell customers about your restaurant..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="restaurant-cuisine">
                  Cuisine
                </label>

                <input
                  id="restaurant-cuisine"
                  type="text"
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="restaurant-phone">
                  Phone number
                </label>

                <input
                  id="restaurant-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </section>

          <section className="form-section">
            <div className="form-section-header">
              <div className="section-number">02</div>

              <div>
                <h2>Location & pricing</h2>
                <p>
                  Keep delivery and pricing information
                  up to date.
                </p>
              </div>
            </div>

            <div className="form-fields">
              <div className="form-group full-width">
                <label htmlFor="restaurant-address">
                  Address
                </label>

                <input
                  id="restaurant-address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="delivery-time">
                  Delivery time
                </label>

                <div className="input-with-suffix">
                  <input
                    id="delivery-time"
                    type="number"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleChange}
                    min="1"
                    required
                  />

                  <span>min</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="price-for-two">
                  Price for two
                </label>

                <div className="input-with-prefix">
                  <span>₹</span>

                  <input
                    id="price-for-two"
                    type="number"
                    name="priceForTwo"
                    value={formData.priceForTwo}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="form-section">
            <div className="form-section-header">
              <div className="section-number">03</div>

              <div>
                <h2>Restaurant image</h2>
                <p>
                  Change the image displayed for your
                  restaurant.
                </p>
              </div>
            </div>

            <div className="form-fields">
              <div className="form-group full-width">
                <label htmlFor="restaurant-image">
                  Image URL
                  <span className="optional-label">
                    Optional
                  </span>
                </label>

                <input
                  id="restaurant-image"
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/restaurant.jpg"
                />

                <span className="field-help">
                  Use a publicly accessible image URL.
                </span>
              </div>
            </div>
          </section>

          {error && (
            <div className="edit-restaurant-error">
              <span className="error-icon">!</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="secondary-action"
              onClick={() => navigate("/owner")}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-action"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="button-spinner" />
                  Saving changes...
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default EditRestaurant;