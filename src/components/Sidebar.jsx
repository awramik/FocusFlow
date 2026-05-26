import React, { useState } from 'react';
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

// Importujemy 5 faz wzrostu Pana Ferdynanda
import ferdynand1 from '../assets/egg.png';
import ferdynand2 from '../assets/baby.png';
import ferdynand3 from '../assets/with_book.png';
import ferdynand4 from '../assets/graduate.png';
import ferdynand5 from '../assets/adult.png';

export default function Sidebar() {

// Stan przechowujący aktualną fazę (od 1 do 5)
  const [faza, setFaza] = useState(1);

  // Tablica z zaimportowanymi obrazkami dla łatwiejszego mapowania
  const ferdynandStages = [ferdynand1, ferdynand2, ferdynand3, ferdynand4, ferdynand5];

  // Funkcja zmieniająca fazę po kliknięciu
  const handleFerdynandClick = () => {
    setFaza((prevFaza) => {
      if (prevFaza === 5) return 1;
      return prevFaza + 1;
    });
  };

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
            <NavLink to="/kanban" end className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Kanban size={20} /> Kanban
            </NavLink>
          </li>
        </ul>
      </div>

      {/* SEKCJA 2: Pan Ferdynand */}
      <div className="sidebar-middle">
        <div 
          className="ferdynand-container" 
          onClick={handleFerdynandClick}
          title="Click to evolve Ferdinand!"
        >
          <img 
            src={ferdynandStages[faza - 1]} 
            alt={`Mr Ferdynand - Phase ${faza}`} 
            className="ferdynand-img"
          />
          <div className="ferdynand-badge">
            STAGE {faza}
          </div>
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