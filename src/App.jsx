// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Cart from "./pages/Cart/Cart";
import Collections from "./pages/Collections";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Account from "./pages/Account/Account";
import EditProfile from "./pages/Account/EditProfile";
import PrivateRoute from "./components/auth/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastProvider } from "./context/ToastContext";
import EditAddress from "./pages/Account/EditAddress";
import AddAddress from "./pages/Account/AddAddress";
import CategoryPage from "./pages/CategoryPage";
import Checkout from "./pages/Checkout/Checkout";
import OrderSuccess from "./pages/Checkout/OrderSuccess";
import VnpayReturn from "./pages/Checkout/VnpayReturn";
import OrderDetail from "./pages/Order/OrderDetail";
import Wishlist from "./pages/Wishlist/Wishlist";

function App() {
  return (
    <ToastProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Thêm các route khác ở đây */}
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<PrivateRoute> <Account /> </PrivateRoute>} />
          <Route path="/account/edit" element={<PrivateRoute> <EditProfile /> </PrivateRoute>} />
          <Route path="/account/address/edit/:addressId" element={<EditAddress />} />
          <Route path="/account/address/add" element={<AddAddress />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/order/vnpay_return" element={<VnpayReturn />} />
          <Route path="/order/:orderId" element={<OrderDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </Layout>
    </ToastProvider>
  );
}

export default App;
