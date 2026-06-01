import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, CalendarHeart} from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, startOfToday } from 'date-fns';

const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
const PERIODS = ['AM', 'PM'];

function CustomSelect({ value, options, onChange, placeholder }: { value: string, options: string[], onChange: (val: string) => void, placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-20 p-3 rounded-xl border border-slate-200 focus:border-slate-800 bg-white hover:bg-slate-50 transition-all font-light tracking-widest text-center text-lg flex items-center justify-between gap-2"
      >
        <span className={value ? 'text-slate-800' : 'text-slate-400'}>{value || placeholder}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 w-full bg-white border border-slate-100 shadow-xl rounded-xl max-h-48 overflow-y-auto z-50 py-2 custom-scrollbar"
          >
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`px-4 py-2 text-center cursor-pointer transition-colors text-sm tracking-widest font-medium
                  ${value === opt ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                {opt}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DatePickerPage() {
  const navigate = useNavigate();
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const [hour, setHour] = useState('18'); // Default 6 PM but mapped to 12h below
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('PM');
  const [isHourSet, setIsHourSet] = useState(false);
  const [daterName, setDaterName] = useState('ที่รัก');

  useEffect(() => {
    const name = localStorage.getItem('daterName');
    if (name) {
      setDaterName(name);
    }
  }, []);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleNext = () => {
    if (selectedDate && isHourSet) {
      localStorage.setItem('date', format(selectedDate, 'yyyy-MM-dd'));
      
      // Convert 12h to 24h format for saving (HH:mm)
      let h = parseInt(hour, 10);
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      
      const finalTime = `${h.toString().padStart(2, '0')}:${minute}`;
      localStorage.setItem('time', finalTime);
      navigate('/activity');
    }
  };

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth))
  });

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const today = startOfToday();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4 sm:px-6 font-sans">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full text-center"
      >
        <div className="flex justify-center mb-10">
          <CalendarHeart strokeWidth={1} className="w-12 h-12 text-slate-800" />
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-light text-slate-800 mb-4 tracking-wide">
          คุณ{daterName}ว่างวันไหนคั้บ?
        </h2>
        <p className="text-slate-400 mb-10 text-lg font-light tracking-wide">
          เลือกวันและเวลาสำหรับแพลน.
        </p>
        
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 mb-10 text-left">
          
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-medium text-slate-800 tracking-wider uppercase">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 text-slate-400 hover:text-slate-800 transition-colors bg-slate-50 hover:bg-slate-100 rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextMonth} className="p-2 text-slate-400 hover:text-slate-800 transition-colors bg-slate-50 hover:bg-slate-100 rounded-full">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="mb-8">
            <div className="grid grid-cols-7 gap-1 mb-4 text-center">
              {weekDays.map(day => (
                <div key={day} className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {days.map((day, idx) => {
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isPast = isBefore(day, today);
                
                return (
                  <button
                    key={idx}
                    onClick={() => !isPast && setSelectedDate(day)}
                    disabled={isPast}
                    className={`aspect-square flex items-center justify-center rounded-full text-sm transition-all duration-300
                      ${!isCurrentMonth ? 'text-slate-300' : 'text-slate-700'}
                      ${isPast ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:bg-slate-100'}
                      ${isSelected ? 'bg-slate-800 text-white font-medium hover:bg-slate-900 shadow-md' : 'font-light'}
                      ${isToday(day) && !isSelected ? 'border border-slate-300 font-medium' : ''}
                    `}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          </div>
          
          <hr className="border-slate-100 mb-8" />

          {/* Time Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
              <Clock className="w-4 h-4" /> Custom Time
            </label>
            <div className="flex items-center gap-4 justify-center">
              <CustomSelect 
                value={isHourSet ? hour : '--'} 
                options={HOURS} 
                onChange={(val) => { setHour(val); setIsHourSet(true); }} 
                placeholder="--"
              />
              <span className="text-xl font-light text-slate-400">:</span>
              <CustomSelect 
                value={isHourSet ? minute : '--'} 
                options={MINUTES} 
                onChange={(val) => { setMinute(val); setIsHourSet(true); }} 
                placeholder="--"
              />
              <div className="w-4"></div>
              <CustomSelect 
                value={period} 
                options={PERIODS} 
                onChange={(val) => { setPeriod(val); setIsHourSet(true); }} 
              />
            </div>
          </div>
        </div>

        <motion.button
          whileHover={selectedDate && isHourSet ? { scale: 1.02, y: -4, backgroundColor: '#0f172a' } : {}}
          whileTap={selectedDate && isHourSet ? { scale: 0.98 } : {}}
          onClick={handleNext}
          disabled={!selectedDate || !isHourSet}
          className="w-full py-5 rounded-full bg-slate-800 text-white font-medium text-sm tracking-[0.2em] uppercase shadow-2xl shadow-slate-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          Next Step
        </motion.button>
      </motion.div>
    </div>
  );
}
