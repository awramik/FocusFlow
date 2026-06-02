import React from 'react';
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
import { NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';

// Importujemy 5 faz wzrostu Pana Ferdynanda
import ferdynand1 from '../assets/egg.png';
import ferdynand2 from '../assets/baby.png';
import ferdynand3 from '../assets/with_book.png';
import ferdynand4 from '../assets/graduate.png';
import ferdynand5 from '../assets/adult.png';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { currentUser } = useAuth();

  const faza = currentUser?.ferdynand?.stage || 1;
  const currentXP = currentUser?.ferdynand?.currentXP || 0;

  const getUnlockedStage = (xp) => {
    if (xp > 1000) return 5;
    if (xp > 600) return 4;
    if (xp > 300) return 3;
    if (xp > 100) return 2;
    return 1;
  };

  const unlockedStage = getUnlockedStage(currentXP);
  const visibleStage = Math.min(faza, unlockedStage);

  const ferdynandStages = [ferdynand1, ferdynand2, ferdynand3, ferdynand4, ferdynand5];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Po pomyślnym wylogowaniu wracamy na stronę powitalną
    } catch (error) {
      alert("Błąd podczas wylogowywania: " + error.message);
    }
  };

  const handleFerdynandClick = async () => {
    if (!currentUser) return;
    if (faza === unlockedStage) return;
    
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        "ferdynand.stage": unlockedStage
      });
    } catch (error) {
      console.error("Błąd ewolucji Ferdynanda:", error);
    }
  };

  // Sprawdzamy czy użytkownik jest w trybie Focus Mode
  const isFocusMode = location.pathname === '/focus';
  

  return (
    <nav className="left-sidebar">
      
      {/* SEKCJA 1: Logo (Przypięte na stałe do góry, z tłem panelu, żeby menu pod nim znikało) */}
      <div className="sidebar-top">
        <div className="sidebar-logo-container">
          <Link to="/dashboard" className="sidebar-logo-link" style={{ textDecoration: 'none' }}>
            {/* Wyśrodkowanie loga i tekstu bez zmieniania właściwości dzieci (zwiększony gap do 10px) */}
            <div className="sidebar-logo">
              <div className="logo-icon"><Zap size={24} /></div> {/* Zmiana: size z 20 na 24 */}
              <h2
                style={{
                  color: 'var(--text-main)',
                  fontSize: '24px',
                  textDecoration: 'none',
                  margin: 0,
                  display: 'inline-block'
                }}
              >FocusFlow</h2>
            </div>
          </Link>
        </div>
      </div>
        
        <ul className="nav-links" style={{ marginTop: '0px' }}>
          <li>
            <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} end>
              <LayoutDashboard size={20} /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/today" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <CalendarDays size={20} /> Today
            </NavLink>
          </li>
          
          <li className="focus-exempt">
            <NavLink 
              to="/all" 
              onClick={(e) => {
                if (isFocusMode) {
                  e.preventDefault();
                }
              }}
              className={({isActive}) => (isActive || isFocusMode) ? "nav-item active" : "nav-item"}
            >
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
            src={ferdynandStages[visibleStage - 1]}
            alt={`Mr Ferdynand - Phase ${visibleStage}`}
            className="ferdynand-img"
          />
          <div className="ferdynand-badge">
            STAGE {visibleStage}
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
          
          <li className="focus-exempt">
            <NavLink 
              to={isFocusMode ? "/all" : "/focus"} 
              className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
            >
              <Focus size={20} /> {isFocusMode ? "Exit focus mode" : "No distractions"}
            </NavLink>
          </li>

          <li>
            <Link 
              to="#"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }} 
              className="nav-item" 
              style={{ color: '#FFAFD7' }}
            >
              <LogOut size={20} />
              <span style={{ fontWeight: 'bold' }}>Log out</span>
            </Link>
          </li>
        </ul>
      </div>

    </nav>
  );
}
