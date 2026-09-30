import { useEffect, useState } from "react";
import { getMyRestaurants } from "../services/restaurantService";
import {
  getRestaurantOrders,
  updateOrderStatus,
} from "../services/orderService";
import "./OwnerOrders.css";

function OwnerOrders() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] =
    useState("");

  const [orders, setOrders] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] =
    useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] =
    useState(null);

  const [error, setError] = useState("");

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

  useEffect(() => {
    if (!selectedRestaurantId) {
      setOrders([]);
      return;
    }

    const loadOrders = async () => {
      try {
        setError("");
        setLoadingOrders(true);

        const response = await getRestaurantOrders(
          selectedRestaurantId
        );

        setOrders(response);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load restaurant orders."
        );
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, [selectedRestaurantId]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setError("");
      setUpdatingOrderId(orderId);

      const updatedOrder = await updateOrderStatus(
        orderId,
        newStatus
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === updatedOrder.id
            ? updatedOrder
            : order
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update order status."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getNextStatuses = (status) => {
    switch (status) {
      case "PLACED":
        return ["CONFIRMED", "CANCELLED"];

      case "CONFIRMED":
        return ["PREPARING", "CANCELLED"];

      case "PREPARING":
        return ["OUT_FOR_DELIVERY"];

      case "OUT_FOR_DELIVERY":
        return ["DELIVERED"];

      default:
        return [];
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PLACED":
        return "status-placed";

      case "CONFIRMED":
        return "status-confirmed";

      case "PREPARING":
        return "status-preparing";

      case "OUT_FOR_DELIVERY":
        return "status-delivery";

      case "DELIVERED":
        return "status-delivered";

      case "CANCELLED":
        return "status-cancelled";

      default:
        return "status-default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "OUT_FOR_DELIVERY":
        return "Out for delivery";

      default:
        return status
          ? status.charAt(0) +
              status.slice(1).toLowerCase()
          : "Unknown";
    }
  };

  const activeOrders = orders.filter(
    (order) =>
      !["DELIVERED", "CANCELLED"].includes(
        order.orderStatus
      )
  );

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "DELIVERED"
  );

  const cancelledOrders = orders.filter(
    (order) => order.orderStatus === "CANCELLED"
  );

  if (loadingRestaurants) {
    return (
      <main className="owner-orders-page">
        <div className="owner-orders-container">
          <div className="owner-orders-loading">
            <div className="loading-spinner" />
            <p>Loading your restaurants...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="owner-orders-page">
      <div className="owner-orders-container">
        <section className="owner-orders-header">
          <div>
            <p className="page-eyebrow">
              Restaurant operations
            </p>

            <h1>Orders</h1>

            <p className="page-description">
              Review incoming orders and manage their
              delivery progress.
            </p>
          </div>

          {restaurants.length > 0 && (
            <div className="restaurant-selector">
              <label htmlFor="restaurant-select">
                Restaurant
              </label>

              <select
                id="restaurant-select"
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
          )}
        </section>

        {error && (
          <div className="owner-orders-error">
            <span className="error-icon">!</span>
            <span>{error}</span>
          </div>
        )}

        {restaurants.length === 0 ? (
          <section className="orders-empty-state">
            <div className="empty-icon">🏪</div>

            <h2>No restaurants yet</h2>

            <p>
              Create a restaurant first to start
              receiving and managing orders.
            </p>
          </section>
        ) : (
          <>
            <section className="order-stats">
              <div className="order-stat-card">
                <div className="stat-icon">📦</div>

                <div>
                  <span className="stat-label">
                    Total orders
                  </span>

                  <strong>{orders.length}</strong>
                </div>
              </div>

              <div className="order-stat-card">
                <div className="stat-icon active">
                  ◷
                </div>

                <div>
                  <span className="stat-label">
                    Active orders
                  </span>

                  <strong>{activeOrders.length}</strong>
                </div>
              </div>

              <div className="order-stat-card">
                <div className="stat-icon delivered">
                  ✓
                </div>

                <div>
                  <span className="stat-label">
                    Delivered
                  </span>

                  <strong>
                    {deliveredOrders.length}
                  </strong>
                </div>
              </div>

              <div className="order-stat-card">
                <div className="stat-icon cancelled">
                  ×
                </div>

                <div>
                  <span className="stat-label">
                    Cancelled
                  </span>

                  <strong>
                    {cancelledOrders.length}
                  </strong>
                </div>
              </div>
            </section>

            <section className="orders-section">
              <div className="orders-section-header">
                <div>
                  <h2>Restaurant orders</h2>

                  <p>
                    {orders.length === 1
                      ? "1 order"
                      : `${orders.length} orders`}
                  </p>
                </div>
              </div>

              {loadingOrders ? (
                <div className="orders-loading">
                  <div className="loading-spinner" />
                  <p>Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="orders-empty-state compact">
                  <div className="empty-icon">🧾</div>

                  <h3>No orders yet</h3>

                  <p>
                    Orders placed at this restaurant
                    will appear here.
                  </p>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => {
                    const nextStatuses =
                      getNextStatuses(
                        order.orderStatus
                      );

                    const isUpdating =
                      updatingOrderId === order.id;

                    return (
                      <article
                        className="owner-order-card"
                        key={order.id}
                      >
                        <div className="order-card-header">
                          <div>
                            <p className="order-number">
                              Order
                            </p>

                            <h3>
                              #{order.id}
                            </h3>
                          </div>

                          <span
                            className={`order-status ${getStatusClass(
                              order.orderStatus
                            )}`}
                          >
                            <span className="status-dot" />
                            {getStatusLabel(
                              order.orderStatus
                            )}
                          </span>
                        </div>

                        <div className="order-card-body">
                          <div className="order-info-grid">
                            <div className="order-info-block">
                              <span className="info-label">
                                Customer
                              </span>

                              <span className="info-value">
                                {order.customerId}
                              </span>
                            </div>

                            <div className="order-info-block">
                              <span className="info-label">
                                Payment
                              </span>

                              <span className="info-value">
                                {order.paymentMethod}
                              </span>
                            </div>

                            <div className="order-info-block">
                              <span className="info-label">
                                Payment status
                              </span>

                              <span className="info-value">
                                {order.paymentStatus}
                              </span>
                            </div>
                          </div>

                          <div className="order-address">
                            <span className="info-label">
                              Delivery address
                            </span>

                            <p>
                              {order.deliveryAddress}
                            </p>
                          </div>

                          <div className="order-items">
                            <div className="order-items-header">
                              <h4>Order items</h4>

                              <span>
                                {order.items?.length || 0}{" "}
                                {order.items?.length === 1
                                  ? "item"
                                  : "items"}
                              </span>
                            </div>

                            <div className="items-list">
                              {order.items?.map(
                                (item) => (
                                  <div
                                    className="order-item"
                                    key={item.foodId}
                                  >
                                    <div className="item-details">
                                      <span className="item-quantity">
                                        {item.quantity}×
                                      </span>

                                      <span className="item-name">
                                        {item.foodName}
                                      </span>
                                    </div>

                                    <span className="item-price">
                                      ₹{item.subtotal}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="order-card-footer">
                          <div className="order-total">
                            <span>Total amount</span>
                            <strong>
                              ₹{order.totalAmount}
                            </strong>
                          </div>

                          {nextStatuses.length > 0 && (
                            <div className="status-actions">
                              <span className="status-action-label">
                                Update status
                              </span>

                              <div className="status-buttons">
                                {nextStatuses.map(
                                  (status) => (
                                    <button
                                      key={status}
                                      type="button"
                                      className={
                                        status ===
                                        "CANCELLED"
                                          ? "status-button danger"
                                          : "status-button"
                                      }
                                      onClick={() =>
                                        handleStatusUpdate(
                                          order.id,
                                          status
                                        )
                                      }
                                      disabled={isUpdating}
                                    >
                                      {isUpdating
                                        ? "Updating..."
                                        : getStatusLabel(
                                            status
                                          )}
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default OwnerOrders;