import { 
  Zap, 
  LayoutDashboard, 
  CalendarDays, 
  ListTodo, 
  BarChart2, 
  Kanban, 
  Settings, 
  Focus 
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <nav className="left-sidebar">
      
      {/* SEKCJA 1: Logo i główne linki */}
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <div className="logo-icon"><Zap size={20} /></div>
          <h2>FocusFlow</h2>
        </div>
        
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} end>
              <LayoutDashboard size={20} /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/today" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <CalendarDays size={20} /> Today
            </NavLink>
          </li>
          <li>
            <NavLink to="/all" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <ListTodo size={20} /> All tasks
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <BarChart2 size={20} /> Analytics
            </NavLink>
          </li>
          <li>
            <NavLink to="/kanban" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Kanban size={20} /> Kanban
            </NavLink>
          </li>
        </ul>
      </div>

      {/* SEKCJA 2: Miejsce na Ferdynanda */}
      <div className="sidebar-middle">
        <div className="bubble-placeholder">
          <span className="bubble-text">PAN FERDYNAND</span>
        </div>
      </div>

      {/* SEKCJA 3: Linki na samym dole */}
      <div className="sidebar-bottom">
        <ul className="nav-links">
          <li>
            <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Settings size={20} /> Settings
            </NavLink>
          </li>
          <li>
            <NavLink to="/focus" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Focus size={20} /> No distractions
            </NavLink>
          </li>
        </ul>
      </div>

    </nav>
  );
}