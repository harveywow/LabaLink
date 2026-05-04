import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  DollarSign,
  Package,
  Activity,
  LogOut,
  Settings,
  TrendingUp,
  Menu,
  X,
  Search,
  Filter,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "", address: "" });
  const [newOrder, setNewOrder] = useState({ customerId: "", service: "Wash & Fold", weight: "", total: "", paymentMethod: "cash" });
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
  });
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "admin") {
      navigate("/login");
      return;
    }
    setUser(parsedUser);

    fetch("/api/orders?role=admin")
      .then((res) => res.json())
      .then((data) => setOrders(data));

    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) => setAnalytics(data));

    fetch("/api/users")
      .then((res) => res.json())
      .then((data) =>
        setCustomers(data.filter((u: any) => u.role === "customer")),
      );

    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    })
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        toast.success("Settings saved successfully!");
      })
      .catch(() => toast.error("Failed to save settings"));
  };

  const handleUpdateOrderStatus = (orderId: number, newStatus: string) => {
    fetch(`/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((updatedOrder) => {
        setOrders(orders.map((o) => (o.id === orderId ? updatedOrder : o)));
        toast.success(`Order #${orderId} status updated to ${newStatus}`);
      })
      .catch(() => toast.error("Failed to update order status"));
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCustomer),
    })
      .then((res) => res.json())
      .then((data) => {
        setCustomers([...customers, data]);
        setIsCreatingCustomer(false);
        setNewCustomer({ name: "", email: "", phone: "", address: "" });
        toast.success("Customer created successfully!");
      })
      .catch(() => toast.error("Failed to create customer"));
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: Number(newOrder.customerId),
        service: newOrder.service,
        weight: Number(newOrder.weight),
        total: Number(newOrder.total),
        paymentMethod: newOrder.paymentMethod,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Need to refetch orders to get populated customer names
        fetch("/api/orders?role=admin")
          .then((res) => res.json())
          .then((ordersData) => {
            setOrders(ordersData);
            setIsCreatingOrder(false);
            setNewOrder({ customerId: "", service: "Wash & Fold", weight: "", total: "", paymentMethod: "cash" });
            toast.success("Order created successfully!");
          });
      })
      .catch(() => toast.error("Failed to create order"));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a1128] flex font-sans text-[#f8fafc]">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-6 right-6 z-50 p-3 bg-blue-600 rounded-full text-white shadow-lg shadow-blue-600/30"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-72 bg-[#0f172a]/95 backdrop-blur-xl flex flex-col shadow-2xl z-40 border-r border-blue-900/30 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-8">
          <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            LabaLink
          </h1>
          <p className="text-blue-300 text-sm font-medium mt-1 tracking-wider uppercase">
            Admin Portal
          </p>
        </div>
        <nav className="flex-1 px-6 space-y-3">
          <button
            onClick={() => { setActiveTab("dashboard"); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-medium transition-all duration-300 w-full text-left ${activeTab === "dashboard" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-black/10" : "text-blue-200 hover:bg-blue-900/20 hover:text-white"}`}
          >
            <Activity className="h-6 w-6" /> Dashboard
          </button>
          <button
            onClick={() => { setActiveTab("orders"); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-medium transition-all duration-300 w-full text-left ${activeTab === "orders" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-black/10" : "text-blue-200 hover:bg-blue-900/20 hover:text-white"}`}
          >
            <Package className="h-6 w-6" /> Orders
          </button>
          <button
            onClick={() => { setActiveTab("customers"); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-medium transition-all duration-300 w-full text-left ${activeTab === "customers" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-black/10" : "text-blue-200 hover:bg-blue-900/20 hover:text-white"}`}
          >
            <Users className="h-6 w-6" /> Customers
          </button>
          <button
            onClick={() => { setActiveTab("settings"); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-medium transition-all duration-300 w-full text-left ${activeTab === "settings" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-black/10" : "text-blue-200 hover:bg-blue-900/20 hover:text-white"}`}
          >
            <Settings className="h-6 w-6" /> Settings
          </button>
        </nav>
        <div className="p-6 border-t border-blue-900/30">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-4 w-full text-left hover:bg-blue-900/20 rounded-2xl text-blue-200 hover:text-white transition-all duration-300 font-medium"
          >
            <LogOut className="h-6 w-6" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto relative">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <header className="flex justify-between items-center mb-12 relative z-10">
          <div>
            <h2 className="text-4xl font-serif font-bold text-white capitalize">
              {activeTab}
            </h2>
            <p className="text-blue-200 mt-2 text-lg">
              {activeTab === "dashboard" &&
                "Monitor your laundry business performance."}
              {activeTab === "orders" &&
                "Manage and track all customer orders."}
              {activeTab === "customers" &&
                "View and manage your customer base."}
              {activeTab === "settings" &&
                "Configure your business preferences."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg shadow-blue-500/20">
              A
            </div>
          </div>
        </header>

        {activeTab === "dashboard" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0f172a]/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-black/50 border border-blue-900/30 group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl shadow-lg shadow-emerald-500/10">
                    <DollarSign className="h-7 w-7" />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-sm font-medium">
                    <TrendingUp className="h-4 w-4" /> +12%
                  </div>
                </div>
                <h3 className="text-blue-200 font-medium text-lg mb-1">
                  Total Revenue
                </h3>
                <p className="text-4xl font-serif font-bold text-white">
                  ₱{analytics.totalRevenue.toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#0f172a]/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-black/50 border border-blue-900/30 group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl shadow-lg shadow-blue-500/10">
                    <Package className="h-7 w-7" />
                  </div>
                  <div className="flex items-center gap-1 text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-sm font-medium">
                    <TrendingUp className="h-4 w-4" /> +5%
                  </div>
                </div>
                <h3 className="text-blue-200 font-medium text-lg mb-1">
                  Total Orders
                </h3>
                <p className="text-4xl font-serif font-bold text-white">
                  {analytics.totalOrders}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#0f172a]/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-black/50 border border-blue-900/30 group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl shadow-lg shadow-indigo-500/10">
                    <Users className="h-7 w-7" />
                  </div>
                  <div className="flex items-center gap-1 text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-sm font-medium">
                    <TrendingUp className="h-4 w-4" /> +18%
                  </div>
                </div>
                <h3 className="text-blue-200 font-medium text-lg mb-1">
                  Active Customers
                </h3>
                <p className="text-4xl font-serif font-bold text-white">
                  {customers.length}
                </p>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 relative z-10">
              <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-black/50 border border-blue-900/30 p-8">
                <h3 className="text-xl font-serif font-bold text-white mb-6">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setIsCreatingOrder(true)}
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors group"
                  >
                    <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                      <Package className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium text-blue-200">New Order</span>
                  </button>
                  <button
                    onClick={() => setIsCreatingCustomer(true)}
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors group"
                  >
                    <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                      <Users className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium text-blue-200">New Customer</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-black/50 border border-blue-900/30 p-8">
                <h3 className="text-xl font-serif font-bold text-white mb-6">
                  System Status
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-blue-200 font-medium">Database Connection</span>
                    </div>
                    <span className="text-emerald-400 text-sm font-medium">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-blue-200 font-medium">Payment Gateway</span>
                    </div>
                    <span className="text-emerald-400 text-sm font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-blue-200 font-medium">Email Service</span>
                    </div>
                    <span className="text-emerald-400 text-sm font-medium">Operational</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-black/50 border border-blue-900/30 overflow-hidden relative z-10">
              <div className="p-8 border-b border-blue-900/30 flex justify-between items-center bg-[#0a1128]/50">
                <h3 className="text-2xl font-serif font-bold text-white">
                  Recent Orders
                </h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-blue-400 font-medium hover:text-blue-300 transition-colors bg-blue-500/10 border border-blue-500/20 px-5 py-2.5 rounded-full"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto p-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-blue-300 text-sm uppercase tracking-wider font-medium">
                      <th className="p-4 pl-6">Order ID</th>
                      <th className="p-4">Service</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4 pr-6">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-900/30">
                    {orders.slice(0, 5).map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-blue-900/20 transition-colors group"
                      >
                        <td className="p-4 pl-6 font-medium text-blue-400">
                          #{order.id}
                        </td>
                        <td className="p-4 text-white font-medium">
                          {order.service}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider border
                            ${
                              order.status === "Received"
                                ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                                : order.status === "Washing"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                  : order.status === "Ready"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 font-serif font-bold text-white text-lg">
                          ₱{order.total}
                        </td>
                        <td className="p-4 pr-6 text-blue-200 font-medium">
                          {new Date(order.date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "orders" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-black/50 border border-blue-900/30 overflow-hidden relative z-10"
          >
            <div className="p-8 border-b border-blue-900/30 bg-[#0a1128]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-2xl font-serif font-bold text-white">
                All Orders
              </h3>
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 bg-[#0a1128] border border-blue-900/50 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#0a1128] border border-blue-900/50 rounded-xl pl-10 pr-8 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Received">Received</option>
                    <option value="Washing">Washing</option>
                    <option value="Ready">Ready</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <button
                  onClick={() => setIsCreatingOrder(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Add Order
                </button>
              </div>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-blue-300 text-sm uppercase tracking-wider font-medium">
                    <th className="p-4 pl-6">Order ID</th>
                    <th className="p-4">Customer ID</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4 pr-6">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-900/30">
                  {orders
                    .filter((order) => {
                      const matchesSearch =
                        order.id.toString().includes(searchQuery) ||
                        order.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        order.customerId.toString().includes(searchQuery);
                      const matchesStatus = statusFilter === "All" || order.status === statusFilter;
                      return matchesSearch && matchesStatus;
                    })
                    .map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-blue-900/20 transition-colors group"
                    >
                      <td className="p-4 pl-6 font-medium text-blue-400">
                        #{order.id}
                      </td>
                      <td className="p-4 text-blue-200 font-medium">
                        #{order.customerId}
                      </td>
                      <td className="p-4 text-white font-medium">
                        {order.service}
                      </td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order.id, e.target.value)
                          }
                          className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider border outline-none cursor-pointer appearance-none
                            ${
                              order.status === "Received"
                                ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                                : order.status === "Washing"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                  : order.status === "Ready"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                            }`}
                        >
                          <option
                            value="Received"
                            className="bg-[#0f172a] text-sky-400"
                          >
                            Received
                          </option>
                          <option
                            value="Washing"
                            className="bg-[#0f172a] text-amber-400"
                          >
                            Washing
                          </option>
                          <option
                            value="Ready"
                            className="bg-[#0f172a] text-emerald-400"
                          >
                            Ready
                          </option>
                          <option
                            value="Completed"
                            className="bg-[#0f172a] text-indigo-400"
                          >
                            Completed
                          </option>
                        </select>
                      </td>
                      <td className="p-4 font-serif font-bold text-white text-lg">
                        ₱{order.total}
                      </td>
                      <td className="p-4 pr-6 text-blue-200 font-medium">
                        {new Date(order.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "customers" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-black/50 border border-blue-900/30 overflow-hidden relative z-10"
          >
            <div className="p-8 border-b border-blue-900/30 bg-[#0a1128]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-2xl font-serif font-bold text-white">
                Customer List
              </h3>
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 bg-[#0a1128] border border-blue-900/50 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <button
                  onClick={() => setIsCreatingCustomer(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Add Customer
                </button>
              </div>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-blue-300 text-sm uppercase tracking-wider font-medium">
                    <th className="p-4 pl-6">ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-900/30">
                  {customers
                    .filter((customer) => {
                      const matchesSearch =
                        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        customer.id.toString().includes(searchQuery);
                      return matchesSearch;
                    })
                    .map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-blue-900/20 transition-colors group"
                    >
                      <td className="p-4 pl-6 font-medium text-blue-400">
                        #{customer.id}
                      </td>
                      <td className="p-4 text-white font-medium">
                        {customer.name}
                      </td>
                      <td className="p-4 text-blue-200">{customer.email}</td>
                      <td className="p-4 text-emerald-400 font-bold">
                        {customer.points} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-black/50 border border-blue-900/30 relative z-10 p-8"
          >
            <h3 className="text-2xl font-serif font-bold text-white mb-8">
              Store Settings
            </h3>
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2 uppercase tracking-wider">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={settings.storeName || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, storeName: e.target.value })
                    }
                    className="w-full bg-[#0a1128] border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2 uppercase tracking-wider">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, contactEmail: e.target.value })
                    }
                    className="w-full bg-[#0a1128] border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2 uppercase tracking-wider">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={settings.contactPhone || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, contactPhone: e.target.value })
                    }
                    className="w-full bg-[#0a1128] border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2 uppercase tracking-wider">
                    Currency
                  </label>
                  <input
                    type="text"
                    value={settings.currency || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, currency: e.target.value })
                    }
                    className="w-full bg-[#0a1128] border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-300 mb-2 uppercase tracking-wider">
                    Store Address
                  </label>
                  <textarea
                    value={settings.address || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, address: e.target.value })
                    }
                    className="w-full bg-[#0a1128] border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    rows={3}
                  />
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        )}
        {/* Create Customer Modal */}
        {isCreatingCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0f172a] border border-blue-900/50 rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif font-bold text-white">
                  New Customer
                </h3>
                <button
                  onClick={() => setIsCreatingCustomer(false)}
                  className="text-blue-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleCreateCustomer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="w-full bg-[#0a1128] border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="w-full bg-[#0a1128] border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="w-full bg-[#0a1128] border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">Address</label>
                  <input
                    type="text"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    className="w-full bg-[#0a1128] border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                  >
                    Create Customer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Create Order Modal */}
        {isCreatingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0f172a] border border-blue-900/50 rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif font-bold text-white">
                  New Order
                </h3>
                <button
                  onClick={() => setIsCreatingOrder(false)}
                  className="text-blue-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">Customer</label>
                  <select
                    required
                    value={newOrder.customerId}
                    onChange={(e) => setNewOrder({ ...newOrder, customerId: e.target.value })}
                    className="w-full bg-[#0a1128] border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="" disabled>Select Customer</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">Service</label>
                  <select
                    required
                    value={newOrder.service}
                    onChange={(e) => setNewOrder({ ...newOrder, service: e.target.value })}
                    className="w-full bg-[#0a1128] border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Wash & Fold">Wash & Fold</option>
                    <option value="Dry Cleaning">Dry Cleaning</option>
                    <option value="Ironing">Ironing</option>
                    <option value="Premium Care">Premium Care</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-300 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newOrder.weight}
                      onChange={(e) => setNewOrder({ ...newOrder, weight: e.target.value })}
                      className="w-full bg-[#0a1128] border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-300 mb-1">Total (₱)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newOrder.total}
                      onChange={(e) => setNewOrder({ ...newOrder, total: e.target.value })}
                      className="w-full bg-[#0a1128] border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">Payment Method</label>
                  <select
                    required
                    value={newOrder.paymentMethod}
                    onChange={(e) => setNewOrder({ ...newOrder, paymentMethod: e.target.value })}
                    className="w-full bg-[#0a1128] border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="gcash">GCash</option>
                    <option value="maya">Maya</option>
                    <option value="card">Credit/Debit Card</option>
                  </select>
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                  >
                    Create Order
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

      </main>
    </div>
  );
}
