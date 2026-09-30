import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../services/orderService";
import "./OrderDetails.css";

function OrderDetails() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setError("");

        const response = await getOrderById(orderId);
        setOrder(response);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load order."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const getStatusClass = (status) => {
    switch (status) {
      case "PLACED":
        return "details-status placed";

      case "CONFIRMED":
        return "details-status confirmed";

      case "PREPARING":
        return "details-status preparing";

      case "OUT_FOR_DELIVERY":
        return "details-status delivery";

      case "DELIVERED":
        return "details-status delivered";

      case "CANCELLED":
        return "details-status cancelled";

      default:
        return "details-status";
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

  const getStatusDescription = (status) => {
    switch (status) {
      case "PLACED":
        return "Your order has been received and is waiting for confirmation.";

      case "CONFIRMED":
        return "The restaurant has confirmed your order.";

      case "PREPARING":
        return "Your food is being freshly prepared.";

      case "OUT_FOR_DELIVERY":
        return "Your order is on its way to you.";

      case "DELIVERED":
        return "Your order has been delivered. Enjoy your meal!";

      case "CANCELLED":
        return "This order has been cancelled.";

      default:
        return "Your order status has been updated.";
    }
  };

  if (loading) {
    return (
      <main className="order-details-page">
        <div className="order-details-container">
          <div className="order-details-loading">
            <div className="order-details-spinner" />

            <h2>Loading order...</h2>

            <p>
              Getting your order details ready.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="order-details-page">
        <div className="order-details-container">
          <div className="order-details-state">
            <div className="order-details-state-icon">
              ⚠️
            </div>

            <h2>Unable to load order</h2>

            <p>{error}</p>

            <Link
              to="/orders"
              className="order-details-primary-button"
            >
              Back to My Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="order-details-page">
        <div className="order-details-container">
          <div className="order-details-state">
            <div className="order-details-state-icon">
              🧾
            </div>

            <h2>Order not found</h2>

            <p>
              We couldn't find the order you're looking
              for.
            </p>

            <Link
              to="/orders"
              className="order-details-primary-button"
            >
              Back to My Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="order-details-page">
      <div className="order-details-container">
        <div className="order-details-breadcrumb">
          <Link to="/">Home</Link>

          <span>›</span>

          <Link to="/orders">My Orders</Link>

          <span>›</span>

          <span>Order #{order.id}</span>
        </div>

        <div className="order-details-header">
          <div>
            <span className="order-details-kicker">
              ORDER DETAILS
            </span>

            <h1>Order #{order.id}</h1>

            <p>
              Review your order, payment and delivery
              information.
            </p>
          </div>

          <span
            className={getStatusClass(
              order.orderStatus
            )}
          >
            <span className="details-status-dot" />

            {getStatusLabel(order.orderStatus)}
          </span>
        </div>

        <section className="order-status-card">
          <div className="status-card-icon">
            {order.orderStatus === "DELIVERED"
              ? "✓"
              : order.orderStatus === "CANCELLED"
                ? "×"
                : "🛵"}
          </div>

          <div className="status-card-content">
            <span>ORDER STATUS</span>

            <h2>
              {getStatusLabel(order.orderStatus)}
            </h2>

            <p>
              {getStatusDescription(
                order.orderStatus
              )}
            </p>
          </div>
        </section>

        <div className="order-details-layout">
          <section className="order-details-main">
            {/* Items */}
            <div className="details-card">
              <div className="details-card-header">
                <div>
                  <span className="details-card-kicker">
                    YOUR ORDER
                  </span>

                  <h2>Order items</h2>
                </div>

                <span className="details-item-count">
                  {order.items.length}{" "}
                  {order.items.length === 1
                    ? "item"
                    : "items"}
                </span>
              </div>

              <div className="details-items">
                {order.items.map((item) => (
                  <div
                    className="details-item"
                    key={item.foodId}
                  >
                    <div className="details-item-icon">
                      🍛
                    </div>

                    <div className="details-item-info">
                      <strong>
                        {item.foodName}
                      </strong>

                      <span>
                        ₹{item.price} ×{" "}
                        {item.quantity}
                      </span>
                    </div>

                    <strong className="details-item-total">
                      ₹{item.subtotal}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="details-total-row">
                <span>Total</span>

                <strong>
                  ₹{order.totalAmount}
                </strong>
              </div>
            </div>

            {/* Delivery */}
            <div className="details-card">
              <div className="details-card-header">
                <div>
                  <span className="details-card-kicker">
                    DELIVERY
                  </span>

                  <h2>Delivery details</h2>
                </div>
              </div>

              <div className="delivery-detail">
                <div className="delivery-detail-icon">
                  📍
                </div>

                <div>
                  <span>DELIVERY ADDRESS</span>

                  <p>{order.deliveryAddress}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Side summary */}
          <aside className="order-details-sidebar">
            <div className="details-summary-card">
              <span className="details-summary-kicker">
                PAYMENT
              </span>

              <h2>Payment details</h2>

              <div className="payment-detail-row">
                <span>Method</span>

                <strong>
                  {order.paymentMethod ===
                  "CASH_ON_DELIVERY"
                    ? "Cash on Delivery"
                    : order.paymentMethod}
                </strong>
              </div>

              <div className="payment-detail-row">
                <span>Status</span>

                <strong
                  className={
                    order.paymentStatus === "PAID"
                      ? "payment-paid"
                      : "payment-pending"
                  }
                >
                  {order.paymentStatus}
                </strong>
              </div>

              <div className="details-summary-divider" />

              <div className="details-summary-total">
                <span>Order total</span>

                <strong>
                  ₹{order.totalAmount}
                </strong>
              </div>
            </div>

            <Link
              to="/orders"
              className="back-orders-button"
            >
              ← Back to My Orders
            </Link>

            <Link
              to="/"
              className="browse-more-button"
            >
              Browse Restaurants
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default OrderDetails;