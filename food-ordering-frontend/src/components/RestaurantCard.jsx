import { Link } from "react-router-dom";

function RestaurantCard({ restaurant }) {
  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        backgroundColor: "#fff",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: "10px",
        }}
      >
        {restaurant.name}
      </h3>

      <p>
        <strong>Cuisine:</strong> {restaurant.cuisine}
      </p>

      <p>
        <strong>Location:</strong> {restaurant.address}
      </p>

      <p>
        <strong>Rating:</strong> ⭐ {restaurant.rating}
      </p>

      <Link
        to={`/restaurants/${restaurant.id}`}
        style={{
          display: "inline-block",
          marginTop: "10px",
          padding: "10px 16px",
          borderRadius: "6px",
          textDecoration: "none",
          backgroundColor: "#222",
          color: "#fff",
        }}
      >
        View Restaurant
      </Link>
    </div>
  );
}

export default RestaurantCard;