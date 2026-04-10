import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User, Quote, Search, MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Stories() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const stories = [
    {
      name: "Mark D.",
      role: "Architecture Student, UST",
      problem: "Between studio deadlines and exams, I literally had no time to do laundry. My room was piling up with clothes, and I was running out of clean uniforms.",
      solution: "I downloaded the LabaLink app and scheduled a pick-up. They collected my laundry right from my dorm lobby.",
      outcome: "Next day, everything was returned perfectly folded and smelling fresh. It saved me hours of waiting at a traditional laundromat. Now I use it every week.",
      image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=1000&auto=format&fit=crop"
    },
    {
      name: "Sarah V.",
      role: "Marketing Manager",
      problem: "My job requires me to wear formal attire, but finding a reliable dry cleaner that fits my schedule was impossible. I'd always rush before closing time.",
      solution: "LabaLink's app lets me track my dry cleaning in real-time. I know exactly when it's being washed, pressed, and ready for delivery.",
      outcome: "The quality is impeccable. My blazers look brand new, and paying via GCash makes the whole process completely frictionless.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
    },
    {
      name: "The Reyes Family",
      role: "Residents, Sampaloc",
      problem: "With two toddlers, our laundry machine broke down. Washing bedding and curtains manually was out of the question, and hauling it to a shop was exhausting.",
      solution: "We tried LabaLink's Bedding & Curtain cleaning service. The team was professional, picked up the heavy bags, and handled everything.",
      outcome: "The comforters came back so soft and sanitized. Plus, we earned enough loyalty points for a free wash on our next order. It's a lifesaver for families.",
      image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a1128] text-white relative overflow-hidden flex flex-col">
      {/* Spotlight Background */}
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />
      
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
          <Link to="/about" className="hover:text-slate-300 transition-colors">Our World</Link>
          <Link to="/stories" className="text-indigo-400 transition-colors">Stories</Link>
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
            REAL STORIES, <br />
            <span className="font-serif italic text-indigo-400">REAL CONVENIENCE</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Don't just take our word for it. See how LabaLink is transforming the daily routines of students, professionals, and families in our community.
          </p>
        </motion.div>

        <div className="space-y-24">
          {stories.map((story, index) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}
            >
              <div className="w-full md:w-1/2">
                <div className="relative h-[400px] rounded-3xl overflow-hidden border border-white/10">
                  <img 
                    src={story.image} 
                    alt={story.name} 
                    className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/2 space-y-6">
                <Quote className="w-12 h-12 text-indigo-500/30" />
                
                <div>
                  <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">The Problem</h3>
                  <p className="text-slate-300 text-lg italic">"{story.problem}"</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">The Solution</h3>
                  <p className="text-slate-300 text-lg">"{story.solution}"</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">The Outcome</h3>
                  <p className="text-white text-xl font-serif">"{story.outcome}"</p>
                </div>
                
                <div className="pt-6 border-t border-white/10">
                  <p className="font-bold text-white">{story.name}</p>
                  <p className="text-sm text-slate-400">{story.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 text-center"
        >
          <h2 className="text-3xl font-serif mb-8">Ready to write your own story?</h2>
          <Link 
            to="/login"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#0a1128] text-sm font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors rounded-full"
          >
            Experience LabaLink
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
