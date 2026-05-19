import React, { useEffect, useState } from 'react';
import { BadgeAlert, BadgeCheck, Flame, Lock, Pause, Play, RefreshCcwDot, Timer } from 'lucide-react';
import congratsImage from '../assets/congrats.png';
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
    congratulated: true,
  },
  {
    icon: Flame,
    title: 'Streak master',
    text: "Continuous high performance maintained for 7 days - you killin' it girl!",
    status: 'Earned',
    date: '09.05.2026',
    congratulated: true,
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
    <aside className="analytics-page__right-panel">
      <header className="analytics-page__right-header">
        <h2>Tips & tricks</h2>
        <p>Improve your focus and achieve your goals</p>
      </header>

      <button
        type="button"
        className={`analytics-page__tip-card ${isPomodoroTipOpen ? 'analytics-page__tip-card--expanded' : ''}`}
        aria-expanded={isPomodoroTipOpen}
        onClick={() => setIsPomodoroTipOpen((isOpen) => !isOpen)}
      >
        <div className="analytics-page__tip-title">
          <RefreshCcwDot size={20} />
          <span>Pomodoro technique</span>
        </div>
        <p>Use focused 25-minute sprints followed by a 5-minute break</p>

        <div className="analytics-page__tip-details" aria-hidden={!isPomodoroTipOpen}>
          <p>
            Set a timer, focus completely, and avoid interruptions during the 25 minutes. After
            the break, repeat. Four sprints in, take a longer 15-30 minute break.
          </p>
          <span>{isPomodoroTipOpen ? 'show less details' : 'show details'}</span>
        </div>
      </button>

      <section className="analytics-page__timer-card" aria-label="Pomodoro timer">
        <div className="analytics-page__timer-actions">
          <button type="button" aria-label="Pause timer" onClick={() => setIsRunning(false)}>
            <Pause size={13} />
          </button>
          <button
            type="button"
            aria-label={secondsLeft === 0 ? 'Restart timer' : 'Start timer'}
            onClick={() => {
              if (secondsLeft === 0) {
                setSecondsLeft(25 * 60);
              }

              setIsRunning(true);
            }}
          >
            <Play size={13} />
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

                    {achievement.congratulated && (
                      <img
                        className="analytics-page__congrats"
                        src={congratsImage}
                        alt="Congrats"
                      />
                    )}
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
