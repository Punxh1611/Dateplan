import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// เปลี่ยนลิงก์รูปล่างนี้สำหรับรูปหน้าแรกสุด (หน้ากรอกชื่อ)
const WELCOME_GIF_URL = "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDRvamcyY3JkZGplMXA5MnlmdTVqenZnYzVkZ3E1eWtidDU0eWhicyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BF1nQAYQyWzupGd8KG/giphy.gif"; // หารูปน่ารักๆ จากในเน็ตมาเปลี่ยนได้เลย

export default function NameEntry() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (name.trim()) {
      localStorage.setItem('daterName', name.trim());
      navigate('/invite');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-20 px-6 overflow-hidden font-sans">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full text-center flex flex-col items-center relative"
      >
        <div className="mb-8 flex justify-center w-full">
          {WELCOME_GIF_URL ? (
            <img 
              src={WELCOME_GIF_URL} 
              alt="Welcome bear" 
              className="w-40 h-40 object-cover rounded-2xl shadow-sm"
            />
          ) : (
            <div className="w-40 h-40 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-sm border border-dashed border-slate-300">
              Your GIF here
            </div>
          )}
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-light text-slate-800 mb-4 tracking-wide leading-tight">
          Welcome
        </h1>
        <p className="text-slate-400 font-light tracking-wide mb-12">
          ใส่ชื่อของคุณเพื่อดำเนินการต่อ.
        </p>

        <div className="w-full mb-10">
          <input 
            type="text" 
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            className="w-full p-5 rounded-2xl border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none text-slate-700 bg-white transition-all font-light tracking-wide text-center text-lg shadow-sm"
          />
        </div>

        <motion.button
          whileHover={name.trim() ? { scale: 1.02, y: -4, backgroundColor: '#0f172a' } : {}}
          whileTap={name.trim() ? { scale: 0.98 } : {}}
          onClick={handleNext}
          disabled={!name.trim()}
          className="w-full py-5 rounded-full bg-slate-800 text-white font-medium text-sm tracking-[0.2em] uppercase shadow-xl shadow-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          Continue
        </motion.button>
      </motion.div>
    </div>
  );
}
