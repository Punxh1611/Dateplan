import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NameEntry from './pages/NameEntry';
import YesNo from './pages/YesNo';
import DatePickerPage from './pages/DatePickerPage';
import ActivityPicker from './pages/ActivityPicker';
import FoodPicker from './pages/FoodPicker';
import Ticket from './pages/Ticket';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NameEntry />} />
        <Route path="/invite" element={<YesNo />} />
        <Route path="/date" element={<DatePickerPage />} />
        <Route path="/activity" element={<ActivityPicker />} />
        <Route path="/food" element={<FoodPicker />} />
        <Route path="/ticket" element={<Ticket />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
