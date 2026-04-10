/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Services from "./pages/Services";
import OurWorld from "./pages/OurWorld";
import Stories from "./pages/Stories";
import CustomerDashboard from "./pages/customer/Dashboard";
import BookLaundry from "./pages/customer/Book";
import AdminDashboard from "./pages/admin/Dashboard";
import StaffDashboard from "./pages/staff/Dashboard";

export default function App() {
  return (
    <Router>
      <Toaster theme="dark" position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<OurWorld />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/customer/book" element={<BookLaundry />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
      </Routes>
    </Router>
  );
}
