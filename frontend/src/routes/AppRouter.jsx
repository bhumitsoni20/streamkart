import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';
import DashboardLayout from '../components/layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import PhoneLogin from '../pages/auth/PhoneLogin';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Public Pages
import Home from '../pages/marketplace/Home';
import ProductList from '../pages/marketplace/ProductList';
import ProductDetail from '../pages/marketplace/ProductDetail';
import Search from '../pages/marketplace/Search';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import Privacy from '../pages/public/Privacy';
import Terms from '../pages/public/Terms';
import NotFound from '../pages/public/NotFound';

// Dashboard Pages
import Dashboard from '../pages/dashboard/Dashboard';
import Orders from '../pages/dashboard/Orders';
import OrderDetail from '../pages/dashboard/OrderDetail';
import Profile from '../pages/dashboard/Profile';
import Notifications from '../pages/dashboard/Notifications';

// Seller Pages
import SellerDashboard from '../pages/seller/SellerDashboard';
import AddProduct from '../pages/seller/AddProduct';
import EditProduct from '../pages/seller/EditProduct';
import SellerProducts from '../pages/seller/SellerProducts';
import SellerOrders from '../pages/seller/SellerOrders';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageProducts from '../pages/admin/ManageProducts';
import ManageOrders from '../pages/admin/ManageOrders';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <ProductList /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'search', element: <Search /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'terms', element: <Terms /> },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'phone-login', element: <PhoneLogin /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'orders', element: <Orders /> },
      { path: 'orders/:id', element: <OrderDetail /> },
      { path: 'profile', element: <Profile /> },
      { path: 'notifications', element: <Notifications /> },
    ],
  },
  {
    path: '/seller',
    element: (
      <RoleRoute roles={['seller', 'admin']}>
        <DashboardLayout />
      </RoleRoute>
    ),
    children: [
      { index: true, element: <SellerDashboard /> },
      { path: 'products', element: <SellerProducts /> },
      { path: 'products/new', element: <AddProduct /> },
      { path: 'products/:id/edit', element: <EditProduct /> },
      { path: 'orders', element: <SellerOrders /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <RoleRoute roles={['admin']}>
        <DashboardLayout />
      </RoleRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <ManageUsers /> },
      { path: 'products', element: <ManageProducts /> },
      { path: 'orders', element: <ManageOrders /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
