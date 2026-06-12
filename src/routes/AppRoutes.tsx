import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import DashboardPage from '../pages/DashboardPage';
import ShipmentsPage from '../pages/shipments/ShipmentsPage';
import CustomersPage from '../pages/customers/CustomersPage';
import PackagesPage from '../pages/packages/PackagesPage';
import DriversPage from '../pages/drivers/DriversPage';
import VehiclesPage from '../pages/vehicles/VehiclesPage';
import WarehousesPage from '../pages/warehouses/WarehousesPage';
import RoutesPage from '../pages/routes/RoutesPage';
import AddressesPage from '../pages/addresses/AddressesPage';
import ProfilePage from '../pages/profile/ProfilePage';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />

    <Route
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/shipments" element={<ShipmentsPage />} />
      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/packages" element={<PackagesPage />} />
      <Route path="/drivers" element={<DriversPage />} />
      <Route path="/vehicles" element={<VehiclesPage />} />
      <Route path="/warehouses" element={<WarehousesPage />} />
      <Route path="/routes" element={<RoutesPage />} />
      <Route path="/addresses" element={<AddressesPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
