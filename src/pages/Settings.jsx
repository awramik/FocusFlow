import React, { useEffect, useRef, useState } from 'react';
import { Camera, Check, Download, Lock, RotateCcw, Shield, Trash2 } from 'lucide-react';
import RightAnalytics from '../components/RightAnalytics';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext'; 
import { db } from '../firebase'; 
import { doc, updateDoc, setDoc } from 'firebase/firestore'; // Zmienione importy!
import '../style/Settings.css';

const defaultSettings = {
  displayName: '',
  email: '',
  avatar: '',
  deepWork: true,
  smartFiltering: false,
  timerDuration: 25,
  breakInterval: 5,
  cloudSync: true,
};

export default function Settings() {
  const { tasks, statsData } = useTasks();
  const { currentUser } = useAuth(); 
  const fileInputRef = useRef(null);
  
  const [settings, setSettings] = useState(defaultSettings);
  const [savedSettings, setSavedSettings] = useState(defaultSettings);
  const [saveState, setSaveState] = useState('idle');
  const [wipeState, setWipeState] = useState('idle');
  
  // Stan dla motywu
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // helper dla zmiany motywu
  const setFavicon = (iconPath) => {
    let link = document.querySelector("link[rel~='icon']");

    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    link.href = iconPath;
  };

  // Efekt dla motywu
  useEffect(() => {
    document.body.className = theme === 'light' ? 'theme-light' : '';
    localStorage.setItem('theme', theme);

    if (theme === 'light') {
      setFavicon('/favicon-light.svg');
    } else {
      setFavicon('/favicon-dark.svg');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    if (currentUser) {
      const cloudSettings = {
        displayName: currentUser.firstName || defaultSettings.displayName,
        email: currentUser.email || defaultSettings.email,
        avatar: currentUser.avatarUrl || defaultSettings.avatar,
        deepWork: currentUser.settings?.deepWork ?? defaultSettings.deepWork,
        smartFiltering: currentUser.settings?.smartFiltering ?? defaultSettings.smartFiltering,
        timerDuration: currentUser.settings?.timerDuration ?? defaultSettings.timerDuration,
        breakInterval: currentUser.settings?.breakInterval ?? defaultSettings.breakInterval,
        cloudSync: currentUser.settings?.cloudSync ?? defaultSettings.cloudSync,
      };
      setSettings(cloudSettings);
      setSavedSettings(cloudSettings);
    const storedSettings = window.localStorage.getItem(STORAGE_KEY);
    if (storedSettings) {
      try {
        const parsedSettings = { ...defaultSettings, ...JSON.parse(storedSettings) };
        setSettings(parsedSettings);
        setSavedSettings(parsedSettings);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [currentUser]); 

  const hasProfileChanges =
    settings.displayName !== savedSettings.displayName ||
    settings.email !== savedSettings.email ||
    settings.avatar !== savedSettings.avatar;

  // --- NOWOŚĆ: TYLKO LOKALNA AKTUALIZACJA (dla płynności suwaków) ---
  const updateLocalSetting = (key, value) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }));
  };

  // --- NOWOŚĆ: BEZPIECZNY ZAPIS DO CHMURY (kiedy puścisz suwak lub klikniesz przełącznik) ---
  const saveSettingToCloud = async (key, value) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      // setDoc z merge: true wymusza zapisanie pola, nawet jeśli w bazie brakuje jakiegoś elementu
      await setDoc(userRef, {
        settings: {
          [key]: value
        }
      }, { merge: true });
    } catch (error) {
      console.error(`Błąd zapisu ustawienia ${key}:`, error);
    }
  };

  // --- POMOCNICZA FUNKCJA DO PRZEŁĄCZNIKÓW ---
  const handleToggle = (key) => {
    const newValue = !settings[key];
    updateLocalSetting(key, newValue);
    saveSettingToCloud(key, newValue);
  };

  const saveProfile = async () => {
    if (!currentUser) return;
    setSaveState('saving');
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        firstName: settings.displayName,
        email: settings.email,
        avatarUrl: settings.avatar 
      });

      setSavedSettings({ ...settings });
      setSaveState('saved');
      window.setTimeout(() => setSaveState('idle'), 1400);
    } catch (error) {
      console.error("Błąd zapisu profilu:", error);
      alert("Coś poszło nie tak z zapisem: " + error.message);
      setSaveState('idle');
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateLocalSetting('avatar', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const exportFocusHistory = () => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      settings,
      stats: statsData,
      tasks,
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'focusflow-history.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const wipePerformanceData = async () => {
    const confirmed = window.confirm('Wipe performance settings and reset to defaults?');
    if (!confirmed || !currentUser) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        settings: {
          deepWork: true,
          timerDuration: 25,
          breakInterval: 5,
          smartFiltering: false,
          cloudSync: true
        }
      }, { merge: true });
      setWipeState('wiped');
      window.setTimeout(() => setWipeState('idle'), 1600);
    } catch (error) {
      console.error("Błąd resetowania:", error);
    }
  };

  const avatarInitials = settings.displayName
    ? settings.displayName.split(/[_\s]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    : 'FF';

  return (
    <div className="settings-page">
      <main className="settings-content">
        <header className="settings-header">
          <h1>Settings</h1>
          <p>Customize your setup, enhance your performance</p>
        </header>

        <section className="settings-section" aria-labelledby="profile-settings-title">
          <h2 id="profile-settings-title">Profile settings</h2>

          <div className="settings-card settings-profile-card">
            <div className="settings-avatar-wrap">
              <div className="settings-avatar">
                {settings.avatar ? (
                  <img src={settings.avatar} alt="Profile avatar" />
                ) : (
                  <span>{avatarInitials}</span>
                )}
              </div>
              <button
                type="button"
                className="settings-avatar-button"
                aria-label="Change profile picture"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={14} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="settings-file-input"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="settings-profile-fields">
              <label className="settings-field">
                <span>Display name</span>
                <div className="settings-input-row">
                  <input
                    type="text"
                    value={settings.displayName}
                    onChange={(event) => updateLocalSetting('displayName', event.target.value)}
                  />
                  <button type="button" disabled={!hasProfileChanges} onClick={saveProfile}>
                    {saveState === 'saved' ? 'Saved' : 'Save'}
                  </button>
                </div>
              </label>

              <label className="settings-field">
                <span>Email address</span>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(event) => updateLocalSetting('email', event.target.value)}
                />
              </label>
            </div>
          </div>
        </section>

        <section className="settings-section" aria-labelledby="focus-configuration-title">
          <h2 id="focus-configuration-title">Focus configuration</h2>

          <div className="settings-option-card">
            <div>
              <h3>Color theme</h3>
              <p>Switch between light and dark mode</p>
            </div>
            <button
              type="button"
              className={`settings-switch ${theme === 'light' ? 'settings-switch--on' : ''}`}
              onClick={toggleTheme}
            >
              <span />
            </button>
          </div>

          <div className="settings-option-card">
            <div>
              <h3>Deep work protocol</h3>
              <p>No notifications, no leaving the app</p>
            </div>
            <button
              type="button"
              className={`settings-switch ${settings.deepWork ? 'settings-switch--on' : ''}`}
              aria-pressed={settings.deepWork}
              onClick={() => handleToggle('deepWork')}
            >
              <span />
            </button>
          </div>

          <div className="settings-sliders">
            <label className="settings-slider-card">
              <span>Timer duration (min)</span>
              <div className="settings-slider-row">
                <strong>{settings.timerDuration.toString().padStart(2, '0')}</strong>
                <input
                  type="range"
                  min="5"
                  max="90"
                  step="5"
                  value={settings.timerDuration}
                  // Podczas ciągnięcia suwaka -> aktualizujemy tylko UI
                  onChange={(event) => updateLocalSetting('timerDuration', Number(event.target.value))}
                  // Gdy puścisz myszkę/palec -> wysyłamy do Firebase
                  onPointerUp={(event) => saveSettingToCloud('timerDuration', Number(event.target.value))}
                  style={{ '--range-value': `${((settings.timerDuration - 5) / 85) * 100}%` }}
                />
              </div>
            </label>

            <label className="settings-slider-card">
              <span>Break interval (min)</span>
              <div className="settings-slider-row">
                <strong>{settings.breakInterval.toString().padStart(2, '0')}</strong>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  value={settings.breakInterval}
                  onChange={(event) => updateLocalSetting('breakInterval', Number(event.target.value))}
                  onPointerUp={(event) => saveSettingToCloud('breakInterval', Number(event.target.value))}
                  style={{ '--range-value': `${((settings.breakInterval - 5) / 25) * 100}%` }}
                />
              </div>
            </label>
          </div>

          <div className="settings-option-card">
            <div>
              <h3>Smart notification filtering</h3>
              <p>Allow only emergency calls</p>
            </div>
            <button
              type="button"
              className={`settings-switch ${settings.smartFiltering ? 'settings-switch--on' : ''}`}
              aria-pressed={settings.smartFiltering}
              onClick={() => handleToggle('smartFiltering')}
            >
              <span />
            </button>
          </div>
        </section>

        <section className="settings-section" aria-labelledby="data-privacy-title">
          <h2 id="data-privacy-title">Data & privacy</h2>

          <div className="settings-data-card">
            <div className="settings-data-row">
              <span>Export focus history (.json)</span>
              <button type="button" onClick={exportFocusHistory}>
                <Download size={12} />
                Export
              </button>
            </div>

            <div className="settings-data-row">
              <span>Cloud Synchronization</span>
              <button
                type="button"
                className={settings.cloudSync ? 'settings-status settings-status--active' : 'settings-status'}
                onClick={() => handleToggle('cloudSync')}
              >
                {settings.cloudSync ? (
                  <>
                    <Check size={12} />
                    Active
                  </>
                ) : (
                  <>
                    <Lock size={12} />
                    Off
                  </>
                )}
              </button>
            </div>

            <div className="settings-data-row settings-data-row--danger">
              <span>Wipe all performance data</span>
              <button type="button" onClick={wipePerformanceData}>
                {wipeState === 'wiped' ? (
                  <>
                    <RotateCcw size={12} />
                    Reset
                  </>
                ) : (
                  <>
                    <Trash2 size={12} />
                    Wipe
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        <div className="settings-save-note" role="status" aria-live="polite">
          <Shield size={14} />
          {saveState === 'saved' ? 'Profile saved to cloud!' : 'Settings sync securely to Firebase.'}
        </div>
      </main>

      <RightAnalytics />
    </div>
  );
}