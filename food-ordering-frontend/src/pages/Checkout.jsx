import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkout } from "../services/orderService";
import { getCart } from "../services/cartService";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(true);

  const [deliveryAddress, setDeliveryAddress] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCart = async () => {
      try {
        setError("");

        const response = await getCart();

        setCart(response);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load your cart."
        );
      } finally {
        setCartLoading(false);
      }
    };

    loadCart();
  }, []);

  const handleCheckout = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      setError(
        "Your cart is empty. Please add an item before placing an order."
      );
      return;
    }

    if (!deliveryAddress.trim()) {
      setError("Please enter your delivery address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await checkout(
        deliveryAddress,
        "CASH_ON_DELIVERY"
      );

      navigate("/orders");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to place order."
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <main className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-loading">
            <h2>Loading checkout...</h2>

            <p>
              Getting your cart ready for checkout.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!cart) {
    return (
      <main className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-empty">
            <div className="checkout-empty-icon">
              🛒
            </div>

            <h2>Unable to load your cart</h2>

            <p>
              We couldn't retrieve your current cart.
              Please return to your cart and try again.
            </p>

            <button
              type="button"
              className="place-order-button"
              onClick={() => navigate("/cart")}
            >
              Back to Cart
            </button>
          </div>
        </div>
      </main>
    );
  }

  const isEmpty =
    !cart.items || cart.items.length === 0;

  if (isEmpty) {
    return (
      <main className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-breadcrumb">
            <Link to="/">Home</Link>

            <span>›</span>

            <Link to="/cart">Cart</Link>

            <span>›</span>

            <span>Checkout</span>
          </div>

          <div className="checkout-empty">
            <div className="checkout-empty-icon">
              🛒
            </div>

            <span className="checkout-kicker">
              YOUR ORDER
            </span>

            <h1>Your cart is empty</h1>

            <p>
              There are no items to checkout right now.
              Add something delicious from one of our
              restaurants first.
            </p>

            <button
              type="button"
              className="place-order-button"
              onClick={() => navigate("/")}
            >
              Browse Restaurants →
            </button>
          </div>
        </div>
      </main>
    );
  }

  const totalItems = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-breadcrumb">
          <Link to="/">Home</Link>

          <span>›</span>

          <Link to="/cart">Cart</Link>

          <span>›</span>

          <span>Checkout</span>
        </div>

        <div className="checkout-header">
          <span className="checkout-kicker">
            COMPLETE YOUR ORDER
          </span>

          <h1>Checkout</h1>

          <p>
            Enter your delivery details and choose your
            payment method.
          </p>
        </div>

        {error && (
          <div className="checkout-error">
            <span>⚠️</span>

            <div>
              <strong>Unable to place order</strong>

              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="checkout-layout">
          <section className="checkout-main">
            {/* Delivery Address */}
            <div className="checkout-card">
              <div className="checkout-card-heading">
                <div className="checkout-step">
                  1
                </div>

                <div>
                  <h2>Delivery address</h2>

                  <p>
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              <div className="address-field">
                <label htmlFor="deliveryAddress">
                  Full delivery address
                </label>

                <textarea
                  id="deliveryAddress"
                  value={deliveryAddress}
                  onChange={(event) =>
                    setDeliveryAddress(
                      event.target.value
                    )
                  }
                  placeholder="House / Flat number, street, area, city, state and PIN code"
                  rows={5}
                  disabled={loading}
                />

                <span>
                  Please provide enough detail so the
                  delivery partner can find you easily.
                </span>
              </div>
            </div>

            {/* Payment */}
            <div className="checkout-card">
              <div className="checkout-card-heading">
                <div className="checkout-step">
                  2
                </div>

                <div>
                  <h2>Payment method</h2>

                  <p>
                    Choose how you want to pay.
                  </p>
                </div>
              </div>

              <div className="payment-option selected">
                <div className="payment-radio">
                  <div />
                </div>

                <div className="payment-icon">
                  💵
                </div>

                <div className="payment-content">
                  <strong>Cash on Delivery</strong>

                  <p>
                    Pay when your order arrives.
                  </p>
                </div>

                <span className="payment-badge">
                  Available
                </span>
              </div>
            </div>

            {/* Order information */}
            <div className="checkout-info">
              <span>🔒</span>

              <div>
                <strong>Secure checkout</strong>

                <p>
                  Your delivery information is used only
                  to process and deliver your order.
                </p>
              </div>
            </div>
          </section>

          {/* Order Summary */}
          <aside className="checkout-summary">
            <div className="checkout-summary-card">
              <span className="checkout-summary-kicker">
                ORDER
              </span>

              <h2>Order summary</h2>

              <div className="summary-placeholder">
                <span>🛒</span>

                <div>
                  <strong>
                    {totalItems}{" "}
                    {totalItems === 1
                      ? "item"
                      : "items"}
                  </strong>

                  <p>
                    Your cart items and final total will
                    be used when the order is placed.
                  </p>
                </div>
              </div>

              <div className="checkout-items">
                {cart.items.map((item) => (
                  <div
                    className="checkout-item"
                    key={item.foodId}
                  >
                    <div>
                      <strong>
                        {item.foodName}
                      </strong>

                      <p>
                        ₹{item.price} ×{" "}
                        {item.quantity}
                      </p>
                    </div>

                    <strong>
                      ₹{item.subtotal}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="checkout-total-row">
                <span>Total</span>

                <strong>
                  ₹{cart.totalAmount}
                </strong>
              </div>

              <div className="checkout-summary-divider" />

              <div className="checkout-summary-note">
                <span>✓</span>

                <p>
                  Cash on Delivery selected
                </p>
              </div>

              <button
                type="button"
                className="place-order-button"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}

                {!loading && <span>→</span>}
              </button>

              <button
                type="button"
                className="back-cart-button"
                onClick={() => navigate("/cart")}
                disabled={loading}
              >
                ← Back to Cart
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Checkout;