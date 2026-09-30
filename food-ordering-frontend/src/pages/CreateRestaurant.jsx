import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRestaurant } from "../services/restaurantService";
import "./CreateRestaurant.css";

function CreateRestaurant() {
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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

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

      await createRestaurant(restaurantData);

      navigate("/owner");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create restaurant."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-restaurant-page">
      <div className="create-restaurant-container">
        <div className="create-restaurant-header">
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

          <h1>Create your restaurant</h1>

          <p className="page-description">
            Add your restaurant details to start managing
            your menu and orders.
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
                  Tell customers about your restaurant.
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
                  placeholder="e.g. Spice Garden"
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
                  placeholder="Tell customers what makes your restaurant special..."
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
                  placeholder="e.g. Indian, Chinese"
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
                  placeholder="Restaurant contact number"
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
                  Help customers understand where you are
                  and what to expect.
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
                  placeholder="Full restaurant address"
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
                    placeholder="30"
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
                    placeholder="500"
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
                  Add an image URL to showcase your
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
            <div className="create-restaurant-error">
              <span className="error-icon">!</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="secondary-action"
              onClick={() => navigate("/owner")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-action"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner" />
                  Creating...
                </>
              ) : (
                "Create restaurant"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default CreateRestaurant;