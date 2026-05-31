import React, { useState, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import RightAnalytics from '../components/RightAnalytics';
import { Clock3, Download, Zap, Flame, Lightbulb, Pause, Square, GripVertical, Check } from 'lucide-react';
import '../style/Dashboard.css';

const Dashboard = () => {
  const { tasks, currentUser, statsData, projectsData } = useTasks(); 

  // Lokalny stan do przechowywania ID zaznaczonych (odklikniętych) zadań
  const [checkedTasks, setCheckedTasks] = useState(new Set());

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
                18:42
              </div>
              <div className="active-session-info">
                <p className="active-session-label">ACTIVE SESSION</p>
                <h3 className="active-session-title">Pomodoro timer</h3>
                <p className="active-session-task">TASK: {activeTask?.title || "FocusFlow visualization"}</p>
              </div>
            </div>
            <div className="active-session-actions">
              <button className="action-btn"><Pause size={14} fill="currentColor" /></button>
              <button className="action-btn"><Square size={12} fill="currentColor" /></button>
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
                  <div key={task.id} className={`task-card-new priority-${task.priority} ${isChecked ? 'completed' : ''}`}>
                    
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
                  <span className="progress-value-pink">4.5 / 6h</span>
                </div>
                <div className="progress-bar-bg-dark"><div className="progress-bar-fill-pink" style={{width: '75%'}}></div></div>
              </div>
              <div className="progress-item">
                <div className="progress-text-row">
                  <span className="progress-label-purple">Hours focused (pomodoro)</span>
                  <span className="progress-value-purple">1.2 / 2h</span>
                </div>
                <div className="progress-bar-bg-dark"><div className="progress-bar-fill-purple" style={{width: '60%'}}></div></div>
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