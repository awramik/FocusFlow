import { LayoutDashboard, CalendarDays, BarChart3, Kanban, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <nav className="left-sidebar">
      <div className="logo">Focus Flow</div>
      
      <ul className="nav-links">
        <li><Link to="/"><LayoutDashboard size={20}/> Dashboard</Link></li>
        <li><Link to="/today"><CalendarDays size={20}/> Today</Link></li>
        <li><Link to="/all"><LayoutDashboard size={20}/> All tasks</Link></li>
        <li><Link to="/analytics"><BarChart3 size={20}/> Analytics</Link></li>
        
        <li><Link to="/kanban"><Kanban size={20}/> Kanban</Link></li>
        
        <li><Link to="/settings"><Settings size={20}/> Settings</Link></li>
      </ul>
    </nav>
  );
}