import { useEffect, useState } from "react";
import api from "../services/api";
import {
  getOwnerApplications,
  approveOwnerApplication,
  rejectOwnerApplication,
} from "../services/adminOwnerApplicationService";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [ownerApplications, setOwnerApplications] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRestaurants, setLoadingRestaurants] =
    useState(true);
  const [applicationsLoading, setApplicationsLoading] =
    useState(true);

  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [updatingRestaurantId, setUpdatingRestaurantId] =
    useState(null);
  const [reviewingApplicationId, setReviewingApplicationId] =
    useState(null);

  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setError("");

      const response = await api.get("/admin/users");

      setUsers(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadRestaurants = async () => {
    try {
      setError("");

      const response = await api.get("/admin/restaurants");

      setRestaurants(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load restaurants."
      );
    } finally {
      setLoadingRestaurants(false);
    }
  };

  const loadOwnerApplications = async () => {
    try {
      setApplicationsLoading(true);

      const response = await getOwnerApplications("PENDING");

      /*
       * adminOwnerApplicationService already returns
       * response.data, so response itself is the array.
       */
      setOwnerApplications(response || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load owner applications."
      );
    } finally {
      setApplicationsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadRestaurants();
    loadOwnerApplications();
  }, []);

  const handleUserStatusChange = async (
    userId,
    active
  ) => {
    try {
      setError("");
      setUpdatingUserId(userId);

      await api.patch(
        `/admin/users/${userId}/status?active=${active}`
      );

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId
            ? { ...user, active }
            : user
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update user status."
      );
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleRestaurantApprovalChange = async (
    restaurantId,
    approved
  ) => {
    try {
      setError("");
      setUpdatingRestaurantId(restaurantId);

      const response = await api.patch(
        `/admin/restaurants/${restaurantId}/approval?approved=${approved}`
      );

      setRestaurants((currentRestaurants) =>
        currentRestaurants.map((restaurant) =>
          restaurant.id === restaurantId
            ? response.data
            : restaurant
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update restaurant approval."
      );
    } finally {
      setUpdatingRestaurantId(null);
    }
  };

  const handleRestaurantStatusChange = async (
    restaurantId,
    active
  ) => {
    try {
      setError("");
      setUpdatingRestaurantId(restaurantId);

      const response = await api.patch(
        `/admin/restaurants/${restaurantId}/status?active=${active}`
      );

      setRestaurants((currentRestaurants) =>
        currentRestaurants.map((restaurant) =>
          restaurant.id === restaurantId
            ? response.data
            : restaurant
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update restaurant status."
      );
    } finally {
      setUpdatingRestaurantId(null);
    }
  };

  const handleOwnerApplicationReview = async (
    application,
    action
  ) => {
    const actionLabel =
      action === "approve" ? "approve" : "reject";

    const adminNote = window.prompt(
      `Optional note for this ${actionLabel} decision:`,
      ""
    );

    // User clicked Cancel in the prompt.
    if (adminNote === null) {
      return;
    }

    try {
      setError("");
      setReviewingApplicationId(application.id);

      if (action === "approve") {
        await approveOwnerApplication(
          application.id,
          adminNote
        );
      } else {
        await rejectOwnerApplication(
          application.id,
          adminNote
        );
      }

      /*
       * Remove the reviewed application from the
       * pending list immediately.
       */
      setOwnerApplications((currentApplications) =>
        currentApplications.filter(
          (currentApplication) =>
            currentApplication.id !== application.id
        )
      );

      /*
       * If approved, the user's role changes from
       * CUSTOMER to RESTAURANT_OWNER.
       *
       * Reload users so the Users table immediately
       * shows the new role.
       */
      await loadUsers();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          `Failed to ${actionLabel} owner application.`
      );
    } finally {
      setReviewingApplicationId(null);
    }
  };

  const totalUsers = users.length;

  const totalCustomers = users.filter(
    (user) => user.role === "CUSTOMER"
  ).length;

  const totalOwners = users.filter(
    (user) => user.role === "RESTAURANT_OWNER"
  ).length;

  const totalRestaurants = restaurants.length;

  const approvedRestaurants = restaurants.filter(
    (restaurant) => restaurant.approved
  ).length;

  const pendingRestaurants = restaurants.filter(
    (restaurant) => !restaurant.approved
  ).length;

  const activeRestaurants = restaurants.filter(
    (restaurant) => restaurant.active
  ).length;

  const inactiveRestaurants = restaurants.filter(
    (restaurant) => !restaurant.active
  ).length;

  const getRoleLabel = (role) => {
    switch (role) {
      case "RESTAURANT_OWNER":
        return "Restaurant Owner";

      case "ADMIN":
        return "Admin";

      case "CUSTOMER":
        return "Customer";

      default:
        return role;
    }
  };

  return (
    <main className="admin-page">
      <div className="admin-container">
        {/* Header */}

        <section className="admin-header">
          <div>
            <p className="admin-eyebrow">
              Platform administration
            </p>

            <h1>Admin Dashboard</h1>

            <p className="admin-description">
              Manage platform users and restaurant
              availability from one place.
            </p>
          </div>
        </section>

        {/* Global error */}

        {error && (
          <div className="admin-error">
            <span className="admin-error-icon">!</span>
            <span>{error}</span>
          </div>
        )}

        {/* Overview */}

        <section className="admin-section">
          <div className="section-heading">
            <div>
              <h2>Platform overview</h2>

              <p>
                Current users and restaurant status.
              </p>
            </div>
          </div>

          <div className="admin-stats">
            <div className="admin-stat-card">
              <div className="admin-stat-icon users">
                👥
              </div>

              <div>
                <span>Total users</span>

                <strong>
                  {loadingUsers ? "..." : totalUsers}
                </strong>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon customers">
                👤
              </div>

              <div>
                <span>Customers</span>

                <strong>
                  {loadingUsers
                    ? "..."
                    : totalCustomers}
                </strong>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon owners">
                🏪
              </div>

              <div>
                <span>Restaurant owners</span>

                <strong>
                  {loadingUsers
                    ? "..."
                    : totalOwners}
                </strong>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon restaurants">
                🍽
              </div>

              <div>
                <span>Total restaurants</span>

                <strong>
                  {loadingRestaurants
                    ? "..."
                    : totalRestaurants}
                </strong>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon approved">
                ✓
              </div>

              <div>
                <span>Approved restaurants</span>

                <strong>
                  {loadingRestaurants
                    ? "..."
                    : approvedRestaurants}
                </strong>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon pending">
                ◷
              </div>

              <div>
                <span>Pending approval</span>

                <strong>
                  {loadingRestaurants
                    ? "..."
                    : pendingRestaurants}
                </strong>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon active">
                ●
              </div>

              <div>
                <span>Active restaurants</span>

                <strong>
                  {loadingRestaurants
                    ? "..."
                    : activeRestaurants}
                </strong>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon inactive">
                ○
              </div>

              <div>
                <span>Inactive restaurants</span>

                <strong>
                  {loadingRestaurants
                    ? "..."
                    : inactiveRestaurants}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* Users */}

        <section className="admin-section">
          <div className="section-heading">
            <div>
              <h2>Users</h2>

              <p>
                Manage account access and user status.
              </p>
            </div>

            {!loadingUsers && (
              <span className="section-count">
                {users.length}{" "}
                {users.length === 1
                  ? "user"
                  : "users"}
              </span>
            )}
          </div>

          <div className="admin-table-card">
            {loadingUsers ? (
              <div className="admin-loading">
                <div className="loading-spinner" />

                <p>Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="admin-empty">
                <div className="empty-icon">👥</div>

                <h3>No users found</h3>

                <p>
                  There are currently no users to
                  display.
                </p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">
                              {user.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "U"}
                            </div>

                            <div>
                              <strong>
                                {user.name}
                              </strong>

                              <span>
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          {user.phone || "—"}
                        </td>

                        <td>
                          <span
                            className={`role-badge role-${user.role?.toLowerCase()}`}
                          >
                            {getRoleLabel(user.role)}
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              user.active
                                ? "status-badge active"
                                : "status-badge inactive"
                            }
                          >
                            <span />

                            {user.active
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        <td>
                          {user.email ===
                          "admin@gmail.com" ? (
                            <span className="protected-label">
                              Current admin
                            </span>
                          ) : (
                            <button
                              type="button"
                              className={
                                user.active
                                  ? "table-action danger"
                                  : "table-action"
                              }
                              onClick={() =>
                                handleUserStatusChange(
                                  user.id,
                                  !user.active
                                )
                              }
                              disabled={
                                updatingUserId ===
                                user.id
                              }
                            >
                              {updatingUserId ===
                              user.id
                                ? "Updating..."
                                : user.active
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Restaurant Owner Applications */}

        <section className="admin-section">
          <div className="section-heading">
            <div>
              <h2>
                Restaurant Owner Applications
              </h2>

              <p>
                Review applications from customers who
                want to become restaurant owners.
              </p>
            </div>

            {!applicationsLoading && (
              <span className="section-count">
                {ownerApplications.length}{" "}
                pending
              </span>
            )}
          </div>

          <div className="admin-table-card">
            {applicationsLoading ? (
              <div className="admin-loading">
                <div className="loading-spinner" />

                <p>
                  Loading owner applications...
                </p>
              </div>
            ) : ownerApplications.length === 0 ? (
              <div className="admin-empty">
                <div className="empty-icon">
                  🏪
                </div>

                <h3>
                  No pending applications
                </h3>

                <p>
                  There are currently no restaurant
                  owner applications waiting for review.
                </p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Phone</th>
                      <th>Restaurant</th>
                      <th>Cuisine</th>
                      <th>Address</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {ownerApplications.map(
                      (application) => {
                        const isReviewing =
                          reviewingApplicationId ===
                          application.id;

                        return (
                          <tr key={application.id}>
                            <td>
                              <div className="user-cell">
                                <div className="user-avatar">
                                  {application.fullName
                                    ?.charAt(0)
                                    ?.toUpperCase() ||
                                    "U"}
                                </div>

                                <div>
                                  <strong>
                                    {application.fullName}
                                  </strong>

                                  <span>
                                    {application.email}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td>
                              {application.phone ||
                                "—"}
                            </td>

                            <td>
                              <div className="restaurant-cell">
                                <strong>
                                  {
                                    application.restaurantName
                                  }
                                </strong>
                              </div>
                            </td>

                            <td>
                              {application.cuisine ||
                                "—"}
                            </td>

                            <td>
                              {application.address ||
                                "—"}
                            </td>

                            <td>
                              <span className="status-badge pending">
                                <span />
                                Pending
                              </span>
                            </td>

                            <td>
                              <div className="restaurant-actions">
                                <button
                                  type="button"
                                  className="table-action"
                                  onClick={() =>
                                    handleOwnerApplicationReview(
                                      application,
                                      "approve"
                                    )
                                  }
                                  disabled={isReviewing}
                                >
                                  {isReviewing
                                    ? "Updating..."
                                    : "Approve"}
                                </button>

                                <button
                                  type="button"
                                  className="table-action danger"
                                  onClick={() =>
                                    handleOwnerApplicationReview(
                                      application,
                                      "reject"
                                    )
                                  }
                                  disabled={isReviewing}
                                >
                                  {isReviewing
                                    ? "Updating..."
                                    : "Reject"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Restaurants */}

        <section className="admin-section">
          <div className="section-heading">
            <div>
              <h2>Restaurants</h2>

              <p>
                Review approval and platform
                availability.
              </p>
            </div>

            {!loadingRestaurants && (
              <span className="section-count">
                {restaurants.length}{" "}
                {restaurants.length === 1
                  ? "restaurant"
                  : "restaurants"}
              </span>
            )}
          </div>

          <div className="admin-table-card">
            {loadingRestaurants ? (
              <div className="admin-loading">
                <div className="loading-spinner" />

                <p>
                  Loading restaurants...
                </p>
              </div>
            ) : restaurants.length === 0 ? (
              <div className="admin-empty">
                <div className="empty-icon">
                  🍽
                </div>

                <h3>No restaurants found</h3>

                <p>
                  There are currently no restaurants
                  to display.
                </p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="admin-table restaurants-table">
                  <thead>
                    <tr>
                      <th>Restaurant</th>
                      <th>Owner</th>
                      <th>Cuisine</th>
                      <th>Approval</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {restaurants.map(
                      (restaurant) => {
                        const isUpdating =
                          updatingRestaurantId ===
                          restaurant.id;

                        return (
                          <tr key={restaurant.id}>
                            <td>
                              <div className="restaurant-cell">
                                <strong>
                                  {restaurant.name}
                                </strong>

                                <span>
                                  {restaurant.address}
                                </span>
                              </div>
                            </td>

                            <td>
                              <span className="owner-id">
                                {restaurant.ownerId}
                              </span>
                            </td>

                            <td>
                              {restaurant.cuisine ||
                                "—"}
                            </td>

                            <td>
                              <span
                                className={
                                  restaurant.approved
                                    ? "status-badge approved"
                                    : "status-badge pending"
                                }
                              >
                                <span />

                                {restaurant.approved
                                  ? "Approved"
                                  : "Pending"}
                              </span>
                            </td>

                            <td>
                              <span
                                className={
                                  restaurant.active
                                    ? "status-badge active"
                                    : "status-badge inactive"
                                }
                              >
                                <span />

                                {restaurant.active
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </td>

                            <td>
                              <div className="restaurant-actions">
                                <button
                                  type="button"
                                  className={
                                    restaurant.approved
                                      ? "table-action danger"
                                      : "table-action"
                                  }
                                  onClick={() =>
                                    handleRestaurantApprovalChange(
                                      restaurant.id,
                                      !restaurant.approved
                                    )
                                  }
                                  disabled={
                                    isUpdating
                                  }
                                >
                                  {isUpdating
                                    ? "Updating..."
                                    : restaurant.approved
                                    ? "Unapprove"
                                    : "Approve"}
                                </button>

                                <button
                                  type="button"
                                  className={
                                    restaurant.active
                                      ? "table-action danger-outline"
                                      : "table-action"
                                  }
                                  onClick={() =>
                                    handleRestaurantStatusChange(
                                      restaurant.id,
                                      !restaurant.active
                                    )
                                  }
                                  disabled={
                                    isUpdating
                                  }
                                >
                                  {isUpdating
                                    ? "Updating..."
                                    : restaurant.active
                                    ? "Deactivate"
                                    : "Activate"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;