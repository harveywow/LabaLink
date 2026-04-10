import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, User, ArrowLeft, Droplets, Wind, Sparkles, Truck, Shirt, Footprints, Bed, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Services() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const services = [
    {
      icon: <Droplets className="w-8 h-8 text-emerald-400" strokeWidth={1.5} />,
      title: "Wash & Fold",
      description: "Everyday laundry, perfectly washed, dried, and neatly folded. Ready for your closet.",
      benefits: ["Eco-friendly detergents", "Color separation", "Next-day standard"],
      priceHint: "From ₱150 / load"
    },
    {
      icon: <Wind className="w-8 h-8 text-teal-400" strokeWidth={1.5} />,
      title: "Dry Cleaning",
      description: "Specialized care for your delicate fabrics, suits, and formal wear.",
      benefits: ["Stain removal", "Fabric protection", "Hand-finished"],
      priceHint: "From ₱250 / item"
    },
    {
      icon: <Sparkles className="w-8 h-8 text-emerald-400" strokeWidth={1.5} />,
      title: "Self-Service Laundromat",
      description: "High-tech, high-capacity machines for those who prefer to do it themselves.",
      benefits: ["App-controlled machines", "Free Wi-Fi", "Lounge area"],
      priceHint: "From ₱80 / cycle"
    },
    {
      icon: <Truck className="w-8 h-8 text-teal-400" strokeWidth={1.5} />,
      title: "Pick-up & Delivery",
      description: "Ultimate convenience. We collect your laundry and return it fresh and clean.",
      benefits: ["Real-time tracking", "Flexible scheduling", "Contactless option"],
      priceHint: "Free for orders over ₱500"
    },
    {
      icon: <Shirt className="w-8 h-8 text-emerald-400" strokeWidth={1.5} />,
      title: "Steam Pressing",
      description: "Professional pressing to keep your garments crisp and wrinkle-free.",
      benefits: ["Perfect creases", "Gentle on fabrics", "Quick turnaround"],
      priceHint: "From ₱50 / item"
    },
    {
      icon: <Footprints className="w-8 h-8 text-teal-400" strokeWidth={1.5} />,
      title: "Shoe Cleaning",
      description: "Deep cleaning and restoration for your favorite sneakers and leather shoes.",
      benefits: ["Deodorizing", "Stain treatment", "Material-specific care"],
      priceHint: "From ₱350 / pair"
    },
    {
      icon: <Bed className="w-8 h-8 text-emerald-400" strokeWidth={1.5} />,
      title: "Bedding & Curtain Cleaning",
      description: "Bulky items need special care. We handle comforters, duvets, and curtains.",
      benefits: ["Allergen removal", "Deep sanitization", "Large capacity"],
      priceHint: "From ₱400 / item"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a1128] text-white relative overflow-hidden flex flex-col">
      {/* Spotlight Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Navigation */}
      <nav className="relative z-10 w-full px-8 py-8 flex justify-between items-center border-b border-white/10 bg-[#0a1128]/50 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-8">
          <Link to="/" className="hover:text-slate-300 transition-colors">
            <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
          </Link>
          <div className="text-xl font-serif tracking-widest text-white">
            LABALINK
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs font-medium tracking-[0.2em] text-white uppercase">
          <Link to="/services" className="text-emerald-400 transition-colors">Services</Link>
          <Link to="/about" className="hover:text-slate-300 transition-colors">Our World</Link>
          <Link to="/stories" className="hover:text-slate-300 transition-colors">Stories</Link>
        </div>
        <div className="flex items-center gap-6 text-white">
          <button onClick={() => setIsSearchOpen(true)} className="hover:text-slate-300 transition-colors"><Search className="w-5 h-5" strokeWidth={1.5} /></button>
          <button onClick={() => setIsLocationOpen(true)} className="hover:text-slate-300 transition-colors"><MapPin className="w-5 h-5" strokeWidth={1.5} /></button>
          <Link to="/login" className="hover:text-slate-300 transition-colors"><User className="w-5 h-5" strokeWidth={1.5} /></Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-8 py-16 md:py-24 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-light leading-tight tracking-wide mb-6">
            PREMIUM CARE FOR <br />
            <span className="font-serif italic text-emerald-400">EVERY FABRIC</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed">
            From everyday wear to delicate formal attire, our tech-enabled services are designed to give you back your time. Convenient, high-quality, and tailored to your lifestyle.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
              className="bg-[#0f172a]/80 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:border-emerald-500/30 hover:bg-[#0f172a] transition-all group"
            >
              <div className="mb-6 p-4 bg-white/5 rounded-2xl inline-block group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-2xl font-serif mb-3">{service.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {service.description}
              </p>
              <ul className="space-y-2 mb-8">
                {service.benefits.map((benefit, i) => (
                  <li key={i} className="text-xs tracking-wider uppercase text-slate-300 flex items-center gap-2">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                <span className="text-sm font-medium text-emerald-400">{service.priceHint}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="mt-24 text-center bg-gradient-to-br from-[#0f172a] to-[#0a1128] border border-white/10 p-12 rounded-3xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-serif mb-6 relative z-10">Ready for smarter laundry?</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto relative z-10">
            Download the LabaLink app to schedule your first pickup, track your orders in real-time, and earn loyalty rewards.
          </p>
          <Link 
            to="/login"
            className="relative z-10 inline-flex items-center justify-center px-8 py-4 bg-emerald-500 text-[#0a1128] text-sm font-bold uppercase tracking-widest hover:bg-emerald-400 transition-colors rounded-full"
          >
            Book Now
          </Link>
        </motion.div>
      </main>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0a1128]/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-8 right-8 text-white hover:text-slate-300 transition-colors"
            >
              <X className="w-8 h-8" strokeWidth={1} />
            </button>
            <div className="w-full max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" strokeWidth={1.5} />
                <input 
                  type="text" 
                  placeholder="Search services, locations, or help..." 
                  className="w-full bg-transparent border-b-2 border-white/20 text-white text-2xl md:text-4xl font-light py-4 pl-16 pr-4 focus:outline-none focus:border-white transition-colors placeholder:text-slate-600"
                  autoFocus
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Modal */}
      <AnimatePresence>
        {isLocationOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0a1128]/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <button 
              onClick={() => setIsLocationOpen(false)}
              className="absolute top-8 right-8 text-white hover:text-slate-300 transition-colors"
            >
              <X className="w-8 h-8" strokeWidth={1} />
            </button>
            <div className="w-full max-w-4xl bg-[#0f172a] border border-white/10 p-8 rounded-3xl shadow-2xl">
              <h2 className="text-3xl font-serif text-white mb-2">Our Location</h2>
              <p className="text-slate-400 text-sm tracking-widest uppercase mb-8">
                España Boulevard, Sampaloc, Manila
              </p>
              <div className="w-full h-[400px] rounded-xl overflow-hidden bg-slate-800 relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15443.43441584284!2d120.9859556!3d14.6071477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b5f9b4c0b5b1%3A0x6b4b4b4b4b4b4b4b!2sEspa%C3%B1a%20Blvd%2C%20Sampaloc%2C%20Manila%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1713180000000!5m2!1sen!2sph" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="LabaLink Location"
                ></iframe>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
