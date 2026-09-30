import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMyOrders,
  cancelOrder,
} from "../services/orderService";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingOrderId, setCancellingOrderId] =
    useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setError("");

        const response = await getMyOrders();
        setOrders(response);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load orders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      setError("");
      setCancellingOrderId(orderId);

      const updatedOrder = await cancelOrder(orderId);

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
          "Unable to cancel order."
      );
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PLACED":
        return "order-status placed";

      case "CONFIRMED":
        return "order-status confirmed";

      case "PREPARING":
        return "order-status preparing";

      case "OUT_FOR_DELIVERY":
        return "order-status delivery";

      case "DELIVERED":
        return "order-status delivered";

      case "CANCELLED":
        return "order-status cancelled";

      default:
        return "order-status";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PLACED":
        return "Order Placed";

      case "CONFIRMED":
        return "Confirmed";

      case "PREPARING":
        return "Preparing";

      case "OUT_FOR_DELIVERY":
        return "Out for Delivery";

      case "DELIVERED":
        return "Delivered";

      case "CANCELLED":
        return "Cancelled";

      default:
        return status;
    }
  };

  if (loading) {
    return (
      <main className="orders-page">
        <div className="orders-container">
          <div className="orders-loading">
            <div className="orders-loading-spinner" />

            <h2>Loading your orders...</h2>

            <p>
              Getting your order history ready.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error && orders.length === 0) {
    return (
      <main className="orders-page">
        <div className="orders-container">
          <div className="orders-state">
            <div className="orders-state-icon">
              ⚠️
            </div>

            <h2>Unable to load orders</h2>

            <p>{error}</p>

            <Link
              to="/"
              className="orders-primary-button"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="orders-container">
        <div className="orders-breadcrumb">
          <Link to="/">Home</Link>

          <span>›</span>

          <span>My Orders</span>
        </div>

        <div className="orders-header">
          <div>
            <span className="orders-kicker">
              YOUR ACTIVITY
            </span>

            <h1>My Orders</h1>

            <p>
              Track your current orders and view your
              previous orders.
            </p>
          </div>

          {orders.length > 0 && (
            <div className="orders-count">
              <strong>{orders.length}</strong>

              <span>
                {orders.length === 1
                  ? "order"
                  : "orders"}
              </span>
            </div>
          )}
        </div>

        {error && orders.length > 0 && (
          <div className="orders-inline-error">
            <span>⚠️</span>

            <p>{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <section className="orders-empty">
            <div className="orders-empty-icon">
              🧾
            </div>

            <h2>No orders yet</h2>

            <p>
              Your current and completed orders will
              appear here once you place your first order.
            </p>

            <Link
              to="/"
              className="orders-primary-button"
            >
              Browse Restaurants
            </Link>
          </section>
        ) : (
          <section className="orders-list">
            {orders.map((order) => (
              <article
                className="order-card"
                key={order.id}
              >
                <div className="order-card-header">
                  <div>
                    <span className="order-label">
                      ORDER
                    </span>

                    <h2>
                      #{order.id}
                    </h2>
                  </div>

                  <span
                    className={getStatusClass(
                      order.orderStatus
                    )}
                  >
                    <span className="status-dot" />

                    {getStatusLabel(
                      order.orderStatus
                    )}
                  </span>
                </div>

                <div className="order-card-meta">
                  <div>
                    <span>PAYMENT</span>

                    <strong>
                      {order.paymentMethod ===
                      "CASH_ON_DELIVERY"
                        ? "Cash on Delivery"
                        : order.paymentMethod}
                    </strong>
                  </div>

                  <div>
                    <span>DELIVERY TO</span>

                    <strong>
                      {order.deliveryAddress}
                    </strong>
                  </div>

                  <div>
                    <span>TOTAL</span>

                    <strong className="order-total">
                      ₹{order.totalAmount}
                    </strong>
                  </div>
                </div>

                <div className="order-items">
                  <div className="order-items-heading">
                    <h3>Items</h3>

                    <span>
                      {order.items.length}{" "}
                      {order.items.length === 1
                        ? "item"
                        : "items"}
                    </span>
                  </div>

                  {order.items.map((item) => (
                    <div
                      className="order-item"
                      key={item.foodId}
                    >
                      <div className="order-item-icon">
                        🍛
                      </div>

                      <div className="order-item-info">
                        <strong>
                          {item.foodName}
                        </strong>

                        <span>
                          ₹{item.price} ×{" "}
                          {item.quantity}
                        </span>
                      </div>

                      <strong className="order-item-subtotal">
                        ₹{item.subtotal}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <Link
                    to={`/orders/${order.id}`}
                    className="order-details-button"
                  >
                    View Details
                    <span>→</span>
                  </Link>

                  {order.orderStatus === "PLACED" && (
                    <button
                      type="button"
                      className="cancel-order-button"
                      onClick={() =>
                        handleCancelOrder(order.id)
                      }
                      disabled={
                        cancellingOrderId === order.id
                      }
                    >
                      {cancellingOrderId === order.id
                        ? "Cancelling..."
                        : "Cancel Order"}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default Orders;