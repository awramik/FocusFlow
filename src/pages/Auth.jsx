import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import '../style/Auth.css';

export default function Auth() {
  const [regData, setRegData] = useState({ email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  
  // NOWOŚĆ: Stan kontrolujący, który formularz wyświetlić (domyślnie logowanie)
  const [isLogin, setIsLogin] = useState(true); 
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, regData.email, regData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: regData.email,
        firstName: regData.email.split('@')[0],
        lastName: "",
        title: "New User",
        plan: "Free Tier",
        avatarInitials: regData.email.substring(0, 2).toUpperCase(),
        ferdynand: { stage: 1, currentXP: 0 },
        settings: { deepWork: true, timerDuration: 25, breakInterval: 5 },
        stats: {
          focusTimeSeconds: 0,
          workHoursCurrent: 0,
          workHoursGoal: 6,
          focusedHoursCurrent: 0,
          focusedHoursGoal: 2
        }
      });

      alert("Konto utworzone i profil w bazie gotowy!");
      navigate('/dashboard'); 
    } catch (err) { 
      alert(err.message); 
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      navigate('/dashboard');
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="auth-page">
      <div className="auth-logo">
        <Zap size={40} color="#FFAFD7" />
        <h1>FocusFlow</h1>
      </div>

      <p className="auth-hero-text">Unlock your peak productivity.</p>

      <div className="auth-container">
        {/* WARUNKOWE RENDEROWANIE FORMULARZA */}
        {isLogin ? (
          <form className="auth-card" onSubmit={handleLogin}>
            <h2>Log in</h2>
            <input 
              type="email" 
              placeholder="e-mail:" 
              onChange={(e) => setLoginData({...loginData, email: e.target.value})} 
            />
            <input 
              type="password" 
              placeholder="password:" 
              onChange={(e) => setLoginData({...loginData, password: e.target.value})} 
            />
            <button type="submit">log in</button>
            
            {/* PRZYCISK ZMIANY TRYBU */}
            <p className="auth-toggle-text">
              Don't have an account? <span onClick={() => setIsLogin(false)}>Sign up</span>
            </p>
          </form>
        ) : (
          <form className="auth-card" onSubmit={handleRegister}>
            <h2>Register</h2>
            <input 
              type="email" 
              placeholder="e-mail:" 
              onChange={(e) => setRegData({...regData, email: e.target.value})} 
            />
            <input 
              type="password" 
              placeholder="password:" 
              onChange={(e) => setRegData({...regData, password: e.target.value})} 
            />
            <button type="submit">sign up</button>
            
            {/* PRZYCISK ZMIANY TRYBU */}
            <p className="auth-toggle-text">
              Already have an account? <span onClick={() => setIsLogin(true)}>Log in</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}