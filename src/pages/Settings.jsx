import React, { useEffect, useRef, useState } from 'react';
import { Camera, Check, Download, Lock, RotateCcw, Shield, Trash2 } from 'lucide-react';
import RightAnalytics from '../components/RightAnalytics';
import { useTasks } from '../context/TaskContext';
import '../style/Settings.css';

const STORAGE_KEY = 'focusflow-settings';

const defaultSettings = {
  displayName: 'System_Admin',
  email: 'admin@focusflow.com',
  avatar: '',
  deepWork: true,
  smartFiltering: false,
  timerDuration: 25,
  breakInterval: 5,
  cloudSync: true,
};

export default function Settings() {
  const { tasks, statsData } = useTasks();
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
  }, []);

  const hasProfileChanges =
    settings.displayName !== savedSettings.displayName ||
    settings.email !== savedSettings.email ||
    settings.avatar !== savedSettings.avatar;

  const updateSetting = (key, value) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }));
  };

  const saveProfile = () => {
    const nextSavedSettings = { ...settings };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSavedSettings));
    setSavedSettings(nextSavedSettings);
    setSaveState('saved');
    window.setTimeout(() => setSaveState('idle'), 1400);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => updateSetting('avatar', reader.result);
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

  const wipePerformanceData = () => {
    const confirmed = window.confirm('Wipe local performance settings and reset this view?');
    if (!confirmed) return;

    window.localStorage.removeItem(STORAGE_KEY);
    setSettings(defaultSettings);
    setSavedSettings(defaultSettings);
    setWipeState('wiped');
    window.setTimeout(() => setWipeState('idle'), 1600);
  };

  const avatarInitials = settings.displayName
    .split(/[_\s]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

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
                  <span>{avatarInitials || 'SA'}</span>
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
                    onChange={(event) => updateSetting('displayName', event.target.value)}
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
                  onChange={(event) => updateSetting('email', event.target.value)}
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
              onClick={() => updateSetting('deepWork', !settings.deepWork)}
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
                  onChange={(event) => updateSetting('timerDuration', Number(event.target.value))}
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
                  onChange={(event) => updateSetting('breakInterval', Number(event.target.value))}
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
              onClick={() => updateSetting('smartFiltering', !settings.smartFiltering)}
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
                onClick={() => updateSetting('cloudSync', !settings.cloudSync)}
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
          {saveState === 'saved' ? 'Profile saved locally' : 'Changes stay on this device'}
        </div>
      </main>

      <RightAnalytics />
    </div>
  );
}