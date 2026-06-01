import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film, Coffee, Footprints, Library, ShoppingBag, Gamepad2, Plus, X } from 'lucide-react';

export const ACTIVITY_OPTIONS = [
  { id: 'movie', name: 'ดูหนัง', icon: Film },
  { id: 'cafe', name: 'คาเฟ่', icon: Coffee },
  { id: 'walk', name: 'เดินเล่น', icon: Footprints },
  { id: 'museum', name: 'พิพิธภัณฑ์', icon: Library },
  { id: 'shopping', name: 'ช้อปปิ้ง', icon: ShoppingBag },
  { id: 'arcade', name: 'เล่นเกม', icon: Gamepad2 },
];

export default function ActivityPicker() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [customActivity, setCustomActivity] = useState('');

  const toggleActivity = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(item => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const addCustomActivity = () => {
    const trimmed = customActivity.trim();
    if (trimmed && !selected.includes(trimmed)) {
      setSelected([...selected, trimmed]);
      setCustomActivity('');
    }
  };

  const removeActivity = (id: string) => {
    setSelected(selected.filter(item => item !== id));
  };

  const handleNext = () => {
    let finalSelected = [...selected];
    const trimmed = customActivity.trim();
    if (trimmed && !selected.includes(trimmed)) {
      finalSelected.push(trimmed);
    }
    
    if (finalSelected.length > 0) {
      localStorage.setItem('activities', JSON.stringify(finalSelected));
      navigate('/food');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-20 px-6 font-sans">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl w-full text-center flex flex-col items-center"
      >
        <h2 className="text-3xl sm:text-4xl font-light text-slate-800 mb-4 tracking-wide">
          เราจาไปทำอะไรกันดีคั้บ?
        </h2>
        <p className="text-slate-400 mb-12 text-lg font-light tracking-wide">
          Select our date activities or add your own.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 w-full mb-10">
          {ACTIVITY_OPTIONS.map((activity) => {
            const isSelected = selected.includes(activity.id) || selected.includes(activity.name);
            const Icon = activity.icon;
            
            return (
              <motion.button
                key={activity.id}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleActivity(activity.name)}
                className={`group py-10 px-6 rounded-2xl border flex flex-col items-center justify-center gap-5 transition-all duration-300 ease-out
                  ${
                  isSelected 
                    ? 'border-slate-800 bg-slate-800 text-white shadow-xl shadow-slate-200/50' 
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100/50'
                } cursor-pointer`}
              >
                <Icon 
                  strokeWidth={1.25} 
                  className={`w-10 h-10 transition-colors duration-300 ${isSelected ? 'text-white' : 'text-slate-600 group-hover:text-slate-900'}`} 
                />
                <span className={`text-sm tracking-[0.2em] uppercase font-semibold transition-colors duration-300 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`}>
                  {activity.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Custom Activity Input */}
        <div className="w-full max-w-md mb-12">
          <label className="block text-xs font-semibold text-slate-400 mb-4 uppercase tracking-[0.2em] text-left">
            Other Ideas?
          </label>
          <div className="flex gap-3">
            <input 
              type="text"
              value={customActivity}
              onChange={(e) => setCustomActivity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomActivity()}
              placeholder="Type your idea here..."
              className="flex-grow p-4 rounded-xl border border-slate-200 focus:border-slate-800 bg-white hover:bg-slate-50 transition-all font-light outline-none"
            />
            <button 
              onClick={addCustomActivity}
              disabled={!customActivity.trim()}
              className="px-6 py-4 rounded-xl bg-slate-100 text-slate-600 font-semibold border border-slate-200 hover:bg-slate-200 transition-all disabled:opacity-50 flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {/* Selected Custom Activities Tags */}
          {selected.filter(item => !ACTIVITY_OPTIONS.find(opt => opt.name === item)).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selected.filter(item => !ACTIVITY_OPTIONS.find(opt => opt.name === item)).map(item => (
                <div key={item} className="bg-slate-800 text-white px-4 py-2 rounded-full text-xs tracking-widest font-medium uppercase flex items-center gap-2 shadow-md">
                  {item}
                  <button onClick={() => removeActivity(item)} className="hover:text-red-300 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <motion.button
          whileHover={selected.length > 0 ? { scale: 1.02, backgroundColor: '#0f172a' } : {}}
          whileTap={selected.length > 0 ? { scale: 0.98 } : {}}
          onClick={handleNext}
          disabled={selected.length === 0}
          className="w-full max-w-sm mx-auto py-5 rounded-full bg-slate-800 text-white font-medium text-sm tracking-[0.2em] uppercase shadow-2xl shadow-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all block"
        >
          Confirm Activities
        </motion.button>
      </motion.div>
    </div>
  );
}
