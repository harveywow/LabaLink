import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a1128] relative overflow-hidden flex flex-col">
      {/* Spotlight Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/10 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Navigation */}
      <nav className="relative z-10 w-full px-8 py-8 flex justify-between items-center">
        <div className="flex items-center gap-16">
          <div className="text-2xl font-serif tracking-widest text-white">
            LABALINK
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-medium tracking-[0.2em] text-white uppercase">
            <Link to="/services" className="hover:text-slate-300 transition-colors">Services</Link>
            <Link to="/about" className="hover:text-slate-300 transition-colors">Our World</Link>
            <Link to="/stories" className="hover:text-slate-300 transition-colors">Stories</Link>
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-white">
          <button onClick={() => setIsSearchOpen(true)} className="hover:text-slate-300 transition-colors"><Search className="w-5 h-5" strokeWidth={1.5} /></button>
          <button onClick={() => setIsLocationOpen(true)} className="hover:text-slate-300 transition-colors"><MapPin className="w-5 h-5" strokeWidth={1.5} /></button>
          <Link to="/login" className="hover:text-slate-300 transition-colors"><User className="w-5 h-5" strokeWidth={1.5} /></Link>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 flex items-center px-8 md:px-24">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-light text-white leading-[1.1] tracking-wide mb-12">
              <span className="block">CLEAN CLOTHES,</span>
              <span className="block font-serif italic text-slate-200">SMARTER LIVES.</span>
              <span className="block">TECH-ENABLED</span>
              <span className="block font-serif italic text-slate-200">LAUNDRY</span>
            </h1>
            
            <Link 
              to="/login"
              className="inline-flex items-center gap-4 text-xs font-medium uppercase tracking-[0.2em] text-white hover:text-slate-300 transition-colors group"
            >
              <span className="w-12 h-[1px] bg-white group-hover:bg-slate-300 transition-colors"></span>
              Discover more
            </Link>
          </motion.div>
        </div>

        {/* Floating Element (like the watch in the image) */}
        <motion.div 
          className="absolute right-[-10%] md:right-10 top-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] pointer-events-none"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        >
          <img 
            src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop" 
            alt="Premium Laundry" 
            className="w-full h-full object-cover rounded-full opacity-90 mix-blend-luminosity"
            style={{ maskImage: 'radial-gradient(circle, black 40%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 70%)' }}
          />
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
