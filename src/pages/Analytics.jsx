import React, { useEffect, useState } from 'react';
import { BadgeAlert, BadgeCheck, Flame, Lock, Play, RefreshCcwDot, Square, Timer } from 'lucide-react';
import '../style/Analytics.css';

const weeklyData = [
  { day: 'MON', value: 52, tasksDone: 7 },
  { day: 'TUE', value: 35, tasksDone: 4 },
  { day: 'WED', value: 74, tasksDone: 10, featured: true },
  { day: 'THU', value: 43, tasksDone: 6 },
  { day: 'FRI', value: 18, tasksDone: 2 },
  { day: 'SAT', value: 47, tasksDone: 5 },
  { day: 'SUN', value: 86, tasksDone: 12, featured: true },
];

const achievements = [
  {
    icon: BadgeCheck,
    title: 'First steps',
    text: 'Welcome to FocusFlow, where all your tasks come true! First task logged successfully :)',
    status: 'Earned',
    date: '02.05.2026',
  },
  {
    icon: Flame,
    title: 'Streak master',
    text: "Continuous high performance maintained for 7 days - you killin' it girl!",
    status: 'Earned',
    date: '09.05.2026',
  },
];

const weeklyAverage = Math.round(
  weeklyData.reduce((sum, item) => sum + item.value, 0) / weeklyData.length
);

function AnalyticsRightPanel() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPomodoroTipOpen, setIsPomodoroTipOpen] = useState(false);

  useEffect(() => {
    if (!isRunning) return undefined;

    const intervalId = window.setInterval(() => {
      setSecondsLeft((currentSeconds) => {
        if (currentSeconds <= 1) {
          setIsRunning(false);
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning]);

  const timerMinutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const timerSeconds = (secondsLeft % 60).toString().padStart(2, '0');

  return (
    <aside 
      className="analytics-page__right-panel"
      style={{
        flex: '0 0 320px',
        width: '320px',
        minWidth: '320px',
        padding: '42px 24px 40px 24px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}
    >
      {/* NAGŁÓWEK: Linia dopasowana do środkowego panelu */}
      <header 
        className="analytics-page__right-header" 
        style={{ 
          boxSizing: 'border-box',
          marginBottom: '12px',              // Zmniejszony z 24px na 12px, żeby podciągnąć kafelki w górę
          borderBottom: '1px solid #582E7E', 
          marginLeft: '-24px',               
          marginRight: '-24px',              
          paddingLeft: '24px',               
          paddingRight: '24px',
          width: 'calc(100% + 48px)',        
          minHeight: '80px',                 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: '12px',
          paddingBottom: '12px'
        }}
      >
        <h2 style={{ margin: '0 0 4px 0' }}>Tips & tricks</h2>
        <p style={{ margin: 0 }}>Improve your focus and achieve your goals</p>
      </header>

      {/* KAFELEK PODPOWIEDZI */}
      <button
        type="button"
        className={`analytics-page__tip-card ${isPomodoroTipOpen ? 'analytics-page__tip-card--expanded' : ''}`}
        aria-expanded={isPomodoroTipOpen}
        onClick={() => setIsPomodoroTipOpen((isOpen) => !isOpen)}
        style={{
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          marginTop: '0px'                   // Gwarancja braku niechcianego odepchnięcia od linii
        }}
      >
        <div className="analytics-page__tip-title" style={{ width: '100%' }}>
          <RefreshCcwDot size={20} />
          <span>Pomodoro technique</span>
        </div>
        <p style={{ width: '100%', margin: '8px 0 0 0' }}>
          Use focused 25-minute sprints followed by a 5-minute break
        </p>

        <div 
          className="analytics-page__tip-details" 
          aria-hidden={!isPomodoroTipOpen}
          style={{ width: '100%' }}
        >
          <p style={{ width: '100%' }}>
            Set a timer, focus completely, and avoid interruptions during the 25 minutes. After
            the break, repeat. Four sprints in, take a longer 15-30 minute break.
          </p>
          <span>{isPomodoroTipOpen ? 'show less details' : 'show details'}</span>
        </div>
      </button>

      <section className="analytics-page__timer-card" aria-label="Pomodoro timer">
        <div className="analytics-page__timer-actions">
          <button
            type="button"
            aria-label={isRunning ? 'Stop timer' : secondsLeft === 0 ? 'Restart timer' : 'Start timer'}
            aria-pressed={isRunning}
            onClick={() => {
              if (isRunning) {
                setIsRunning(false);
                return;
              }

              if (secondsLeft === 0) {
                setSecondsLeft(25 * 60);
              }

              setIsRunning(true);
            }}
          >
            {isRunning ? <Square size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
          </button>
        </div>
        <Timer size={36} className="analytics-page__timer-icon" />
        <span className="analytics-page__timer-value">
          {timerMinutes}:{timerSeconds}
        </span>
      </section>
    </aside>
  );
}

export default function Analytics() {
  return (
    <div className="analytics-page">
      <main className="analytics-page__content">
        <header className="analytics-page__header">
          <h1>Analytics</h1>
          <p>Learn about your focus style</p>
        </header>

        <section className="analytics-page__chart-card" aria-label="Weekly performance chart">
          <div className="analytics-page__chart-top">
            <span>Weekly performance</span>
            <span className="analytics-page__legend">
              <span aria-hidden="true" />
              Number of completed tasks
            </span>
          </div>

          <div className="analytics-page__chart-frame">
            <div
              className="analytics-page__bars"
              style={{ '--average-position': `${100 - weeklyAverage}%` }}
            >
              <div className="analytics-page__average-line" aria-hidden="true" />
              <div className="analytics-page__average-label" aria-hidden="true">
                Your average is 6.8 tasks/day
              </div>

              {weeklyData.map((item, index) => {
                const shiftStrength = [0.3, 0.45, 0.65, 1, 1, 0.65, 0.45][index];
                const shiftDirection = index < 4 ? -1 : 1;

                return (
                  <div
                    key={item.day}
                    className={`analytics-page__bar ${item.featured ? 'analytics-page__bar--featured' : ''}`}
                    style={{
                      height: `${item.value}%`,
                      '--bar-hover-shift': shiftDirection * shiftStrength,
                    }}
                    title={`${item.day}: ${item.tasksDone} tasks done`}
                  >
                    <span className="analytics-page__bar-value">{item.tasksDone}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="analytics-page__chart-footer">
            <span>Tasks done</span>
            <span>May 02 - May 09</span>
          </div>
        </section>

        <section className="analytics-page__achievements-section">
          <div className="analytics-page__section-heading">
            <h2>Achievements</h2>
            <span>Milestones</span>
          </div>

          <div className="analytics-page__achievements">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;

              return (
                <article key={achievement.title} className="analytics-page__achievement-card">
                  <div className="analytics-page__achievement-top">
                    <div className="analytics-page__achievement-icon">
                      <Icon size={22} fill={achievement.highlighted ? 'currentColor' : 'none'} />
                    </div>

                  </div>

                  <h3>{achievement.title}</h3>
                  <p>{achievement.text}</p>

                  <footer className="analytics-page__achievement-footer">
                    <span>
                      Status: <strong>{achievement.status}</strong>
                    </span>
                    <time dateTime={achievement.date.split('.').reverse().join('-')}>
                      {achievement.date}
                    </time>
                  </footer>
                </article>
              );
            })}

            <article className="analytics-page__achievement-card analytics-page__achievement-card--locked">
              <div className="analytics-page__achievement-lock">
                <BadgeAlert size={24} />
              </div>
              <h3>Crisis averted</h3>
              <p>It's a race against time ! Meet 5 deadlines before the time runs out..</p>
              <div className="analytics-page__locked-progress" aria-hidden="true">
                <span />
              </div>
              <footer className="analytics-page__locked-footer">
                <span>Progress 3/5</span>
                <span className="analytics-page__locked-status">
                  <Lock size={12} />
                  Locked
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