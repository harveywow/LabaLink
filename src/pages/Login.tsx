import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("customer@test.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      toast.success(`Welcome back, ${data.user.name}!`);

      if (data.user.role === "admin") navigate("/admin");
      else if (data.user.role === "staff") navigate("/staff");
      else navigate("/customer");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1128] flex items-center justify-center relative overflow-hidden px-4">
      {/* Spotlight Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif tracking-widest text-white mb-4">
            LABALINK
          </h1>
          <p className="text-sm tracking-widest text-slate-400 uppercase">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center text-slate-500">
                <User className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <input
                type="email"
                required
                className="w-full bg-transparent border-b border-slate-700 py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-white transition-colors font-light tracking-wide"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center text-slate-500">
                <Lock className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <input
                type="password"
                required
                className="w-full bg-transparent border-b border-slate-700 py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-white transition-colors font-light tracking-wide"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs tracking-widest uppercase text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
              <input
                type="checkbox"
                className="w-3 h-3 bg-transparent border-slate-700 rounded-none focus:ring-0 focus:ring-offset-0"
              />
              Remember me
            </label>
            <a href="#" className="hover:text-white transition-colors">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-between py-4 border border-white text-white hover:bg-white hover:text-[#0a1128] transition-all duration-300 uppercase tracking-widest text-sm px-6 group"
          >
            <span>Sign In</span>
            <ArrowRight
              className="h-4 w-4 transform group-hover:translate-x-1 transition-transform"
              strokeWidth={1.5}
            />
          </button>

          <div className="mt-12 pt-8 border-t border-slate-800/50 text-center">
            <p className="text-xs tracking-widest text-slate-500 uppercase mb-4">
              Demo Access
            </p>
            <div className="flex justify-center gap-6 text-xs tracking-widest text-slate-400 uppercase">
              <button
                type="button"
                onClick={() => setEmail("customer@test.com")}
                className="hover:text-white transition-colors"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setEmail("admin@test.com")}
                className="hover:text-white transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setEmail("staff@test.com")}
                className="hover:text-white transition-colors"
              >
                Staff
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
