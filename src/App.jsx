import Register from "../../client/src/pages/Register";
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-tooltip/dist/react-tooltip.css";
import "react-loading-skeleton/dist/skeleton.css";
import { Toaster } from "react-hot-toast";
import { useTheme } from "./context/ThemeContext";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SkeletonTheme } from "react-loading-skeleton";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AddProduct from "./pages/admin/AddProduct";
import AllCustomers from "./pages/admin/AllCustomers";
import AllOrders from "./pages/admin/AllOrders";
import AllProducts from "./pages/admin/AllProducts";
import Chat from "./pages/admin/Chat";
import CustomerLayout from "./layouts/CustomerLayout";
import CustomerHome from "./pages/customers/CustomerHome";
import Products from "./pages/customers/Products";
import Carts from "./pages/customers/Carts";
import Orders from "./pages/customers/Orders";
import Wishlist from "./pages/customers/Wishlist";
import Checkout from "./pages/customers/Checkout";
import TrackOrder from "./pages/customers/TrackOrder";
import ShippingInfo from "./pages/customers/ShippingInfo";
import ProductDetail from "./pages/customers/ProductDetail";
import Invoice from "./pages/customers/Invoice";
import NotFound from "./layouts/NotFound";
import Modal from "react-modal";
import CustomerChats from "./pages/customers/Chats";
Modal.setAppElement("#root");
function App() {
  const { isDarkMode } = useTheme();
  return (
    <div className="">
      <SkeletonTheme
        baseColor={` ${isDarkMode ? "#94A3B8" : "#E2E8F0"} `}
        highlightColor={` ${isDarkMode ? "#E2E8F0" : "#94A3B8"} `}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="all-products" element={<AllProducts />} />
            <Route path="customers" element={<AllCustomers />} />
            <Route path="orders" element={<AllOrders />} />
            <Route path="chats" element={<Chat />} />
          </Route>
          <Route path="/customer" element={<CustomerLayout />}>
            <Route index path="home" element={<CustomerHome />} />
            <Route path="products" element={<Products />} />
            <Route
              path="product-detail/:productId?"
              element={<ProductDetail />}
            />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="carts" element={<Carts />} />
            <Route path="shipping-info" element={<ShippingInfo />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="invoice/:invoiceId" element={<Invoice />} />
            <Route path="orders" element={<Orders />} />
            <Route path="track-order/:orderId?" element={<TrackOrder />} />
            <Route path="chats" element={<CustomerChats />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SkeletonTheme>
      <ToastContainer />
      <Toaster />
    </div>
  );
}

export default App;
