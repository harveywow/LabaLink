import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Package,
  Clock,
  LogOut,
  Star,
  Gift,
  User,
  MapPin,
  Phone,
  Mail,
  Bell,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function CustomerDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("orders");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    
    // Fetch latest user data to get accurate points
    fetch(`/api/users/${parsedUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        setEditForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      })
      .catch(() => {
        setUser(parsedUser);
        setEditForm({
          name: parsedUser.name || "",
          email: parsedUser.email || "",
          phone: parsedUser.phone || "",
          address: parsedUser.address || "",
        });
      });

    setIsLoadingOrders(true);
    fetch(`/api/orders?role=customer&userId=${parsedUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setIsLoadingOrders(false);
      })
      .catch((err) => {
        console.error("Failed to fetch orders", err);
        setIsLoadingOrders(false);
        toast.error("Failed to load orders.");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditingProfile(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleRedeemReward = async () => {
    try {
      const res = await fetch(`/api/users/${user.id}/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pointsToDeduct: 500 }),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Reward redeemed! Check your email for details.");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to redeem reward");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: "Cancelled" } : o));
        toast.success("Order cancelled successfully");
      } else {
        toast.error("Failed to cancel order");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a1128] text-white">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-30 bg-[#0a1128]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-xl font-serif tracking-widest">
              LABALINK
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-slate-300">
                <Star className="h-4 w-4" strokeWidth={1.5} />
                {user.points} pts
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs tracking-widest uppercase text-slate-300 hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 relative"
        >
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-4">
              Welcome back, <span className="font-serif italic text-slate-300">{user.name}</span>
            </h2>
            <p className="text-slate-400 text-sm tracking-widest uppercase max-w-xl mb-8">
              Track your active laundry orders or book a new pickup.
            </p>

            <Link
              to="/customer/book"
              className="inline-flex items-center gap-4 text-xs font-medium uppercase tracking-[0.2em] text-[#0a1128] bg-white px-8 py-4 hover:bg-slate-200 transition-colors"
            >
              <Plus className="h-4 w-4" strokeWidth={1.5} /> Book New Service
            </Link>
          </div>
        </motion.div>

        <div className="mb-12 border-b border-white/10">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("orders")}
              className={`pb-4 text-xs tracking-[0.2em] uppercase transition-colors relative ${activeTab === "orders" ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              My Orders
              {activeTab === "orders" && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white" />}
            </button>
            <button
              onClick={() => setActiveTab("rewards")}
              className={`pb-4 text-xs tracking-[0.2em] uppercase transition-colors relative ${activeTab === "rewards" ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              Rewards
              {activeTab === "rewards" && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white" />}
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-4 text-xs tracking-[0.2em] uppercase transition-colors relative ${activeTab === "profile" ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              Profile
              {activeTab === "profile" && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white" />}
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`pb-4 text-xs tracking-[0.2em] uppercase transition-colors relative ${activeTab === "notifications" ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              Notifications
              {activeTab === "notifications" && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white" />}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {isLoadingOrders ? (
                <div className="col-span-full py-16 text-center">
                  <div className="w-8 h-8 border-2 border-slate-500 border-t-white rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-slate-400 text-sm tracking-widest uppercase">
                    Loading your orders...
                  </p>
                </div>
              ) : orders.length === 0 ? (
                <div className="col-span-full border border-white/10 p-16 text-center">
                  <Package className="h-8 w-8 text-slate-500 mx-auto mb-6" strokeWidth={1} />
                  <h3 className="text-xl font-serif tracking-widest text-white mb-2">
                    NO ACTIVE ORDERS
                  </h3>
                  <p className="text-slate-400 text-sm tracking-widest uppercase">
                    Book your first laundry service today.
                  </p>
                </div>
              ) : (
                orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-white/10 p-8 hover:border-white/30 transition-colors flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">
                          Order #{order.id}
                        </span>
                        <h3 className="text-lg font-serif tracking-widest text-white mt-2">
                          {order.service}
                        </h3>
                      </div>
                      <span className={`text-[10px] uppercase tracking-[0.2em] px-3 py-1 border ${
                        order.status === 'Pending' ? 'text-yellow-300 border-yellow-300/30 bg-yellow-300/10' :
                        order.status === 'Completed' ? 'text-emerald-300 border-emerald-300/30 bg-emerald-300/10' :
                        order.status === 'Cancelled' ? 'text-red-300 border-red-300/30 bg-red-300/10' :
                        'text-blue-300 border-blue-300/30 bg-blue-300/10'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-4 mb-8 text-sm tracking-widest text-slate-400 flex-grow">
                      <div className="flex items-center gap-4">
                        <Package className="h-4 w-4" strokeWidth={1.5} />
                        {order.weight} kg/qty
                      </div>
                      <div className="flex items-center gap-4">
                        <Clock className="h-4 w-4" strokeWidth={1.5} />
                        {new Date(order.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                      <span className="text-xs tracking-[0.2em] uppercase text-slate-400">
                        Total
                      </span>
                      <span className="text-lg font-serif tracking-widest text-white">
                        ₱{order.total}
                      </span>
                    </div>
                    
                    {order.status === 'Pending' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="mt-6 w-full py-3 border border-red-500/30 text-red-400 text-xs tracking-[0.2em] uppercase hover:bg-red-500/10 transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === "rewards" && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-8 md:grid-cols-2"
            >
              <div className="border border-white/10 p-10 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <Star className="h-6 w-6 text-slate-300" strokeWidth={1} />
                    <h3 className="text-sm tracking-[0.2em] uppercase text-slate-300">
                      Your Points
                    </h3>
                  </div>
                  <div className="text-6xl font-serif tracking-widest mb-4">
                    {user.points}
                  </div>
                  <p className="text-slate-400 text-xs tracking-widest uppercase">
                    Earn 10 points for every ₱100 spent.
                  </p>

                  <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase text-slate-400 mb-4">
                      <span>Progress to Free Wash</span>
                      <span>{user.points} / 500</span>
                    </div>
                    <div className="h-[1px] bg-white/10 w-full relative">
                      <div
                        className="absolute top-0 left-0 h-full bg-white transition-all duration-1000"
                        style={{
                          width: `${Math.min((user.points / 500) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-white/10 p-10 flex flex-col justify-center items-center text-center">
                <Gift className="h-8 w-8 text-slate-500 mb-6" strokeWidth={1} />
                <h3 className="text-xl font-serif tracking-widest text-white mb-4">
                  REDEEM REWARDS
                </h3>
                <p className="text-slate-400 text-xs tracking-widest uppercase mb-8 max-w-sm leading-relaxed">
                  Use your points to get discounts on your next laundry service
                  or claim free washes.
                </p>
                <button
                  disabled={user.points < 500}
                  onClick={handleRedeemReward}
                  className="border border-white text-white px-8 py-4 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-[#0a1128] transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-white"
                >
                  Redeem Free Wash (500 pts)
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border border-white/10 p-10 max-w-3xl"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-serif tracking-widest text-white flex items-center gap-4">
                  <User className="h-5 w-5 text-slate-400" strokeWidth={1.5} /> PERSONAL INFORMATION
                </h3>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="border border-white/20 text-slate-300 px-6 py-2 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-[#0a1128] transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleProfileUpdate} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-slate-500 mb-3">
                        Full Name
                      </label>
                      <div className="flex items-center gap-4 border-b border-white/30 pb-2 focus-within:border-white transition-colors">
                        <User className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
                        <input
                          type="text"
                          required
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full bg-transparent text-sm tracking-widest text-white placeholder-slate-600 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-slate-500 mb-3">
                        Email Address
                      </label>
                      <div className="flex items-center gap-4 border-b border-white/30 pb-2 focus-within:border-white transition-colors">
                        <Mail className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
                        <input
                          type="email"
                          required
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full bg-transparent text-sm tracking-widest text-white placeholder-slate-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-slate-500 mb-3">
                      Phone Number
                    </label>
                    <div className="flex items-center gap-4 border-b border-white/30 pb-2 focus-within:border-white transition-colors">
                      <Phone className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="e.g. +63 912 345 6789"
                        className="w-full bg-transparent text-sm tracking-widest text-white placeholder-slate-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-slate-500 mb-3">
                      Delivery Address
                    </label>
                    <div className="flex items-start gap-4 border-b border-white/30 pb-2 focus-within:border-white transition-colors">
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-1" strokeWidth={1.5} />
                      <textarea
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        placeholder="Enter your full delivery address"
                        rows={2}
                        className="w-full bg-transparent text-sm tracking-widest text-white placeholder-slate-600 focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-8 flex gap-4">
                    <button
                      type="submit"
                      className="bg-white text-[#0a1128] px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-slate-200 transition-colors font-medium"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setEditForm({
                          name: user.name || "",
                          email: user.email || "",
                          phone: user.phone || "",
                          address: user.address || "",
                        });
                      }}
                      className="border border-white/20 text-slate-300 px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-slate-500 mb-3">
                        Full Name
                      </label>
                      <div className="flex items-center gap-4 border-b border-white/10 pb-3">
                        <User className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
                        <span className="text-sm tracking-widest text-slate-200">
                          {user.name}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-slate-500 mb-3">
                        Email Address
                      </label>
                      <div className="flex items-center gap-4 border-b border-white/10 pb-3">
                        <Mail className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
                        <span className="text-sm tracking-widest text-slate-200">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-slate-500 mb-3">
                      Phone Number
                    </label>
                    <div className="flex items-center gap-4 border-b border-white/10 pb-3">
                      <Phone className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
                      <span className="text-sm tracking-widest text-slate-200">
                        {user.phone || "Not provided"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-slate-500 mb-3">
                      Delivery Address
                    </label>
                    <div className="flex items-start gap-4 border-b border-white/10 pb-3">
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0" strokeWidth={1.5} />
                      <span className="text-sm tracking-widest text-slate-200">
                        {user.address || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl"
            >
              <div className="border border-white/10 p-10">
                <h3 className="text-xl font-serif tracking-widest text-white mb-10 flex items-center gap-4">
                  <Bell className="h-5 w-5 text-slate-400" strokeWidth={1.5} /> RECENT NOTIFICATIONS
                </h3>

                <div className="space-y-6">
                  {orders.length > 0 ? (
                    orders.slice(0, 5).map((order, index) => (
                      <div key={index} className="flex items-start gap-4 border-b border-white/10 pb-6 last:border-0 last:pb-0">
                        <div className="p-3 rounded-full bg-white/5 border border-white/10 mt-1">
                          <Package className="h-4 w-4 text-slate-300" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-sm tracking-widest text-white mb-1">
                            Order #{order.id} status updated to <span className="font-bold text-blue-400">{order.status}</span>
                          </p>
                          <p className="text-[10px] tracking-[0.2em] uppercase text-slate-500">
                            {new Date(order.date).toLocaleDateString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <Bell className="h-8 w-8 text-slate-500 mx-auto mb-4" strokeWidth={1} />
                      <p className="text-slate-400 text-sm tracking-widest uppercase">
                        No recent notifications.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
