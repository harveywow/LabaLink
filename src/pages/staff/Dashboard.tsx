import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  LogOut,
  Clock,
  ArrowRight,
  CheckCircle2,
  WashingMachine,
  MapPin,
  Phone,
  Search,
  Filter,
  QrCode,
  UserPlus,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function StaffDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isCreatingWalkIn, setIsCreatingWalkIn] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [simulatedOrderId, setSimulatedOrderId] = useState("");
  const [walkInForm, setWalkInForm] = useState({
    name: "",
    phone: "",
    service: "Wash & Fold",
    weight: "",
    total: "",
    paymentMethod: "cash",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "staff") {
      navigate("/login");
      return;
    }
    setUser(parsedUser);

    fetch("/api/orders?role=staff")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleCreateWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Create a walk-in customer
      const userRes = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: walkInForm.name,
          phone: walkInForm.phone,
          email: `walkin_${Date.now()}@labalink.local`,
          address: "Walk-in Customer",
        }),
      });
      
      if (!userRes.ok) throw new Error("Failed to create customer");
      const newUser = await userRes.json();

      // 2. Create the order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: newUser.id,
          service: walkInForm.service,
          weight: Number(walkInForm.weight),
          total: Number(walkInForm.total),
          paymentMethod: walkInForm.paymentMethod,
        }),
      });

      if (!orderRes.ok) throw new Error("Failed to create order");

      toast.success("Walk-in order created successfully!");
      setIsCreatingWalkIn(false);
      setWalkInForm({ name: "", phone: "", service: "Wash & Fold", weight: "", total: "", paymentMethod: "cash" });
      
      // Refetch orders
      fetch("/api/orders?role=staff")
        .then((res) => res.json())
        .then((data) => setOrders(data));
    } catch (error) {
      console.error("Walk-in creation failed", error);
      toast.error("An error occurred while creating walk-in order");
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(orders.map((o) => (o.id === id ? updatedOrder : o)));
        toast.success(`Order #${id} marked as ${newStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("An error occurred");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a1128] text-[#f8fafc]">
      {/* Header */}
      <header className="bg-[#0a1128]/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-sky-400 p-2 rounded-lg shadow-md shadow-indigo-500/20">
                <WashingMachine className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-playfair font-bold text-white">
                Staff Portal
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
                  {user.name.charAt(0)}
                </div>
                <span className="text-sm font-bold text-slate-300 hidden sm:block">
                  {user.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-slate-500 hover:text-indigo-400 transition-colors"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-playfair font-bold text-white">
              Active Tasks
            </h2>
            <p className="text-slate-400 mt-2 text-lg">
              Manage and update laundry orders in real-time.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-2 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors border border-indigo-500/30"
            >
              <QrCode className="h-4 w-4" /> Scan QR
            </button>
            <button
              onClick={() => setIsCreatingWalkIn(true)}
              className="flex items-center gap-2 bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors border border-sky-500/30"
            >
              <UserPlus className="h-4 w-4" /> New Walk-in
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0a1128] border border-white/10 rounded-xl pl-10 pr-8 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Received">Received</option>
              <option value="Washing">Washing</option>
              <option value="Ready">Ready</option>
              <option value="Out for Delivery">Out for Delivery</option>
            </select>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {orders
            .filter((order) => {
              const matchesSearch =
                order.id.toString().includes(searchQuery) ||
                order.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesStatus = statusFilter === "All" || order.status === statusFilter;
              return matchesSearch && matchesStatus;
            })
            .map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-[2rem] p-8 border border-white/10 shadow-xl shadow-black/50 hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 flex flex-col group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-3 py-1 rounded-full">
                    Order #{order.id}
                  </span>
                  <h3 className="text-xl font-playfair font-bold text-white mt-4">
                    {order.service}
                  </h3>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border
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
              </div>

              <div className="space-y-4 mb-8 flex-1">
                <div className="flex items-center gap-4 text-slate-300 font-medium">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Package className="h-5 w-5 text-slate-400" />
                  </div>
                  {order.weight} kg
                </div>
                <div className="flex items-center gap-4 text-slate-300 font-medium">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Clock className="h-5 w-5 text-slate-400" />
                  </div>
                  {new Date(order.date).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Customer Details
                    </p>
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider bg-indigo-500/10 px-2 py-1 rounded">
                      {order.paymentMethod || 'cash'}
                    </span>
                  </div>
                  <p className="text-white font-bold">{order.customerName}</p>
                  <div className="flex items-start gap-3 text-slate-400 text-sm">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{order.customerAddress}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>{order.customerPhone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Update Status
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => updateStatus(order.id, "Washing")}
                    disabled={
                      order.status === "Washing" ||
                      order.status === "Ready" ||
                      order.status === "Out for Delivery"
                    }
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-orange-500/20 disabled:opacity-50 disabled:from-white/5 disabled:to-white/5 disabled:text-slate-500 disabled:shadow-none transition-all duration-300"
                  >
                    Washing
                  </button>
                  <button
                    onClick={() => updateStatus(order.id, "Ready")}
                    disabled={
                      order.status === "Ready" ||
                      order.status === "Out for Delivery"
                    }
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 disabled:from-white/5 disabled:to-white/5 disabled:text-slate-500 disabled:shadow-none transition-all duration-300"
                  >
                    Ready <CheckCircle2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => updateStatus(order.id, "Out for Delivery")}
                    disabled={order.status === "Out for Delivery"}
                    className="col-span-2 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-sky-500 text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50 disabled:from-white/5 disabled:to-white/5 disabled:text-slate-500 disabled:shadow-none transition-all duration-300"
                  >
                    Out for Delivery <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Create Walk-in Modal */}
      {isCreatingWalkIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0f172a] border border-indigo-900/50 rounded-3xl p-8 w-full max-w-md shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-playfair font-bold text-white">
                New Walk-in Order
              </h3>
              <button
                onClick={() => setIsCreatingWalkIn(false)}
                className="text-indigo-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateWalkIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={walkInForm.name}
                  onChange={(e) => setWalkInForm({ ...walkInForm, name: e.target.value })}
                  className="w-full bg-[#0a1128] border border-indigo-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Juan Dela Cruz"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={walkInForm.phone}
                  onChange={(e) => setWalkInForm({ ...walkInForm, phone: e.target.value })}
                  className="w-full bg-[#0a1128] border border-indigo-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. 09123456789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Service</label>
                <select
                  required
                  value={walkInForm.service}
                  onChange={(e) => setWalkInForm({ ...walkInForm, service: e.target.value })}
                  className="w-full bg-[#0a1128] border border-indigo-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Wash & Fold">Wash & Fold</option>
                  <option value="Dry Cleaning">Dry Cleaning</option>
                  <option value="Ironing">Ironing</option>
                  <option value="Premium Care">Premium Care</option>
                  <option value="Shoe Cleaning">Shoe Cleaning</option>
                  <option value="Bedding & Curtain">Bedding & Curtain</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={walkInForm.weight}
                    onChange={(e) => setWalkInForm({ ...walkInForm, weight: e.target.value })}
                    className="w-full bg-[#0a1128] border border-indigo-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Total (₱)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={walkInForm.total}
                    onChange={(e) => setWalkInForm({ ...walkInForm, total: e.target.value })}
                    className="w-full bg-[#0a1128] border border-indigo-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Payment Method</label>
                <select
                  required
                  value={walkInForm.paymentMethod}
                  onChange={(e) => setWalkInForm({ ...walkInForm, paymentMethod: e.target.value })}
                  className="w-full bg-[#0a1128] border border-indigo-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
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
                  className="w-full bg-gradient-to-r from-indigo-600 to-sky-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                >
                  Create Walk-in Order
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Mock QR Scanner Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0f172a] border border-indigo-900/50 rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-playfair font-bold text-white flex items-center gap-2">
                <QrCode className="h-6 w-6 text-indigo-400" /> Scan QR Code
              </h3>
              <button
                onClick={() => setIsScannerOpen(false)}
                className="text-indigo-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Fake Camera View */}
            <div className="relative w-full aspect-square bg-black rounded-2xl border-2 border-indigo-500/30 overflow-hidden mb-6 flex items-center justify-center">
              <p className="text-slate-500 text-sm z-10 font-medium tracking-widest uppercase">Camera Active...</p>
              {/* Scanning Laser */}
              <motion.div
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute left-0 right-0 h-0.5 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,1)] z-20"
              />
              {/* Corner markers */}
              <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl"></div>
              <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl"></div>
              <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl"></div>
              <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-indigo-500 rounded-br-xl"></div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Simulate Scan (Enter Order ID)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={simulatedOrderId}
                    onChange={(e) => setSimulatedOrderId(e.target.value)}
                    placeholder="e.g. 101"
                    className="flex-1 bg-[#0a1128] border border-indigo-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => {
                      if (simulatedOrderId) {
                        setSearchQuery(simulatedOrderId);
                        setIsScannerOpen(false);
                        toast.success(`Scanned Order #${simulatedOrderId}`);
                        setSimulatedOrderId("");
                      } else {
                        toast.error("Please enter an Order ID");
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-colors"
                  >
                    Scan
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
