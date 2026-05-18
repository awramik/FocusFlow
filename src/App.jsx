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

import { tasksData } from './data/mockData';
function App() {
  const [tasks, setTasks] = useState(() => {
    return tasksData.map(task => {
      let mappedStatus = 'To do';
      if (task.status === 'doing') mappedStatus = 'Doing';
      if (task.status === 'done') mappedStatus = 'Done';

      let mappedPriority = 'LOW';
      if (task.priority === 'critical') mappedPriority = 'CRIT';
      if (task.priority === 'high') mappedPriority = 'HIGH';

      return {
        id: task.id.toString(),
        title: task.title,
        status: mappedStatus,
        priority: mappedPriority,
        project: task.category || 'FocusFlow'
      };
    });
  });

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