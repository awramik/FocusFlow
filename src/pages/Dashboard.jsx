import React, { useState, useMemo, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import RightAnalytics from '../components/RightAnalytics';
import { Clock3, Download, Zap, Flame, Lightbulb, Pause, Square, GripVertical, Check, Play } from 'lucide-react';
import '../style/Dashboard.css';

const SETTINGS_STORAGE_KEY = 'focusflow-settings';

const Dashboard = () => {
  const { tasks, currentUser, statsData, projectsData, hoursData } = useTasks(); 

  // Lokalny stan do przechowywania ID zaznaczonych (odklikniętych) zadań
  const [checkedTasks, setCheckedTasks] = useState(new Set());

  // Timer state
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Initialize timer with settings duration on mount
  useEffect(() => {
    const storedSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    let timerDuration = 25; // default
    
    if (storedSettings) {
      try {
        const settings = JSON.parse(storedSettings);
        timerDuration = settings.timerDuration || 25;
      } catch (e) {
        // Use default if parsing fails
      }
    }
    
    setTimeLeft(timerDuration * 60); // Convert minutes to seconds
    setIsActive(true);
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle play/pause
  const handleToggleTimer = () => {
    if (isActive) {
      setIsRunning(!isRunning);
    }
  };

  // Reset timer
  const handleResetTimer = () => {
    setIsRunning(false);
    const storedSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    let timerDuration = 25;
    
    if (storedSettings) {
      try {
        const settings = JSON.parse(storedSettings);
        timerDuration = settings.timerDuration || 25;
      } catch (e) {
        // Use default if parsing fails
      }
    }
    
    setTimeLeft(timerDuration * 60);
  };

  const activeUser = currentUser && currentUser.length > 0 ? currentUser[0] : { firstName: "DevStrange" };

  const activeTask = tasks?.find(t => t.status === 'Doing') || tasks?.[0];
  const todaysTasks = tasks?.filter(t => t.status !== 'Done').slice(0, 3);

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Helper function to extract date from deadline string (e.g., "2026-05-31 12:00 PM")
  const getDateFromDeadline = (deadline) => {
    if (!deadline) return null;
    return deadline.split(' ')[0];
  };

  // Calculate daily completion percentage based on tasks due today
  const dailyCompletion = useMemo(() => {
    const todayDate = getTodayDate();
    const todayTasksList = tasks?.filter(t => {
      const taskDate = getDateFromDeadline(t.deadline);
      return taskDate === todayDate;
    }) || [];

    const completedTodayTasks = todayTasksList.filter(t => t.status === 'Done').length;
    const totalTodayTasks = todayTasksList.length;

    return {
      completed: completedTodayTasks,
      total: totalTodayTasks,
      percentage: totalTodayTasks > 0 ? Math.round((completedTodayTasks / totalTodayTasks) * 100) : 0
    };
  }, [tasks]);

  const formatPriority = (priority) => {
    if (!priority) return '[LOW]';
    if (priority.toLowerCase() === 'critical') return '[CRIT]';
    return `[${priority.toUpperCase()}]`;
  };

  // Funkcja, która przełącza stan zadania z "pustego" na "zaznaczone"
  const handleTaskToggle = (taskId) => {
    setCheckedTasks(prev => {
      const newChecked = new Set(prev);
      if (newChecked.has(taskId)) {
        newChecked.delete(taskId);
      } else {
        newChecked.add(taskId);
      }
      return newChecked;
    });
  };
  // Obliczanie procentowego postępu dla godzin pracy i skupienia
  const workHoursPercentage = hoursData?.workHours?.goal 
    ? Math.min(100, Math.round((hoursData.workHours.current / hoursData.workHours.goal) * 100)) 
    : 0;

  const focusedHoursPercentage = hoursData?.focusedHours?.goal 
    ? Math.min(100, Math.round((hoursData.focusedHours.current / hoursData.focusedHours.goal) * 100)) 
    : 0;

  return (
    <div className="dashboard-layout">
      
      <main className="center-content">
        
        <header className="dashboard-header">
          <h1>Welcome back, {activeUser.firstName}</h1>
          <p>Here you can keep track of your tasks and get access to personalized analytics</p>
        </header>

        {/* GÓRNY RZĄD */}
        <section className="top-row">
          <div className="glass-card daily-status-card">
            <p className="daily-status-title">Daily completion status</p>
            <div className="daily-status-value-row">
              <span className="daily-status-percent">{dailyCompletion.percentage}%</span>
              <span className="daily-status-goal">OF GOAL</span>
            </div>
            <div className="daily-progress-bg">
              <div className="daily-progress-fill" style={{ width: `${dailyCompletion.percentage}%` }}></div>
            </div>
          </div>

          <div className="glass-card active-session-card">
            <div className="active-session-left">
              <div className="timer-circle">
                {formatTime(timeLeft)}
              </div>
              <div className="active-session-info">
                <p className="active-session-label">ACTIVE SESSION</p>
                <h3 className="active-session-title">Pomodoro timer</h3>
                <p className="active-session-task">TASK: {activeTask?.title || "FocusFlow visualization"}</p>
              </div>
            </div>
            <div className="active-session-actions">
              <button className="action-btn" onClick={handleToggleTimer} title={isRunning ? "Pause" : "Play"}>
                {isRunning ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
              </button>
              <button className="action-btn" onClick={handleResetTimer} title="Reset">
                <Square size={12} fill="currentColor" />
              </button>
            </div>
          </div>
        </section>

        {/* ŚRODKOWA SEKCJA: Lista zadań i małe podsumowania */}
        <section className="middle-section">
          
          {/* Lewa strona: Lista Zadań */}
          <div className="tasks-column">
            <h2 className="recent-tasks-title">Recent tasks</h2>
            
            <div className="task-list">
              {todaysTasks && todaysTasks.map((task) => {
                const isChecked = checkedTasks.has(task.id);
                
                return (
                  // Dodajemy klasę 'completed', jeśli zadanie jest zaznaczone
                  <div key={task.id} className={`task-card-new priority-${String(task.priority || 'low').trim().toLowerCase()} ${isChecked ? 'completed' : ''}`}>
                    
                    {/* Interaktywne kółeczko z onClick */}
                    <div 
                      className={`task-checkbox ${isChecked ? 'checked' : ''}`}
                      onClick={() => handleTaskToggle(task.id)}
                    >
                      {/* Ikonka ptaszka - renderuje się tylko jeśli isChecked jest true */}
                      {isChecked && <Check size={16} strokeWidth={3} color="#2F1547" />}
                    </div>
                    
                    <div className="task-content">
                      <h3 className="task-title-new">{task.title}</h3>
                      <div className="task-tags">
                        <span className="task-tag-priority">{formatPriority(task.priority)}</span>
                        <span className="task-tag-category">{task.category}</span>
                      </div>
                    </div>

                    <div className="task-options">
                      <GripVertical size={16} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prawa strona: Progress Bars & Peak Velocity */}
          <div className="summary-column">
            <div className="glass-card progress-card transparent-card">
              <div className="progress-item">
                <div className="progress-text-row">
                  <span className="progress-label-pink">Hours of work</span>
                  <span className="progress-value-pink">{hoursData.workHours.current} / {hoursData.workHours.goal}{hoursData.workHours.unit}</span>
                </div>
                <div className="progress-bar-bg-dark"><div className="progress-bar-fill-pink" style={{width: `${workHoursPercentage}%`}}></div></div>
              </div>
              <div className="progress-item">
                <div className="progress-text-row">
                  <span className="progress-label-purple">Hours focused (pomodoro)</span>
                  <span className="progress-value-purple">{hoursData.focusedHours.current} / {hoursData.focusedHours.goal}{hoursData.focusedHours.unit}</span>
                </div>
                <div className="progress-bar-bg-dark"><div className="progress-bar-fill-purple" style={{width: `${focusedHoursPercentage}%`}}></div></div>
              </div>
            </div>

            <div className="velocity-card">
              <div className="velocity-icon-wrapper">
                <Zap size={28} color="#FFAFD7" />
              </div>
              <div className="velocity-content">
                <h3>Peak Velocity</h3>
                <p>You are 15% more productive on Tuesdays between 9:00 and 11:00.</p>
              </div>
            </div>
          </div>
        </section>

        {/* DOLNY RZĄD */}
        <section className="bottom-row">
          <div className="bottom-card-streak">
            <Flame size={16} className="streak-icon" />
            <div className="streak-title-wrapper">
              <h3>Focus streak</h3>
            </div>
            <div className="streak-text-wrapper">
              <p>12 consecutive days of hitting your deep work target! You’re locked in :)</p>
            </div>
          </div>
          
          <div className="bottom-card-tip">
            <div className="tip-header">
              <Lightbulb size={20} className="tip-icon" />
              <div className="tip-title-wrapper">
                <h3>PRO TIP</h3>
              </div>
            </div>
            <p className="tip-text">Your personalized weekly tip to maximize your performance!</p>
          </div>
          
          <div className="bottom-card-recap">
            <div className="recap-title-wrapper">
              <h3>Weekly Recap</h3>
            </div>
            <div className="recap-text-wrapper">
              <p>Your automated performance report is ready for review.</p>
            </div>
            <button className="generate-pdf-btn">GENERATE PDF</button>
          </div>
        </section>

      </main>

      <RightAnalytics />

    </div>
  );
};

export default Dashboard;