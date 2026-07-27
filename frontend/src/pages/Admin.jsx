import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminLayout from '../components/admin/AdminLayout'
import AdminLogin from '../components/admin/AdminLogin'
import Dashboard from '../components/admin/Dashboard'
import ProductManagement from '../components/admin/ProductManagement'
import OrdersManagement from '../components/admin/OrdersManagement'
import ContactsManagement from '../components/admin/ContactsManagement'
import SubscribersManagement from '../components/admin/SubscribersManagement'
import Settings from '../components/admin/Settings'

const Admin = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route path="/*" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="orders" element={<OrdersManagement />} />
        <Route path="contacts" element={<ContactsManagement />} />
        <Route path="subscribers" element={<SubscribersManagement />} />
        <Route path="settings" element={<Settings />} />
        <Route path="" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default Admin