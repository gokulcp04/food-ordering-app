import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../services/cartService";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingFoodId, setUpdatingFoodId] = useState(null);
  const [removingFoodId, setRemovingFoodId] = useState(null);

  useEffect(() => {
    const loadCart = async () => {
      try {
        setError("");

        const response = await getCart();

        setCart(response);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load cart."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const handleQuantityChange = async (
    foodId,
    newQuantity
  ) => {
    if (newQuantity < 1) {
      return;
    }

    try {
      setError("");
      setUpdatingFoodId(foodId);

      const updatedCart = await updateCartItem(
        foodId,
        newQuantity
      );

      setCart(updatedCart);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update cart."
      );
    } finally {
      setUpdatingFoodId(null);
    }
  };

  const handleRemoveItem = async (foodId) => {
    try {
      setError("");
      setRemovingFoodId(foodId);

      const updatedCart = await removeCartItem(foodId);

      setCart(updatedCart);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to remove item."
      );
    } finally {
      setRemovingFoodId(null);
    }
  };

  const totalItems = useMemo(() => {
    if (!cart?.items) {
      return 0;
    }

    return cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [cart]);

  if (loading) {
    return (
      <main className="cart-page">
        <div className="cart-loading">
          <div className="cart-loading-spinner" />

          <h2>Loading your cart...</h2>

          <p>Getting your order ready.</p>
        </div>
      </main>
    );
  }

  if (error && !cart) {
    return (
      <main className="cart-page">
        <div className="cart-state">
          <div className="cart-state-icon">⚠️</div>

          <h2>Unable to load your cart</h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="cart-primary-button"
          >
            Browse Restaurants
          </button>
        </div>
      </main>
    );
  }

  if (!cart) {
    return (
      <main className="cart-page">
        <div className="cart-state">
          <div className="cart-state-icon">🛒</div>

          <h2>Cart not found</h2>

          <p>
            We couldn't find your current shopping cart.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="cart-primary-button"
          >
            Browse Restaurants
          </button>
        </div>
      </main>
    );
  }

  const isEmpty = cart.items.length === 0;

  return (
    <main className="cart-page">
      <div className="cart-container">
        <div className="cart-breadcrumb">
          <Link to="/">Home</Link>

          <span>›</span>

          <span>Cart</span>
        </div>

        <div className="cart-header">
          <div>
            <span className="cart-kicker">
              YOUR ORDER
            </span>

            <h1>Your Cart</h1>

            {!isEmpty && (
              <p>
                {totalItems}{" "}
                {totalItems === 1
                  ? "item"
                  : "items"}{" "}
                in your cart
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="cart-inline-error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {isEmpty ? (
          <section className="cart-empty">
            <div className="cart-empty-icon">🛒</div>

            <h2>Your cart is empty</h2>

            <p>
              Looks like you haven't added anything yet.
              Discover a restaurant and find something
              delicious.
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="cart-primary-button"
            >
              Browse Restaurants
            </button>
          </section>
        ) : (
          <div className="cart-layout">
            <section className="cart-items-section">
              <div className="cart-section-header">
                <div>
                  <h2>Your items</h2>

                  <p>
                    Review your items before checkout.
                  </p>
                </div>
              </div>

              <div className="cart-items">
                {cart.items.map((item) => (
                  <article
                    className="cart-item"
                    key={item.foodId}
                  >
                    <div className="cart-item-image">
                      <span>🍛</span>
                    </div>

                    <div className="cart-item-main">
                      <div className="cart-item-info">
                        <h3>{item.foodName}</h3>

                        <p>
                          ₹{item.price} per item
                        </p>
                      </div>

                      <div className="cart-item-actions">
                        <div className="quantity-control">
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(
                                item.foodId,
                                item.quantity - 1
                              )
                            }
                            disabled={
                              item.quantity === 1 ||
                              updatingFoodId ===
                                item.foodId ||
                              removingFoodId ===
                                item.foodId
                            }
                            aria-label={`Decrease quantity of ${item.foodName}`}
                          >
                            −
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(
                                item.foodId,
                                item.quantity + 1
                              )
                            }
                            disabled={
                              updatingFoodId ===
                                item.foodId ||
                              removingFoodId ===
                                item.foodId
                            }
                            aria-label={`Increase quantity of ${item.foodName}`}
                          >
                            +
                          </button>
                        </div>

                        <strong className="cart-item-subtotal">
                          ₹{item.subtotal}
                        </strong>

                        <button
                          type="button"
                          className="remove-item-button"
                          onClick={() =>
                            handleRemoveItem(item.foodId)
                          }
                          disabled={
                            removingFoodId === item.foodId
                          }
                        >
                          {removingFoodId === item.foodId
                            ? "Removing..."
                            : "Remove"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <Link
                to="/"
                className="continue-shopping"
              >
                ← Continue shopping
              </Link>
            </section>

            <aside className="cart-summary">
              <div className="cart-summary-card">
                <span className="cart-summary-kicker">
                  ORDER SUMMARY
                </span>

                <h2>Bill details</h2>

                <div className="summary-row">
                  <span>Items</span>

                  <span>{totalItems}</span>
                </div>

                <div className="summary-row">
                  <span>Item total</span>

                  <span>₹{cart.totalAmount}</span>
                </div>

                <div className="summary-divider" />

                <div className="summary-total">
                  <span>Total</span>

                  <strong>
                    ₹{cart.totalAmount}
                  </strong>
                </div>

                <p className="summary-note">
                  Final charges are calculated at checkout.
                </p>

                <button
                  type="button"
                  className="checkout-button"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                  <span>→</span>
                </button>
              </div>

              <div className="cart-security-note">
                <span>🔒</span>

                <div>
                  <strong>Secure ordering</strong>

                  <p>
                    Your order information is handled
                    securely.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

export default Cart;