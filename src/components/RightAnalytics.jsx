import React, { useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle, Zap, Star, MoveUpRight, Clock, Calendar as CalendarIcon, Flame } from 'lucide-react';
import '../style/RightAnalytics.css';

const RightAnalytics = () => {
  const { tasks, statsData, currentUser } = useTasks();
  const navigate = useNavigate();
  
  //Completion Rate (Zrobione vs Wszystkie)
  const totalTasksCount = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.status === 'Done' || t.status === 'done') || [];
  const completionRate = totalTasksCount > 0 ? Math.round((completedTasks.length / totalTasksCount) * 100) : 0;

  // Punkty XP i Poziom Ferdynanda
  const currentXP = currentUser?.ferdynand?.currentXP || 0;
  const currentLevel = currentUser?.ferdynand?.stage || 1;

  // Daily Average (Średnia ukończonych zadań na "aktywny" dzień)
  const dailyAverage = useMemo(() => {
    if (completedTasks.length === 0) return 0;
    const activeDays = new Set(
      completedTasks.map(t => t.completedAt?.split('T')[0]).filter(Boolean)
    );
    const daysCount = activeDays.size > 0 ? activeDays.size : 1;
    // Zaokrąglamy do 1 miejsca po przecinku (np. 3.5)
    return (completedTasks.length / daysCount).toFixed(1);
  }, [completedTasks]);



  //Top Priority Focus - procent ukończenia zadań o priorytecie CRIT/HIGH
  const priorityTasks = tasks?.filter(t => {
    const p = t.priority?.toUpperCase();
    return p === 'CRIT' || p === 'CRITICAL' || p === 'HIGH';
  }) || [];
  
  const completedPriority = priorityTasks.filter(t => t.status === 'Done' || t.status === 'done').length;
  const totalPriority = priorityTasks.length;
  // Jeśli nie ma ważnych zadań, pokazujemy 100% (wszystko czyste)
  const priorityPercentage = totalPriority > 0 ? Math.round((completedPriority / totalPriority) * 100) : 100;


// Logika do kalendarza
  const today = new Date();
  const currentMonth = today.toLocaleString('en-US', { month: 'long' });
  const currentYear = today.getFullYear();

  const currentMonthNumber = today.getMonth();
  const totalDaysInMonth = new Date(
    currentYear,
    currentMonthNumber + 1,
    0
  ).getDate();

  const daysInMonth = Array.from(
    { length: totalDaysInMonth },
    (_, i) => i + 1
  );

  const deadlineDays = new Set(
    tasks
      ?.filter(task => task.deadline)
      .map(task => task.deadline.split(' ')[0]) 
  );

  const firstDayIndex = new Date(
    currentYear,
    currentMonthNumber,
    1
  ).getDay();

  const shiftAmount =
    firstDayIndex === 0
      ? 6
      : firstDayIndex - 1;

  const emptySpaces = Array.from(
    { length: shiftAmount },
    (_, i) => i
  );

  const hasDeadline = (day) => {
    const formattedDay = day < 10 ? `0${day}` : day;
    const currentMonthISO = String(
      currentMonthNumber + 1
    ).padStart(2, '0');

    const dateString =
      `${currentYear}-${currentMonthISO}-${formattedDay}`;
        return deadlineDays.has(dateString);
  };

  return (
    <aside className="right-sidebar">
      
      {/* Analytics Header */}
      <div className="analytics-header">
        <h2>Analytics</h2>
        <p>Your productivity insights</p>
      </div>

      {/* Kafelki Statystyk */}
      <div className="analytics-metrics-container">
        
        {/* Completion rate */}
        <div className="analytics-metric-card">
          <div className="metric-left">
            <span className="metric-label">Completion rate</span>
            <span className="metric-value">{completionRate}%</span>
          </div>
          <div className="metric-right">
            <div className="progress-circle-box">
              <LoaderCircle size={24} className="icon-pink" />
            </div>
            <span className="metric-badge">All time</span>
          </div>
        </div>

        {/* Punkty XP */}
        <div className="analytics-metric-card">
          <div className="metric-left">
            <span className="metric-label">Total XP</span>
            <span className="metric-value">{currentXP}</span>
          </div>
          <div className="metric-right">
            <div className="progress-circle-box">
              <Zap size={24} className="icon-pink-light" />
            </div>
            <span className="metric-badge">Lvl {currentLevel}</span>
          </div>
        </div>

        {/* Daily average */}
        <div className="analytics-metric-card">
          <div className="metric-left">
            <span className="metric-label">Daily average</span>
            <span className="metric-value">{dailyAverage}</span>
          </div>
          <div className="metric-right">
            <div className="progress-circle-box">
              <Star size={24} className="icon-pink-light" />
            </div>
            <span className="metric-badge">Tasks/day</span>
          </div>
        </div>

      </div>

      <hr className="analytics-divider" />

      {/* Top Priority Focus Widget */}
      <div className="today-focus-widget">
        <div className="focus-header">
          <h3>Priority focus</h3>
          <Flame size={20} className="focus-arrow-icon" style={{ color: 'var(--accent-primary)' }} />
        </div>

        <div className="focus-progress-info">
          <span className="focus-completed-label">High/Crit Completed</span>
          <span className="focus-ratio">{completedPriority}/{totalPriority}</span>
        </div>

        <div className="focus-progress-bar-bg">
          <div className="focus-progress-bar-fill" style={{ width: `${priorityPercentage}%` }}></div>
        </div>

        <div className="focus-time-row">
          <Clock size={20} className="focus-clock-icon" />
          <span className="focus-time-text">
            {totalPriority === 0 ? "No critical tasks! You're safe." : "Focus on these first!"}
          </span>
        </div>
      </div>

      <hr className="analytics-divider" />

      {/* Kalendarz */}
      <div 
        className="today-focus-widget mini-calendar-widget" 
        onClick={() => navigate('/calendar')}
        style={{ 
          cursor: 'pointer', 
          transition: 'transform 0.2s ease, background-color 0.2s ease',
          height: 'auto',
          paddingBottom: '20px'
        }}
      >
        <div className="focus-header" style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarIcon size={18} className="icon-pink" />
            <h3 style={{ margin: 0 }}>Schedule</h3>
          </div>
          <MoveUpRight size={20} className="focus-arrow-icon" />
        </div>

        <div style={{ 
          fontSize: '11px', 
          fontWeight: '700', 
          color: 'var(--text-muted)', 
          marginBottom: '14px', 
          textTransform: 'uppercase', 
          letterSpacing: '1px' 
        }}>
          {currentMonth} {currentYear}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: '8px 4px', 
          textAlign: 'center',
          fontSize: '11px',
          fontFamily: "'JetBrains Mono', monospace",
          alignItems: 'center'
        }}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, index) => (
            <div key={index} style={{ color: 'var(--text-muted)', fontWeight: '800', fontSize: '10px', paddingBottom: '2px' }}>
              {d}
            </div>
          ))}
          
          {emptySpaces.map(space => (
            <div key={`empty-${space}`} />
          ))}
          
          {daysInMonth.map(day => {
            const isToday = day === today.getDate();
            const hasTask = hasDeadline(day);

            return (
              <div 
                key={day} 
                style={{
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  backgroundColor: isToday ? 'var(--accent-primary)' : hasTask ? 'var(--calendar-task-bg)' : 'transparent',
                  color: isToday ? 'var(--calendar-selected-text)' : hasTask ? 'var(--calendar-task-text)' : 'var(--text-main)',
                  fontWeight: (isToday || hasTask) ? '800' : '400',
                  border: hasTask && !isToday ? '1px solid var(--calendar-task-border)' : 'none',
                  position: 'relative',
                  fontSize: '11px'
                }}
              >
                {day}
                {hasTask && !isToday && (
                  <div style={{
                    position: 'absolute',
                    bottom: '2px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '3px',
                    height: '3px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-primary)'
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

    </aside>
  );
};

export default RightAnalytics;