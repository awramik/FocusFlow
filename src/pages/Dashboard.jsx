import React, { useState, useMemo, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RightAnalytics from '../components/RightAnalytics';
import { Clock3, Zap, Flame, Lightbulb, Pause, Play, Square, MoreHorizontal, Check, Folder } from 'lucide-react';
import '../style/Dashboard.css';

const SETTINGS_STORAGE_KEY = 'focusflow-settings';

const Dashboard = () => {
  const { 
    tasks, 
    currentUser, 
    updateTaskStatus,
    timeLeft,
    isRunning,
    handleStartPause,
    handleReset,
    hoursData // Pobieramy dynamiczne godziny z bazy
  } = useTasks(); 

  const { currentUser: authUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; 
    if (!authUser) {
      navigate('/');
    }
  }, [authUser, loading, navigate]);

  if (authUser === undefined) return <div>Ładowanie sesji...</div>;

  const activeUser = authUser ? { firstName: authUser.firstName || authUser.email?.split('@')[0] } : { firstName: "DevStrange" };

  const todaysTasks = tasks?.filter(t => t.status !== 'done' && t.status !== 'Done').slice(0, 3);
  const activeTask = tasks?.find(t => t.status === 'ongoing') || todaysTasks?.[0];

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.status === 'done' || t.status === 'Done').length || 0;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 75;

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

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getDateFromDeadline = (deadline) => {
    if (!deadline) return null;
    return deadline.split(' ')[0];
  };

  const dailyCompletion = useMemo(() => {
    const todayDate = getTodayDate();
    const todayTasksList = tasks?.filter(t => {
      const taskDate = getDateFromDeadline(t.deadline);
      return taskDate === todayDate;
    }) || [];

    if (todayTasksList.length === 0) return { completed: 0, total: 0, percentage: 0 };

    const completedTodayTasks = todayTasksList.filter(t => t.status === 'Done' || t.status === 'done').length;
    const totalTodayTasks = todayTasksList.length;

    return {
      completed: completedTodayTasks,
      total: totalTodayTasks,
      percentage: Math.round((completedTodayTasks / totalTodayTasks) * 100)
    };
  }, [tasks]);

  // Bezpieczne wyliczanie procentów (zabezpieczenie przed brakiem danych)
  const workHoursPercentage = hoursData?.workHours?.goal 
    ? Math.min(100, Math.round((hoursData.workHours.current / hoursData.workHours.goal) * 100)) 
    : 0;

  const focusedHoursPercentage = hoursData?.focusedHours?.goal 
    ? Math.min(100, Math.round((hoursData.focusedHours.current / hoursData.focusedHours.goal) * 100)) 
    : 0;

  // Bezpieczne pobranie wartości do wyświetlenia tekstowego
  const workCurrent = hoursData?.workHours?.current ?? 0;
  const workGoal = hoursData?.workHours?.goal ?? 6;
  const focusCurrent = hoursData?.focusedHours?.current ?? 0;
  const focusGoal = hoursData?.focusedHours?.goal ?? 2;

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
              <span className="daily-status-percent">{completionPercentage}%</span>
              <span className="daily-status-goal">OF GOAL</span>
            </div>
            <div className="daily-progress-bg">
              <div className="daily-progress-fill" style={{ width: `${completionPercentage}%` }}></div>
            </div>
          </div>

          <div className="glass-card active-session-card">
            <div className="active-session-left">
              <div className="timer-circle">{formatTime(timeLeft)}</div>
              <div className="active-session-info">
                <p className="active-session-label">ACTIVE SESSION</p>
                <h3 className="active-session-title">Pomodoro timer</h3>
                <p className="active-session-task">TASK: {activeTask?.title || "FocusFlow visualization"}</p>
              </div>
            </div>
            <div className="active-session-actions">
              <button className="action-btn" onClick={handleStartPause} title={isRunning ? "Pause" : "Start"}>
                {isRunning ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
              </button>
              <button className="action-btn" onClick={handleReset} title="Reset">
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
                  <div key={task.id} className={`task-card-new priority-${String(task.priority || 'low').trim().toLowerCase()} ${isChecked ? 'completed' : ''}`}>
                    <div 
                      className={`task-checkbox ${isChecked ? 'checked' : ''}`}
                      onClick={() => handleTaskToggle(task.id, task.status || 'To do')}
                      style={{ 
                        cursor: 'pointer', width: '20px', height: '20px', borderRadius: '50%',
                        border: '2px solid var(--accent-primary)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0, marginLeft: '4px'
                      }}
                    >
                      {isChecked && <Check size={12} strokeWidth={4} color="var(--checkmark-color)" />}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)' }}>{task.title}</div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
                        <span className={getPriorityClass(task.priority)}>[{task.priority ? task.priority.toUpperCase() : 'LOW'}]</span>
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
                      <button className="icon-btn" style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: 'inherit' }} onClick={() => navigate(`/kanban/${task.id}`)} title="View task details">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
              {(!todaysTasks || todaysTasks.length === 0) && (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '12px' }}>No active tasks for today.</p>
              )}
            </div>
          </div>

          <div className="summary-column" style={{ display: 'flex', flexDirection: 'column', gap: '54px', paddingTop: '12px' }}>
            <div className="glass-card progress-card transparent-card">
              
              {/* OŻYWIONY ELEMENT: HOURS OF WORK */}
              <div className="progress-item">
                <div className="progress-text-row">
                  <span className="progress-label-pink">Hours of work</span>
                  <span className="progress-value-pink">{workCurrent} / {workGoal}h</span>
                </div>
                <div className="progress-bar-bg-dark">
                  <div className="progress-bar-fill-pink" style={{ width: `${workHoursPercentage}%` }}></div>
                </div>
              </div>

              {/* OŻYWIONY ELEMENT: HOURS FOCUSED */}
              <div className="progress-item">
                <div className="progress-text-row">
                  <span className="progress-label-purple">Hours focused (pomodoro)</span>
                  <span className="progress-value-purple">{focusCurrent} / {focusGoal}h</span>
                </div>
                <div className="progress-bar-bg-dark">
                  <div className="progress-bar-fill-purple" style={{ width: `${focusedHoursPercentage}%` }}></div>
                </div>
              </div>

            </div>
            
            <div className="velocity-card" style={{ flex: 'none', height: 'auto' }}>
              <div className="velocity-icon-wrapper"><Zap size={28} color="#FFAFD7" /></div>
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
            <div className="streak-title-wrapper"><h3>Focus streak</h3></div>
            <div className="streak-text-wrapper"><p>12 consecutive days of hitting your deep work target! You’re locked in :)</p></div>
          </div>
          <div className="bottom-card-tip">
            <div className="tip-header">
              <Lightbulb size={20} className="tip-icon" />
              <div className="tip-title-wrapper"><h3>PRO TIP</h3></div>
            </div>
            <p className="tip-text">Your personalized weekly tip to maximize your performance!</p>
          </div>
          <div className="bottom-card-recap">
            <div className="recap-title-wrapper"><h3>Weekly Recap</h3></div>
            <div className="recap-text-wrapper"><p>Your automated performance report is ready for review.</p></div>
            <button className="generate-pdf-btn">GENERATE PDF</button>
          </div>
        </section>
      </main>

      <RightAnalytics />
    </div>
  );
};

export default Dashboard;