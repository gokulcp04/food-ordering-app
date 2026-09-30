import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  submitOwnerApplication,
  getMyOwnerApplication,
} from "../services/ownerApplicationService";
import "./BecomeOwner.css";

const emptyForm = {
  fullName: "",
  phone: "",
  restaurantName: "",
  description: "",
  cuisine: "",
  address: "",
};

function BecomeOwner() {
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [checkingApplication, setCheckingApplication] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState(emptyForm);

  const checkApplication = useCallback(async () => {
    try {
      setCheckingApplication(true);
      setError("");

      const response = await getMyOwnerApplication();

      setApplication(response);
    } catch (err) {
      if (err.response?.status === 404) {
        // No previous application exists.
        setApplication(null);
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to check your application status."
        );
      }
    } finally {
      setCheckingApplication(false);
    }
  }, []);

  useEffect(() => {
    checkApplication();
  }, [checkApplication]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const applicationData = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      restaurantName: formData.restaurantName.trim(),
      description: formData.description.trim(),
      cuisine: formData.cuisine.trim(),
      address: formData.address.trim(),
    };

    try {
      setLoading(true);

      const response = await submitOwnerApplication(applicationData);

      setApplication(response);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit your application."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApplyAgain = () => {
    setApplication(null);
    setError("");
    setFormData(emptyForm);
  };

  /*
   * -------------------------------------------------------
   * Loading state
   * -------------------------------------------------------
   */

  if (checkingApplication) {
    return (
      <div className="become-owner-page">
        <div className="become-owner-loading">
          <div className="loading-spinner"></div>
          <p>Checking your application...</p>
        </div>
      </div>
    );
  }

  /*
   * -------------------------------------------------------
   * Pending application
   * -------------------------------------------------------
   */

  if (application?.status?.toUpperCase() === "PENDING") {
    return (
      <div className="become-owner-page">
        <div className="become-owner-container">
          <div className="application-status-card pending">
            <div className="status-icon">⏳</div>

            <h1>Application Under Review</h1>

            <p className="status-message">
              Your restaurant owner application has been
              submitted successfully and is currently being
              reviewed by our admin team.
            </p>

            <div className="application-summary">
              <div className="summary-row">
                <span>Restaurant</span>

                <strong>{application.restaurantName}</strong>
              </div>

              <div className="summary-row">
                <span>Cuisine</span>

                <strong>{application.cuisine}</strong>
              </div>

              <div className="summary-row">
                <span>Status</span>

                <span className="status-badge pending-badge">
                  Pending
                </span>
              </div>
            </div>

            <p className="status-help">
              Your application is waiting for admin approval.
            </p>

            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  /*
   * -------------------------------------------------------
   * Approved application
   * -------------------------------------------------------
   */

  if (application?.status?.toUpperCase() === "APPROVED") {
    return (
      <div className="become-owner-page">
        <div className="become-owner-container">
          <div className="application-status-card approved">
            <div className="status-icon">✓</div>

            <h1>Application Approved!</h1>

            <p className="status-message">
              Congratulations! Your restaurant owner
              application has been approved.
            </p>

            <div className="application-summary">
              <div className="summary-row">
                <span>Restaurant</span>

                <strong>{application.restaurantName}</strong>
              </div>

              <div className="summary-row">
                <span>Cuisine</span>

                <strong>{application.cuisine}</strong>
              </div>

              <div className="summary-row">
                <span>Status</span>

                <span className="status-badge approved-badge">
                  Approved
                </span>
              </div>
            </div>

            {application.adminNote && (
              <div className="approved-note">
                <strong>Admin note</strong>
                <p>{application.adminNote}</p>
              </div>
            )}

            <div className="approved-note">
              <strong>What's next?</strong>

              <p>
                Your account is now a restaurant owner.
                Please log out and log in again to refresh
                your account permissions, then open your
                owner dashboard.
              </p>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/")}
              >
                Back to Home
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={() => navigate("/owner")}
              >
                Owner Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
   * -------------------------------------------------------
   * Rejected application
   * -------------------------------------------------------
   */

  if (application?.status?.toUpperCase() === "REJECTED") {
    return (
      <div className="become-owner-page">
        <div className="become-owner-container">
          <div className="application-status-card rejected">
            <div className="status-icon">!</div>

            <h1>Application Not Approved</h1>

            <p className="status-message">
              Your previous application was not approved.
              You can review the admin feedback and submit
              another application.
            </p>

            <div className="application-summary">
              <div className="summary-row">
                <span>Restaurant</span>

                <strong>{application.restaurantName}</strong>
              </div>

              <div className="summary-row">
                <span>Cuisine</span>

                <strong>{application.cuisine}</strong>
              </div>

              <div className="summary-row">
                <span>Status</span>

                <span className="status-badge rejected-badge">
                  Rejected
                </span>
              </div>
            </div>

            {application.adminNote ? (
              <div className="rejection-note">
                <strong>Admin note</strong>
                <p>{application.adminNote}</p>
              </div>
            ) : (
              <div className="rejection-note">
                <strong>Admin note</strong>

                <p>
                  No additional feedback was provided by
                  the admin.
                </p>
              </div>
            )}

            <button
              type="button"
              className="primary-button"
              onClick={handleApplyAgain}
            >
              Apply Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /*
   * -------------------------------------------------------
   * No application — show application form
   * -------------------------------------------------------
   */

  return (
    <div className="become-owner-page">
      <div className="become-owner-container">
        <div className="become-owner-header">
          <h1>Become a Restaurant Owner</h1>

          <p>
            Share your restaurant details with us and
            start managing your restaurant on FoodHub.
          </p>
        </div>

        <div className="become-owner-card">
          <form onSubmit={handleSubmit}>
            {/* Personal information */}

            <section className="application-section">
              <h2>Personal information</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="fullName">
                    Full name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    Phone number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </section>

            {/* Restaurant information */}

            <section className="application-section">
              <h2>Restaurant information</h2>

              <div className="form-group">
                <label htmlFor="restaurantName">
                  Restaurant name
                </label>

                <input
                  id="restaurantName"
                  name="restaurantName"
                  type="text"
                  placeholder="Enter your restaurant name"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="cuisine">
                    Cuisine
                  </label>

                  <input
                    id="cuisine"
                    name="cuisine"
                    type="text"
                    placeholder="e.g. Indian, Chinese"
                    value={formData.cuisine}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">
                    Restaurant address
                  </label>

                  <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Enter restaurant address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Restaurant description
                </label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Tell us about your restaurant"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  rows="5"
                />
              </div>
            </section>

            {/* Error */}

            {error && (
              <div className="application-error">
                {error}
              </div>
            )}

            {/* Buttons */}

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BecomeOwner;