import React, { useState, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { BadgeAlert, BadgeCheck, Flame, Lock, Play, RefreshCcwDot, Square, Timer, Trophy, Zap } from 'lucide-react';
import '../style/Analytics.css';

// Panel boczny z poradą i stoperem 
function AnalyticsRightPanel() {
  const { timeLeft, isRunning, handleStartPause } = useTasks();
  const [isPomodoroTipOpen, setIsPomodoroTipOpen] = useState(false);

  const timerMinutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const timerSeconds = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <aside className="analytics-page__right-panel">
      <header className="analytics-page__right-header">
        <h2>Tips & tricks</h2>
        <p>Improve your focus and achieve your goals</p>
      </header>

      <button
        type="button"
        className={`analytics-page__tip-card ${isPomodoroTipOpen ? 'analytics-page__tip-card--expanded' : ''}`}
        onClick={() => setIsPomodoroTipOpen((isOpen) => !isOpen)}
      >
        <div className="analytics-page__tip-title">
          <RefreshCcwDot size={20} />
          <span>Pomodoro technique</span>
        </div>
        <p>Use focused 25-minute sprints followed by a 5-minute break</p>
        <div className="analytics-page__tip-details" aria-hidden={!isPomodoroTipOpen}>
          <p>Set a timer, focus completely, and avoid interruptions.</p>
          <span>{isPomodoroTipOpen ? 'show less details' : 'show details'}</span>
        </div>
      </button>

      <section className="analytics-page__timer-card">
        <div className="analytics-page__timer-actions">
          <button type="button" onClick={handleStartPause}>
            {isRunning ? <Square size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
          </button>
        </div>
        <Timer size={36} className="analytics-page__timer-icon" />
        <span className="analytics-page__timer-value">{timerMinutes}:{timerSeconds}</span>
      </section>
    </aside>
  );
}

export default function Analytics() {
  const { tasks } = useTasks();
  const { currentUser } = useAuth();

  // DYNAMICZNE WYLICZANIE DANYCH DO WYKRESU
  const weeklyStats = useMemo(() => {
    if (!tasks) return { data: [], average: '0.0', averagePercentage: 0 };

    const completedTasks = tasks.filter(t => (t.status === 'Done' || t.status === 'done') && t.completedAt);
    
    const last7Days = [];
    let maxTasksInDay = 0;
    let totalTasksThisWeek = 0;

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`; 
      
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const tasksDone = completedTasks.filter(t => {
        if (!t.completedAt) return false;
        const taskDate = new Date(t.completedAt); 
        const tY = taskDate.getFullYear();
        const tM = String(taskDate.getMonth() + 1).padStart(2, '0');
        const tD = String(taskDate.getDate()).padStart(2, '0');
        return `${tY}-${tM}-${tD}` === dateStr;
      }).length;
      
      if (tasksDone > maxTasksInDay) maxTasksInDay = tasksDone;
      totalTasksThisWeek += tasksDone;

      last7Days.push({
        id: dateStr,
        day: dayName,
        dateLabel,
        tasksDone,
        value: 0,
        featured: false
      });
    }

    const chartScaleMax = Math.max(maxTasksInDay, 5);
    
    const finalData = last7Days.map(item => ({
      ...item,
      value: (item.tasksDone / chartScaleMax) * 100,
      featured: item.tasksDone === maxTasksInDay && maxTasksInDay > 0
    }));

    // Klasyczna średnia dla wykresu = liczba zadań / 7 dni
    const avg = totalTasksThisWeek / 7;

    return {
      data: finalData,
      average: avg.toFixed(1),
      averagePercentage: (avg / chartScaleMax) * 100
    };
  }, [tasks]);

  // DYNAMICZNE OSIĄGNIĘCIA
  const completedCount = tasks?.filter(t => t.status === 'Done' || t.status === 'done').length || 0;
  const totalXP = currentUser?.ferdynand?.currentXP || 0;
  const focusHours = currentUser?.stats?.focusedHoursCurrent || 0;

  const achievements = [
    {
      icon: BadgeCheck,
      title: 'First steps',
      text: 'Welcome to FocusFlow! First task logged successfully :)',
      status: completedCount >= 1 ? 'Earned' : 'Locked',
      date: completedCount >= 1 ? 'Unlocked' : '0/1',
      earned: completedCount >= 1
    },
    {
      icon: Flame,
      title: 'Task Crusher',
      text: "You've completed 5 tasks. Keep the momentum going!",
      status: completedCount >= 5 ? 'Earned' : 'In Progress',
      date: completedCount >= 5 ? 'Unlocked' : `${completedCount}/5`,
      earned: completedCount >= 5
    },
    {
      icon: Zap,
      title: 'XP Milestone',
      text: "Reach 500 XP to prove your consistency.",
      status: totalXP >= 500 ? 'Earned' : 'In Progress',
      date: totalXP >= 500 ? 'Unlocked' : `${totalXP}/500 XP`,
      earned: totalXP >= 500
    }
  ];

  return (
    <div className="analytics-page">
      <main className="analytics-page__content">
        <header className="analytics-page__header">
          <h1>Analytics</h1>
          <p>Learn about your focus style</p>
        </header>

        <section className="analytics-page__chart-card">
          <div className="analytics-page__chart-top">
            <span>Weekly performance</span>
            <span className="analytics-page__legend"><span />Number of completed tasks</span>
          </div>
          <div className="analytics-page__chart-frame">
            <div className="analytics-page__bars" style={{ '--average-position': `${100 - weeklyStats.averagePercentage}%` }}>
              
              <div 
                className="analytics-page__average-line" 
                style={{ opacity: 1, transform: 'scaleX(1)' }} 
              />
              
              {/* Napis na linii */}
              <div 
                className="analytics-page__average-label"
                style={{ 
                  top: 'var(--average-position)', 
                  opacity: 1, 
                  transform: 'translate(-50%, calc(-100% - 8px))',
                  width: 'auto',
                  minWidth: '120px',
                  color: 'var(--analytics-chart-average)',
                  backgroundColor: 'var(--analytics-card-bg)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  border: '1px solid var(--border)',
                  zIndex: 10
                }}
              >
                Avg: {weeklyStats.average} tasks/day
              </div>
              
              {weeklyStats.data.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`analytics-page__bar ${item.featured ? 'analytics-page__bar--featured' : ''}`}
                  style={{ height: `${item.value}%`, '--bar-hover-shift': index < 4 ? -0.5 : 0.5 }}
                >
                  <span className="analytics-page__bar-value">{item.tasksDone}</span>
                </div>
              ))}
            </div>
            <div className="analytics-page__chart-labels">
              {weeklyStats.data.map((item) => (
                <div className="analytics-page__chart-label" key={`${item.id}-label`}>
                  <small>{item.day}</small>
                  <span>{item.dateLabel}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="analytics-page__achievements-section">
          <div className="analytics-page__section-heading">
            <h2>Achievements</h2>
            <span>Milestones</span>
          </div>
          
          <div className="analytics-page__achievements">
            {achievements.map((achievement) => (
              <article 
                key={achievement.title} 
                className={`analytics-page__achievement-card ${!achievement.earned ? 'analytics-page__achievement-card--locked' : ''}`}
              >
                <div className="analytics-page__achievement-top">
                  <div className="analytics-page__achievement-icon">
                    <achievement.icon size={22} />
                  </div>
                </div>
                <h3>{achievement.title}</h3>
                <p>{achievement.text}</p>
                <footer className="analytics-page__achievement-footer">
                  <span>Status: <strong>{achievement.status}</strong></span>
                  <time>{achievement.date}</time>
                </footer>
              </article>
            ))}

            <article className={`analytics-page__achievement-card ${focusHours < 10 ? 'analytics-page__achievement-card--locked' : ''}`}>
              <div className="analytics-page__achievement-lock">
                <BadgeAlert size={24} />
              </div>
              <h3>Crisis averted</h3>
              <p>Maintain deep focus for 10 hours total.</p>
              <div className="analytics-page__locked-progress">
                <span style={{ width: `${Math.min((focusHours / 10) * 100, 100)}%` }} />
              </div>
              <footer className="analytics-page__locked-footer">
                <span>Progress {parseFloat(focusHours).toFixed(1)}/10h</span>
                <span className="analytics-page__locked-status">
                  <Lock size={12} /> {focusHours >= 10 ? 'Unlocked' : 'Locked'}
                </span>
              </footer>
            </article>
          </div>
        </section>
      </main>

      <AnalyticsRightPanel />
    </div>
  );
}
