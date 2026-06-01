import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// เปลี่ยนลิงก์รูปล่างนี้สำหรับรูปหน้าหลัก (หน้าคำถาม)
const MAIN_GIF_URL = "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2l4amlzN3RtNDFyM2l5aHd4cDVrcTFqZTNhODluN3BwOXM2NGFqZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ITacRy2zH4vMQ/giphy.gif"; // หารูปน่ารักๆ จากในเน็ตมาเปลี่ยนได้เลย

// เปลี่ยนลิงก์รูปล่างนี้สำหรับรูปตอนตอบตกลง (Popup เย้!)
const POPUP_GIF_URL = "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGdjejc4amtqaXZyY2drcWIxZjRwdDExYmt0dXV5cTFhMHI3dWwzcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/uYV7xN7U8EbXa/giphy.gif";

export default function YesNo() {
  const navigate = useNavigate();
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [isMoved, setIsMoved] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [daterName, setDaterName] = useState('ที่รัก');

  useEffect(() => {
    const name = localStorage.getItem('daterName');
    if (name) {
      setDaterName(name);
    }
  }, []);

  const handleNoHover = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current.getBoundingClientRect();
    const btnWidth = 120;
    const btnHeight = 60;
    
    const maxX = container.width - btnWidth - 40;
    const maxY = container.height - btnHeight - 40;
    
    const randomX = Math.max(0, Math.floor(Math.random() * maxX) - (maxX / 2));
    const randomY = Math.max(0, Math.floor(Math.random() * maxY) - (maxY / 2));
    
    setNoPosition({ x: randomX, y: randomY });
    setIsMoved(true);
  };

  const handleYes = () => {
    setShowPopup(true);
  };

  const handleContinue = () => {
    navigate(`/date`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-20 px-6 overflow-hidden font-sans" ref={containerRef}>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl w-full text-center flex flex-col items-center relative"
      >
        <div className="mb-8 flex justify-center w-full">
          {MAIN_GIF_URL ? (
            <img 
              src={MAIN_GIF_URL} 
              alt="Cute bear" 
              className="w-48 h-48 object-cover rounded-2xl shadow-sm"
            />
          ) : (
            <div className="w-48 h-48 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-sm border border-dashed border-slate-300">
              Your GIF here
            </div>
          )}
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-light text-slate-800 mb-20 tracking-wide leading-tight">
          คุณจาไปเดทกะผมม้ายคั้บ?
        </h1>

        <div className="flex gap-8 relative w-full justify-center h-20 items-center">
          <motion.button
            whileHover={{ scale: 1.05, y: -4, backgroundColor: '#0f172a' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleYes}
            className="px-10 py-4 rounded-full bg-slate-800 text-white font-medium text-sm tracking-[0.2em] uppercase shadow-xl shadow-slate-300 z-10 w-36 transition-colors"
          >
            Yes
          </motion.button>
          
          <motion.button
            animate={isMoved ? { x: noPosition.x, y: noPosition.y } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onMouseEnter={handleNoHover}
            onClick={handleNoHover}
            className={`px-10 py-4 rounded-full bg-white border border-slate-200 text-slate-500 font-medium text-sm tracking-[0.2em] uppercase shadow-sm z-10 w-36 ${isMoved ? 'absolute' : 'relative'}`}
          >
            No
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showPopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl flex flex-col items-center"
            >
              <img 
                src={POPUP_GIF_URL} 
                alt="Happy bear" 
                className="w-48 h-48 object-cover rounded-2xl mb-8"
              />
              <h2 className="text-3xl font-light text-slate-800 mb-2 tracking-[0.1em] uppercase">เย้!!!</h2>
              <p className="text-slate-500 font-light tracking-wide mb-10">ม๋าจิ๋วรู้อยู่แล้วว่า{daterName}ต้องตกลง</p>
              
              <motion.button
                whileHover={{ scale: 1.02, y: -2, backgroundColor: '#0f172a' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                className="w-full py-4 rounded-full bg-slate-800 text-white font-medium text-xs tracking-[0.2em] uppercase shadow-xl shadow-slate-200 transition-all flex justify-center items-center gap-2"
              >
                Let's Plan It <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
