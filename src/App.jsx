import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider } from './context/AuthContext';

import AnalyticsTracker from './components/AnalyticsTracker';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Today from './pages/Today';
import AllTasks from './pages/AllTasks';
import Analytics from './pages/Analytics';
import Kanban from './pages/Kanban';
import TaskDetails from './pages/TaskDetails';
import Settings from './pages/Settings';
import FocusMode from './pages/FocusMode';
import Calendar from './pages/Calendar';
import Auth from './pages/Auth';

import './style/index.css';
import './style/kanban.css';

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Router>
          <AnalyticsTracker />
          <Routes>
            {/* Strona logowania */}
            <Route path="/" element={<Auth />} />

            {/* Wszystkie inne strony */}
            <Route path="/*" element={
              <div className="app-layout">
                <Sidebar />
                <main className="main-area">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/today" element={<Today />} />
                    <Route path="/all" element={<AllTasks />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/kanban" element={<Kanban />} />
                    <Route path="/kanban/:id" element={<TaskDetails />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/focus" element={<FocusMode />} />
                    <Route path="/calendar" element={<Calendar />} />
                  </Routes>
                </main>
              </div>
            } />
          </Routes>
        </Router>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
