import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import Home from './pages/home';
import AdminDashboard from './pages/adminDashboard';
import AdminDetails from './pages/adminDetails';
import AdminMngOwners from './pages/adminMngOwners';
import AdminManageProperties from './pages/adminMngProperties';
import AdminPayHistory from './pages/adminPayHistory';
import AdminStats from './pages/adminStats';
import AdminMngTenants from './pages/adminMngTenants';
import Signup from './pages/signup';
import Signin from './pages/signin';

import OwnerDashboard from './pages/ownerDashboard';
import OwnerMngProperties from './pages/ownerMngProperties';
import OwnerMngPayments from './pages/ownerPayHistory';
import OwnerNotifications from './pages/ownerNotifications';
import OwnerDetails from './pages/ownerDetails';
import OwnerStats from './pages/ownerStats';

import TenantDashboard from './pages/tenantDashboard';
import TenantNotifications from './pages/tenantnotifications';
import ViewTenantNotifications from './pages/ViewTenantNotifications';
import TenantPaymentHistory from './pages/TenantPaymentHistory';
import ViewTenantPaymentHistory from './pages/ViewTenantPaymentHistory';
import TenantManageProperties from './pages/TenantManageProperties';
import TenantViewProperty from './pages/TenantViewProperty';
import TenantDetails from './pages/tenantDetails';
import TenantStats from './pages/tenantStats';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Home />
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <Signup />
      </>
    ),
  },
  {
    path: "/signin",
    element: (
      <>
        <Signin />
      </>
    ),
  },
  {
    path: "/adminDashboard",
    element: (
      <>
        <AdminDashboard />
      </>
    ),
  },
  {
    path: "/adminDetails",
    element: (
      <>
        <AdminDetails />
      </>
    ),
  },
  {
    path: "/adminMngProperties",
    element: (
      <>
        <AdminManageProperties />
      </>
    ),
  },
  {
    path: "/adminMngPayments",
    element: (
      <>
        <AdminPayHistory />
      </>
    ),
  },
  {
    path: "/adminStatistics",
    element: (
      <>
        <AdminStats />
      </>
    ),
  },
  {
    path: "/adminMngTenants",
    element: (
      <>
        <AdminMngTenants />
      </>
    ),
  },
  {
    path: "/adminMngOwners",
    element: (
      <>
        <AdminMngOwners />
      </>
    ),
  },
  {
    path: "/ownerDashboard",
    element: (
      <>
        <OwnerDashboard />
      </>
    ),
  },
  {
    path: "/ownerMngProperties",
    element: (
      <>
        <OwnerMngProperties />
      </>
    ),
  },
  {
    path: "/ownerNotifications",
    element: (
      <>
        <OwnerNotifications />
      </>
    ),
  },
  {
    path: "/ownerDetails",
    element: (
      <>
        <OwnerDetails />
      </>
    ),
  },
  {
    path: "/ownerMngPayments",
    element: (
      <>
        <OwnerMngPayments />
      </>
    ),
  },
  {
    path: "/ownerStatistics",
    element: (
      <>
        <OwnerStats />
      </>
    ),
  },
  {
    path: "/tenantDashboard",
    element: (
      <>
        <TenantDashboard />
      </>
    ),
  },
  {
    path: "/tenantDetails",
    element: (
      <>
        <TenantDetails />
      </>
    ),
  },
  {
    path: "/tenantStats",
    element: (
      <>
        <TenantStats />
      </>
    ),
  },
  {
    path: "/tenantPaymentHistory",
    element: (
      <>
        <TenantPaymentHistory />
      </>
    ),
  },
  {
    path: "/viewtenantPaymentHistory/:paymentID",
    element: (
      <>
        <ViewTenantPaymentHistory />
      </>
    ),
  },
  {
    path: "/tenantMngProperties",
    element: (
      <>
        <TenantManageProperties />
      </>
    ),
  },
  {
    path: "/tenantNotifications",
    element: (
      <>
        <TenantNotifications />
      </>
    ),
  },
  {
    path: "/viewTenantProperty/:propertyID",
    element: (
      <>
        <TenantViewProperty />
      </>
    ),
  },
  {
    path: "/viewTenantNotifications/:notificationID",
    element: (
      <>
        <ViewTenantNotifications />
      </>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
