import React, { useState, useMemo, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityClass = (priority) => {
    if (priority === 'CRIT' || priority === 'critical') return 'priority-tag critical';
    if (priority === 'HIGH' || priority === 'high') return 'priority-tag high';
    return 'priority-tag low';
  };

  const handleTaskToggle = (taskId, currentStatus) => {
    if (updateTaskStatus) {
      const isCurrentlyDone = currentStatus === 'done' || currentStatus === 'Done';
      const newStatus = isCurrentlyDone ? 'To do' : 'Done'; 
      updateTaskStatus(taskId, newStatus);
    } else {
      console.error("Nie znaleziono funkcji updateTaskStatus w TaskContext!");
    }
  };

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

        {/* ŚRODKOWA SEKCJA */}
        <section className="middle-section">
          
          <div className="tasks-column">
            <h2 className="recent-tasks-title" style={{ marginBottom: '24px' }}>Recent tasks</h2>
            
            <div className="task-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {todaysTasks && todaysTasks.map((task) => {
                const isChecked = task.status === 'done' || task.status === 'Done';
                
                return (
                  <div 
                    key={task.id} 
                    className="card" 
                    style={{ 
                      margin: 0, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '16px', 
                      padding: '18px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div 
                      className="task-indicator-line" 
                      data-priority={task.priority} 
                    />

                    <div 
                      className={`task-checkbox ${isChecked ? 'checked' : ''}`}
                      onClick={() => handleTaskToggle(task.id, task.status || 'To do')}
                      style={{ 
                        cursor: 'pointer',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: '2px solid var(--accent-primary)',
                        backgroundColor: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginLeft: '4px'
                      }}
                    >
                      {isChecked && <Check size={12} strokeWidth={4} color="#130823" />}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontSize: '15px', 
                        fontWeight: '600', 
                        color: 'var(--text-main)'
                      }}>
                        {task.title}
                      </div>

                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
                        <span className={getPriorityClass(task.priority)}>
                          [{task.priority ? task.priority.toUpperCase() : 'LOW'}]
                        </span>
                        
                        <span className="category-tag" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Folder size={10} /> {task.project || task.category || 'FocusFlow'}
                        </span>

                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '4px' }}>
                          <Clock3 size={13} style={{ color: 'var(--text-muted)' }} /> 
                          {task.deadline ? `deadline ${task.deadline}` : 'no deadline'}
                        </span>
                      </div>
                    </div>

                    <div className="task-options">
                      <button 
                        className="icon-btn" 
                        style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: 'inherit' }}
                        onClick={() => navigate(`/kanban/${task.id}`)}
                        title="View task details"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {(!todaysTasks || todaysTasks.length === 0) && (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '12px' }}>
                  No active tasks for today.
                </p>
              )}
            </div>
          </div>

          <div className="summary-column" style={{ display: 'flex', flexDirection: 'column', gap: '54px', paddingTop: '12px' }}>
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
            <div className="velocity-card" style={{ flex: 'none', height: 'auto' }}>
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