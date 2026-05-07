import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Kanban from './pages/Kanban';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Tasks from'./pages/Tasks';

function App() {
  return (
    <Router>
      <div className="app-layout">
        {/* Lewa kolumna: Stała nawigacja */}
        <Sidebar />
        
        {/* Dynamiczna treść (Środek i Prawa kolumna) */}
        <main className="main-area">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/kanban" element={<Kanban />} />
            {/* Tutaj dojdą kolejne trasy */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;