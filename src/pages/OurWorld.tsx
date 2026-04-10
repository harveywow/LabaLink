import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User, Leaf, Smartphone, Heart, Search, MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OurWorld() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a1128] text-white relative overflow-hidden flex flex-col">
      {/* Spotlight Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none" />
      
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
          <Link to="/services" className="hover:text-slate-300 transition-colors">Services</Link>
          <Link to="/about" className="text-teal-400 transition-colors">Our World</Link>
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
        
        {/* Intro Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl font-light leading-tight tracking-wide mb-6">
              REDEFINING <br />
              <span className="font-serif italic text-teal-400">URBAN LAUNDRY</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Born in the heart of Sampaloc, Manila, LabaLink was created to solve a modern urban problem: the lack of time. For busy students at UST, FEU, and CEU, young professionals, and growing families, laundry is a chore that takes away precious hours.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed">
              We combined premium garment care with seamless technology to give you back your time. Clean clothes, smarter lives.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative h-[500px] rounded-3xl overflow-hidden"
          >
            <img 
              src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=2070&auto=format&fit=crop" 
              alt="Modern Laundry" 
              className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128] via-transparent to-transparent" />
          </motion.div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#0f172a]/50 border border-white/10 p-12 rounded-3xl"
          >
            <h3 className="text-2xl font-serif mb-4 text-teal-400">Our Mission</h3>
            <p className="text-slate-300 leading-relaxed">
              To provide a seamless, tech-enabled laundry experience that prioritizes quality, convenience, and sustainability, allowing our customers to focus on what truly matters to them.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#0f172a]/50 border border-white/10 p-12 rounded-3xl"
          >
            <h3 className="text-2xl font-serif mb-4 text-teal-400">Our Vision</h3>
            <p className="text-slate-300 leading-relaxed">
              To be the leading smart laundry network in Metro Manila, setting the standard for digital convenience and eco-responsible garment care in urban communities.
            </p>
          </motion.div>
        </div>

        {/* What Makes Us Different */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-light mb-4">The LabaLink Difference</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">More than just a laundromat. We are a technology company dedicated to garment care.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-center p-8"
          >
            <div className="w-16 h-16 mx-auto bg-teal-500/10 rounded-full flex items-center justify-center mb-6 text-teal-400">
              <Smartphone className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h4 className="text-xl font-serif mb-3">Tech Integration</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Real-time order tracking, digital payments via GCash/Maya, and easy scheduling right from your smartphone.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center p-8"
          >
            <div className="w-16 h-16 mx-auto bg-teal-500/10 rounded-full flex items-center justify-center mb-6 text-teal-400">
              <Heart className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h4 className="text-xl font-serif mb-3">Customer First</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Reliable service, transparent pricing, and a loyalty rewards program designed to give back to our community.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center p-8"
          >
            <div className="w-16 h-16 mx-auto bg-teal-500/10 rounded-full flex items-center justify-center mb-6 text-teal-400">
              <Leaf className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h4 className="text-xl font-serif mb-3">Eco-Responsible</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              We use high-efficiency machines and eco-friendly detergents to minimize our environmental footprint.
            </p>
          </motion.div>
        </div>

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
