import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, CalendarDays, CheckCircle2, Heart } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { FOOD_OPTIONS } from './FoodPicker';
import { ACTIVITY_OPTIONS } from './ActivityPicker';

export default function Ticket() {
  const ticketRef = useRef<HTMLDivElement>(null);
  
  const [dateStr, setDateStr] = useState<string>('');
  const [timeStr, setTimeStr] = useState<string>('');
  const [foodChoices, setFoodChoices] = useState<string[]>([]);
  const [activityChoices, setActivityChoices] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [daterName, setDaterName] = useState('My Special Someone');

  useEffect(() => {
    // Generate random ticket ID once on mount
    setTicketId(Math.random().toString(36).substring(2, 8).toUpperCase());

    const d = localStorage.getItem('date');
    const t = localStorage.getItem('time');
    const f = localStorage.getItem('food');
    const a = localStorage.getItem('activities');
    const name = localStorage.getItem('daterName');
    
    if (d) setDateStr(d);
    if (t) setTimeStr(t);
    if (name) setDaterName(name);
    if (f) {
      try {
        setFoodChoices(JSON.parse(f));
      } catch (e) {
        console.error(e);
      }
    }
    if (a) {
      try {
        setActivityChoices(JSON.parse(a));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const downloadPDF = async () => {
    if (!ticketRef.current) return;
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Date_Ticket_${ticketId}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateGoogleCalendarLink = () => {
    if (!dateStr || !timeStr) return '#';
    
    try {
      const startDateTime = new Date(`${dateStr}T${timeStr}`);
      const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);
      
      const formatString = "yyyyMMdd'T'HHmmss";
      const start = format(startDateTime, formatString);
      const end = format(endDateTime, formatString);
      
      const foods = foodChoices.map(id => {
        const food = FOOD_OPTIONS.find(f => f.id === id || f.name === id);
        return food ? food.name : id;
      }).join(', ');
      const acts = activityChoices.map(id => {
        const act = ACTIVITY_OPTIONS.find(a => a.id === id || a.name === id);
        return act ? act.name : id;
      }).join(', ');
      const title = encodeURIComponent('Our Date');
      const details = encodeURIComponent(`Activities: ${acts}\nFood choices: ${foods}\n\nCan't wait to see you!`);
      
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
    } catch (e) {
      return '#';
    }
  };

  const formattedDate = dateStr ? format(parseISO(dateStr), 'MMMM do, yyyy') : 'TBD';
  const formattedTime = timeStr ? timeStr : 'TBD';

  return (
    <div className="min-h-screen flex flex-col items-center py-20 px-6 overflow-hidden font-sans">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-16"
      >
        <div className="flex justify-center mb-8">
          <CheckCircle2 strokeWidth={1} className="w-12 h-12 text-slate-800" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-light text-slate-800 mb-4 tracking-[0.1em] uppercase">
          It's a Date
        </h2>
        <p className="text-slate-400 font-light tracking-wide text-lg">
          Your official boarding pass is ready.
        </p>
      </motion.div>

      {/* Ticket Container */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="w-full max-w-3xl relative mb-16"
      >
        <div 
          ref={ticketRef}
          className="relative bg-white border border-slate-200 rounded-lg flex flex-col sm:flex-row overflow-hidden"
          style={{ filter: "drop-shadow(0 25px 25px rgba(0,0,0,0.03))" }}
        >
          {/* Main Ticket Body */}
          <div className="flex-grow p-10 sm:p-14 relative border-r border-dashed border-slate-200">
            <div className="flex justify-between items-start mb-10">
              <div>
                <p className="text-xs font-semibold text-slate-400 tracking-[0.3em] uppercase mb-2">Admit Two</p>
                <h3 className="text-4xl font-light text-slate-800 tracking-wider uppercase mb-1">VIP TICKET</h3>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">{daterName}</p>
              </div>
              <div className="text-right">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                  <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                  <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
                  <rect x="7" y="7" width="10" height="10"></rect>
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 mb-12">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-2">Date</p>
                <p className="text-lg font-medium text-slate-800 tracking-wide">{formattedDate}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-2">Time</p>
                <p className="text-lg font-medium text-slate-800 tracking-wide">{formattedTime}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-4">Activities</p>
              <div className="flex flex-wrap gap-3">
                {activityChoices.map(id => {
                  const act = ACTIVITY_OPTIONS.find(a => a.id === id || a.name === id);
                  const Icon = act ? act.icon : Heart;
                  const name = act ? act.name : id;
                  return (
                    <span key={id} className="bg-slate-50 px-4 py-2 rounded-full text-xs font-medium tracking-widest uppercase text-slate-600 border border-slate-200 flex items-center gap-2">
                      <Icon strokeWidth={1.5} className="w-4 h-4 text-slate-500" /> {name}
                    </span>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-4">Menu Setup</p>
              <div className="flex flex-wrap gap-3">
                {foodChoices.map(id => {
                  const food = FOOD_OPTIONS.find(f => f.id === id || f.name === id);
                  if (!food) return null;
                  const Icon = food.icon;
                  return (
                    <span key={id} className="bg-slate-50 px-4 py-2 rounded-full text-xs font-medium tracking-widest uppercase text-slate-600 border border-slate-200 flex items-center gap-2">
                      <Icon strokeWidth={1.5} className="w-4 h-4 text-slate-500" /> {food.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Ticket Stub */}
          <div className="bg-slate-50 p-10 sm:w-48 flex flex-col justify-center items-center text-center relative">
             <div className="text-center w-full transform sm:-rotate-90 sm:translate-y-0 translate-y-4 whitespace-nowrap">
               <p className="text-slate-800 font-light text-2xl tracking-[0.3em] uppercase mb-4">LOVE</p>
               <p className="text-slate-500 text-xs font-mono tracking-widest border border-slate-200 bg-white px-3 py-1 rounded">#{ticketId}</p>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-6 w-full max-w-xl"
      >
        <button
          onClick={downloadPDF}
          disabled={isGenerating}
          className="flex-1 py-5 px-6 rounded-full bg-slate-800 text-white font-medium text-xs tracking-[0.2em] uppercase shadow-xl shadow-slate-200 hover:bg-slate-900 transition-all flex justify-center items-center gap-3 disabled:opacity-30"
        >
          <Download strokeWidth={1.5} className="w-4 h-4" />
          {isGenerating ? 'Generating...' : 'Save PDF'}
        </button>

        <a
          href={generateGoogleCalendarLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-5 px-6 rounded-full bg-white text-slate-600 border border-slate-200 font-medium text-xs tracking-[0.2em] uppercase hover:bg-slate-50 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100 transition-all flex justify-center items-center gap-3"
        >
          <CalendarDays strokeWidth={1.5} className="w-4 h-4" />
          Add to Calendar
        </a>
      </motion.div>
    </div>
  );
}
