import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react'; // Importujemy ikonę tutaj
import '../style/Auth.css';

export default function Auth() {
  const [regData, setRegData] = useState({ email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
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
      await createUserWithEmailAndPassword(auth, regData.email, regData.password);
      alert("Konto utworzone!");
    } catch (err) { alert(err.message); }
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
      {/* Logo i Nazwa */}
      <div className="auth-logo">
        <Zap size={40} color="#FFAFD7" />
        <h1>FocusFlow</h1>
      </div>

      <p className="auth-hero-text">Unlock your peak productivity.</p>

      <div className="auth-container">
        <form className="auth-card" onSubmit={handleRegister}>
          <h2>Register</h2>
          <input type="email" placeholder="e-mail:" onChange={(e) => setRegData({...regData, email: e.target.value})} />
          <input type="password" placeholder="password:" onChange={(e) => setRegData({...regData, password: e.target.value})} />
          <button type="submit">sign up</button>
        </form>

        <form className="auth-card" onSubmit={handleLogin}>
          <h2>Log in</h2>
          <input type="email" placeholder="e-mail:" onChange={(e) => setLoginData({...loginData, email: e.target.value})} />
          <input type="password" placeholder="password:" onChange={(e) => setLoginData({...loginData, password: e.target.value})} />
          <button type="submit">log in</button>
        </form>
      </div>
    </div>
  );
}