import React from 'react';
import { useTasks } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle, Zap, Star, MoveUpRight, Clock, Calendar as CalendarIcon } from 'lucide-react';
import '../style/RightAnalytics.css';

const RightAnalytics = () => {
  const { tasks, statsData } = useTasks();
  const navigate = useNavigate();

  // Dynamiczne obliczenia do widżetu "Today's focus"
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.status === 'Done').length || 0;
  const focusPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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

  // Pobieramy dni z deadline'ami zadań (format YYYY-MM-DD z mockData)
  const deadlineDays = new Set(
    tasks
      ?.filter(task => task.deadline)
      .map(task => task.deadline.split(' ')[0]) // wyciąga np. "2026-05-18"
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

  // Funkcja pomocnicza sprawdzająca, czy dany dzień ma deadline
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
      
      {/* 1. Analytics Header */}
      <div className="analytics-header">
        <h2>Analytics</h2>
        <p>Your productivity insights</p>
      </div>

      {/* 2. Kafelki Statystyk */}
      <div className="analytics-metrics-container">
        
        {/* Metric 1: Completion rate */}
        <div className="analytics-metric-card">
          <div className="metric-left">
            <span className="metric-label">Completion rate</span>
            <span className="metric-value">87%</span>
          </div>
          <div className="metric-right">
            <div className="progress-circle-box">
              <LoaderCircle size={24} className="icon-pink" />
            </div>
            <span className="metric-badge">+13%</span>
          </div>
        </div>

        {/* Metric 2: Focus score */}
        <div className="analytics-metric-card">
          <div className="metric-left">
            <span className="metric-label">Focus score</span>
            <span className="metric-value">94</span>
          </div>
          <div className="metric-right">
            <div className="progress-circle-box">
              <Zap size={24} className="icon-pink-light" />
            </div>
            <span className="metric-badge">+8</span>
          </div>
        </div>

        {/* Metric 3: Daily average */}
        <div className="analytics-metric-card">
          <div className="metric-left">
            <span className="metric-label">Daily average</span>
            <span className="metric-value">7</span>
          </div>
          <div className="metric-right">
            <div className="progress-circle-box">
              <Star size={24} className="icon-pink-light" />
            </div>
            <span className="metric-badge">+3</span>
          </div>
        </div>

      </div>

      {/* 3. Linia oddzielająca */}
      <hr className="analytics-divider" />

      {/* 4. Today's focus Widget */}
      <div className="today-focus-widget">
        <div className="focus-header">
          <h3>Today’s focus</h3>
          <MoveUpRight size={20} className="focus-arrow-icon" />
        </div>

        <div className="focus-progress-info">
          <span className="focus-completed-label">Completed</span>
          <span className="focus-ratio">{completedTasks}/{totalTasks}</span>
        </div>

        <div className="focus-progress-bar-bg">
          <div className="focus-progress-bar-fill" style={{ width: `${focusPercentage}%` }}></div>
        </div>

        <div className="focus-time-row">
          <Clock size={20} className="focus-clock-icon" />
          <span className="focus-time-text">{statsData?.focusTime || "4h 20m"} focused</span>
        </div>
      </div>

      {/* 5. Linia oddzielająca przed kalendarzem */}
      <hr className="analytics-divider" />

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
        {/* Nagłówek i ikona */}
        <div className="focus-header" style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarIcon size={18} className="icon-pink" />
            <h3 style={{ margin: 0 }}>Schedule</h3>
          </div>
          <MoveUpRight size={20} className="focus-arrow-icon" />
        </div>

        {/* Nazwa miesiąca */}
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

        {/* Kontener siatki z resetem i wyrównaniem */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: '8px 4px', 
          textAlign: 'center',
          fontSize: '11px',
          fontFamily: "'JetBrains Mono', monospace",
          alignItems: 'center'
        }}>
          {/* Nagłówki dni tygodnia */}
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, index) => (
            <div key={index} style={{ color: 'var(--text-muted)', fontWeight: '800', fontSize: '10px', paddingBottom: '2px' }}>
              {d}
            </div>
          ))}
          
          {/* Puste komórki wyrównujące początek miesiąca do piątku */}
          {emptySpaces.map(space => (
            <div key={`empty-${space}`} />
          ))}
          
          {/* Właściwe dni miesiąca */}
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
                {/* Kropka sygnalizująca zadanie */}
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