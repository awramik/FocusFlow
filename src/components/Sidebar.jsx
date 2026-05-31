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
import { NavLink, Link } from 'react-router-dom';

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
    <nav className="left-sidebar" style={{ height: '100vh', overflowY: 'auto', position: 'relative', backgroundColor: '#250f3d' }}>
      
      {/* Scrollbar przypisany do całego panelu, stały kolor #502d73 przy samej krawędzi */}
      <style>{`
        .left-sidebar::-webkit-scrollbar {
          width: 8px;
        }
        .left-sidebar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .left-sidebar::-webkit-scrollbar-thumb {
          background: #502d73; 
          border-radius: 10px;
        }
        .left-sidebar::-webkit-scrollbar-thumb:hover {
          background: #502d73; 
        }
      `}</style>
      
      {/* SEKCJA 1: Logo (Przypięte na stałe do góry, z tłem panelu, żeby menu pod nim znikało) */}
      <div 
        className="sidebar-top" 
        style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 10, 
          backgroundColor: '#250f3d', 
          paddingBottom: '4px' // Zmiana: zmniejszono padding z 10px na 4px, aby menu podeszło bliżej kreski naturalnie
        }}
      >
        <div className="sidebar-logo-container">
          <Link to="/" className="sidebar-logo-link" style={{ textDecoration: 'none' }}>
            {/* Wyśrodkowanie loga i tekstu bez zmieniania właściwości dzieci (zwiększony gap do 10px) */}
            <div className="sidebar-logo" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              <div className="logo-icon"><Zap size={24} /></div> {/* Zmiana: size z 20 na 24 */}
              <h2 style={{ color: '#ffffff', fontSize: '24px', textDecoration: 'none', margin: 0, display: 'inline-block' }}>FocusFlow</h2> {/* Zmiana: fontSize z 20px na 24px */}
            </div>
          </Link>
        </div>
      </div>

      {/* Reszta zawartości, która przewija się wewnątrz tego samego panelu */}
      {/* ZMIANA: Usunięto ujemny margines, wyzerowano margin-top listy ul dla naturalnego podciągnięcia */}
      <ul className="nav-links" style={{ marginTop: '0px' }}>
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

      {/* SEKCJA 2: Pan Ferdynand */}
      <div className="sidebar-middle" style={{ margin: '30px 0' }}>
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