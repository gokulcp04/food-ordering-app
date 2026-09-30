import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Restaurant from "./pages/Restaurant";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerMenu from "./pages/OwnerMenu";
import CreateRestaurant from "./pages/CreateRestaurant";
import EditRestaurant from "./pages/EditRestaurant";
import OwnerOrders from "./pages/OwnerOrders";

import AdminDashboard from "./pages/AdminDashboard";
import BecomeOwner from "./pages/BecomeOwner";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/restaurants/:restaurantId"
          element={<Restaurant />}
        />

        {/* Become owner */}
        <Route
          path="/become-owner"
          element={
            <ProtectedRoute>
              <BecomeOwner />
            </ProtectedRoute>
          }
        />

        {/* Customer routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:orderId"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        {/* Owner routes */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/menu"
          element={
            <ProtectedRoute>
              <OwnerMenu />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/restaurants/new"
          element={
            <ProtectedRoute>
              <CreateRestaurant />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/restaurants/:restaurantId/edit"
          element={
            <ProtectedRoute>
              <EditRestaurant />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/orders"
          element={
            <ProtectedRoute>
              <OwnerOrders />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;