import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Truck,
  Droplets,
  Wind,
  Sparkles,
  Shirt,
  Footprints,
  Bed
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const SERVICES = [
  {
    id: "wash-fold",
    name: "Wash & Fold",
    price: 150,
    unit: "load",
    icon: Droplets,
    color: "from-blue-500 to-cyan-400",
  },
  {
    id: "dry-clean",
    name: "Dry Cleaning",
    price: 250,
    unit: "item",
    icon: Wind,
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "self-service",
    name: "Self-Service",
    price: 80,
    unit: "cycle",
    icon: Sparkles,
    color: "from-emerald-500 to-teal-400",
  },
  {
    id: "pickup-delivery",
    name: "Pick-up & Delivery",
    price: 500,
    unit: "order",
    icon: Truck,
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "steam-pressing",
    name: "Steam Pressing",
    price: 50,
    unit: "item",
    icon: Shirt,
    color: "from-teal-500 to-emerald-500",
  },
  {
    id: "shoe-cleaning",
    name: "Shoe Cleaning",
    price: 350,
    unit: "pair",
    icon: Footprints,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "bedding-curtain",
    name: "Bedding & Curtain",
    price: 400,
    unit: "item",
    icon: Bed,
    color: "from-cyan-500 to-blue-500",
  },
];

export default function BookLaundry() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [weight, setWeight] = useState(1);
  const [payment, setPayment] = useState("cash");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) navigate("/login");
    else setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleBook = async () => {
    const selectedService = SERVICES.find((s) => s.id === service);
    const total = (selectedService?.price || 0) * weight;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: user.id,
          service: selectedService?.name,
          weight,
          total,
          paymentMethod: payment,
        }),
      });
      if (res.ok) {
        toast.success("Booking confirmed successfully!");
        navigate("/customer");
      } else {
        toast.error("Failed to confirm booking");
      }
    } catch (error) {
      console.error("Booking failed", error);
      toast.error("An error occurred during booking");
    }
  };

  const selectedServiceDetails = SERVICES.find((s) => s.id === service);
  const total = (selectedServiceDetails?.price || 0) * weight;

  return (
    <div className="min-h-screen bg-[#0a1128] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans text-[#f8fafc]">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/20 to-[#0a1128] -z-10" />

      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : navigate("/customer"))}
          className="flex items-center gap-2 text-blue-200 hover:text-white mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="h-5 w-5" /> Back to Dashboard
        </button>

        <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl shadow-black/50 border border-blue-900/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5 pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-10 relative z-10">
            <h2 className="text-3xl font-serif font-bold text-white">
              Book Service
            </h2>
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    i === step
                      ? "w-12 bg-gradient-to-r from-blue-500 to-indigo-500"
                      : i < step
                        ? "w-6 bg-blue-500/30"
                        : "w-6 bg-blue-900/30"
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 relative z-10"
            >
              {step === 1 && (
                <div>
                  <h3 className="text-xl font-serif font-bold text-white mb-6">
                    Select Service Type
                  </h3>
                  <div className="grid gap-4">
                    {SERVICES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setService(s.id)}
                        className={`group flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                          service === s.id
                            ? "border-blue-500 bg-blue-500/10 shadow-md shadow-blue-500/10"
                            : "border-blue-900/30 hover:border-blue-500/50 hover:bg-blue-900/20"
                        }`}
                      >
                        <div className="flex items-center gap-5">
                          <div
                            className={`p-4 rounded-xl transition-all duration-300 ${
                              service === s.id
                                ? `bg-gradient-to-br ${s.color} text-white shadow-lg`
                                : "bg-[#0a1128] text-blue-300 group-hover:bg-blue-900/40 group-hover:text-blue-200"
                            }`}
                          >
                            <s.icon className="h-7 w-7" />
                          </div>
                          <div className="text-left">
                            <p className="text-lg font-serif font-bold text-white">
                              {s.name}
                            </p>
                            <p className="text-blue-200 font-medium">
                              ₱{s.price} / {s.unit}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                            service === s.id
                              ? "border-blue-500 bg-blue-500 text-white"
                              : "border-blue-900/50 text-transparent"
                          }`}
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={!service}
                    onClick={() => setStep(2)}
                    className="w-full mt-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Continue to Details
                  </button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="text-xl font-serif font-bold text-white mb-6">
                    Details & Pickup
                  </h3>
                  <div className="space-y-8">
                    <div className="bg-[#0a1128]/50 p-8 rounded-2xl border border-blue-900/30">
                      <label className="block text-center font-serif font-bold text-white mb-6 text-lg">
                        Quantity / Estimated Weight
                      </label>
                      <div className="flex items-center justify-center gap-6">
                        <button
                          onClick={() => setWeight(Math.max(1, weight - 1))}
                          className="w-14 h-14 rounded-xl bg-[#0f172a] border border-blue-900/50 flex items-center justify-center text-2xl font-bold text-blue-300 hover:border-blue-500 hover:text-blue-200 shadow-sm transition-all"
                        >
                          -
                        </button>
                        <span className="text-5xl font-serif font-bold text-blue-400 w-24 text-center">
                          {weight}
                        </span>
                        <button
                          onClick={() => setWeight(weight + 1)}
                          className="w-14 h-14 rounded-xl bg-[#0f172a] border border-blue-900/50 flex items-center justify-center text-2xl font-bold text-blue-300 hover:border-blue-500 hover:text-blue-200 shadow-sm transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="bg-blue-900/10 p-6 rounded-2xl border border-blue-900/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-blue-900/30 p-2 rounded-lg">
                          <Truck className="h-5 w-5 text-blue-400" />
                        </div>
                        <span className="font-serif font-bold text-white text-lg">
                          Pickup Address
                        </span>
                      </div>
                      <p className="text-blue-200 font-medium pl-12">
                        123 Manila Street, Metro Manila
                      </p>
                      <button className="text-blue-400 font-medium mt-3 pl-12 hover:text-blue-300 transition-colors">
                        Change Address
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(3)}
                    className="w-full mt-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-medium text-lg hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="text-xl font-serif font-bold text-white mb-6">
                    Payment Method
                  </h3>
                  <div className="grid gap-4 mb-10">
                    <button
                      onClick={() => setPayment("cash")}
                      className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                        payment === "cash"
                          ? "border-blue-500 bg-blue-500/10 shadow-md shadow-blue-500/10"
                          : "border-blue-900/30 hover:border-blue-500/50 hover:bg-blue-900/20"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl ${payment === "cash" ? "bg-blue-500/20 text-blue-400" : "bg-[#0a1128] text-blue-300"}`}
                        >
                          <CreditCard className="h-6 w-6" />
                        </div>
                        <span className="font-serif font-bold text-white text-lg">
                          Cash on Delivery
                        </span>
                      </div>
                      <div
                        className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          payment === "cash"
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-blue-900/50 text-transparent"
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    </button>
                    <button
                      onClick={() => setPayment("gcash")}
                      className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                        payment === "gcash"
                          ? "border-blue-500 bg-blue-500/10 shadow-md shadow-blue-500/10"
                          : "border-blue-900/30 hover:border-blue-500/50 hover:bg-blue-900/20"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/20">
                          <div className="h-6 w-6 bg-blue-500 rounded-full" />
                        </div>
                        <span className="font-serif font-bold text-white text-lg">
                          GCash
                        </span>
                      </div>
                      <div
                        className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          payment === "gcash"
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-blue-900/50 text-transparent"
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    </button>
                  </div>

                  <div className="bg-[#0a1128]/50 p-8 rounded-2xl border border-blue-900/30 mb-10">
                    <h4 className="font-serif font-bold text-white mb-6 text-lg">
                      Order Summary
                    </h4>
                    <div className="space-y-4 text-blue-200 font-medium">
                      <div className="flex justify-between">
                        <span>
                          {selectedServiceDetails?.name} (Qty: {weight})
                        </span>
                        <span className="text-white font-bold">₱{total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span className="text-white font-bold">₱50</span>
                      </div>
                      <div className="pt-6 mt-6 border-t border-blue-900/30 flex justify-between items-center">
                        <span className="text-lg text-white">Total Amount</span>
                        <span className="text-3xl font-serif font-bold text-blue-400">
                          ₱{total + 50}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleBook}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-xl font-medium text-xl hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Confirm Booking
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
