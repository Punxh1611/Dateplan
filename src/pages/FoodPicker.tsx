import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Soup, UtensilsCrossed, Beef, Fish, Pizza, Coffee, IceCream, Cake, Sandwich } from 'lucide-react';

export const FOOD_OPTIONS = [
  { id: 'ramen', name: 'Ramen', icon: Soup },
  { id: 'shabu', name: 'Shabu', icon: UtensilsCrossed },
  { id: 'steak', name: 'Steak', icon: Beef },
  { id: 'sushi', name: 'Sushi', icon: Fish },
  { id: 'pizza', name: 'Pizza', icon: Pizza },
  { id: 'boba', name: 'Boba Tea', icon: Coffee },
  { id: 'icecream', name: 'Ice Cream', icon: IceCream },
  { id: 'dessert', name: 'Dessert', icon: Cake },
  { id: 'burger', name: 'Burger', icon: Sandwich },
];

export default function FoodPicker() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [daterName, setDaterName] = useState('ที่รัก');

  useEffect(() => {
    const name = localStorage.getItem('daterName');
    if (name) {
      setDaterName(name);
    }
  }, []);

  const toggleFood = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(item => item !== id));
    } else {
      if (selected.length < 3) {
        setSelected([...selected, id]);
      }
    }
  };

  const handleNext = () => {
    if (selected.length > 0) {
      localStorage.setItem('food', JSON.stringify(selected));
      navigate('/ticket');
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
          คุณ{daterName}อยากกินอารายคั้บ?
        </h2>
        <p className="text-slate-400 mb-16 text-lg font-light tracking-wide">
          เลือก 3 อย่างที่อยากทานในเดท.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-20 w-full">
          {FOOD_OPTIONS.map((food) => {
            const isSelected = selected.includes(food.id);
            const isDisabled = selected.length >= 3 && !isSelected;
            const Icon = food.icon;
            
            return (
              <motion.button
                key={food.id}
                whileHover={!isDisabled ? { scale: 1.02, y: -4 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
                onClick={() => toggleFood(food.id)}
                disabled={isDisabled}
                className={`group py-12 px-6 rounded-2xl border flex flex-col items-center justify-center gap-6 transition-all duration-300 ease-out
                  ${
                  isSelected 
                    ? 'border-slate-800 bg-slate-800 text-white shadow-xl shadow-slate-200/50' 
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100/50'
                } ${isDisabled ? 'opacity-30 cursor-not-allowed grayscale' : 'cursor-pointer'}`}
              >
                <Icon 
                  strokeWidth={1.25} 
                  className={`w-10 h-10 transition-colors duration-300 ${isSelected ? 'text-white' : 'text-slate-600 group-hover:text-slate-900'}`} 
                />
                <span className={`text-sm tracking-[0.2em] uppercase font-semibold transition-colors duration-300 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`}>
                  {food.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          whileHover={selected.length > 0 ? { scale: 1.02, backgroundColor: '#0f172a' } : {}}
          whileTap={selected.length > 0 ? { scale: 0.98 } : {}}
          onClick={handleNext}
          disabled={selected.length === 0}
          className="w-full max-w-sm mx-auto py-5 rounded-full bg-slate-800 text-white font-medium text-sm tracking-[0.2em] uppercase shadow-2xl shadow-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all block"
        >
          Confirm Selection
        </motion.button>
      </motion.div>
    </div>
  );
}
