import 'react-big-calendar/lib/css/react-big-calendar.css';
import SideBar from './components/SideBar';
import AppHeader from './components/AppHeader.tsx';
import { Route, Routes } from 'react-router';
import CalendarPage from './page/CalendarPage.tsx';

function App() {
  return (
    <div className="flex h-screen w-screen">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <AppHeader />
        <div className="flex-1 py-8 px-[75px] max-w-full bg-[#F0F0F7] max-h-full overflow-auto">
          <Routes>
            <Route path="*" element={<CalendarPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
