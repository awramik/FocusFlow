import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Today from './pages/Today';
import AllTasks from './pages/AllTasks';
import Analytics from './pages/Analytics';
import Kanban from './pages/Kanban';
import TaskDetails from './pages/TaskDetails';
import Settings from './pages/Settings';
import FocusMode from './pages/FocusMode';

const initialTasks = [
  { id: '1', title: 'Finish figma project of FocusFlow', priority: 'CRIT', project: 'version 3.1', status: 'To do' },
  { id: '2', title: 'Prepare interactive elements', priority: 'HIGH', project: 'FocusFlow', status: 'To do' },
  { id: '3', title: 'Create a GitHub repository', priority: 'LOW', project: 'FocusFlow', status: 'To do' },
  { id: '4', title: 'Do views in Figma', priority: 'CRIT', project: 'FocusFlow', status: 'Doing' },
  { id: '5', title: 'Implement views using React', priority: 'HIGH', project: 'FocusFlow', status: 'Doing' },
  { id: '6', title: 'Domain Name terminology', priority: 'CRIT', project: 'FocusFlow', status: 'Done' },
  { id: '7', title: 'User needs research', priority: 'HIGH', project: 'FocusFlow', status: 'Done' },
  { id: '8', title: 'Functionalities schema', priority: 'CRIT', project: 'FocusFlow', status: 'Done' },
];

function App() {
  const [tasks, setTasks] = useState(initialTasks);

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

            <Route path="/kanban" element={<Kanban tasks={tasks} setTasks={setTasks} />} />
            <Route path="/kanban/:id" element={<TaskDetails tasks={tasks} />} />
            
            <Route path="/settings" element={<Settings />} />
            <Route path="/focus" element={<FocusMode />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;