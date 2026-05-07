import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Today from './pages/Today';
import AllTasks from './pages/AllTasks';
import Analytics from './pages/Analytics';
import Kanban from './pages/Kanban';
import Settings from './pages/Settings';
import FocusMode from './pages/FocusMode';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <main className="main-area">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/today" element={<Today />} />
            <Route path="/all" element={<AllTasks />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/kanban" element={<Kanban />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/focus" element={<FocusMode />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;