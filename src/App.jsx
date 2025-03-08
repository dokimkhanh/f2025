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

function App() {
  return (
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
      </Routes>
    </Layout>
  );
}

export default App;
