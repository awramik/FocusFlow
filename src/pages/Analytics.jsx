import React from 'react';
import { BadgeCheck, BarChart3, Flame, Pause, Play, RotateCcw, Timer } from 'lucide-react';
import congratsImage from '../assets/congrats.png';
import '../style/Analytics.css';

const weeklyData = [
  { day: 'MON', value: 52 },
  { day: 'TUE', value: 35 },
  { day: 'WED', value: 74, featured: true },
  { day: 'THU', value: 43 },
  { day: 'FRI', value: 18 },
  { day: 'SAT', value: 47 },
  { day: 'SUN', value: 86, featured: true },
];

const achievements = [
  {
    icon: BadgeCheck,
    title: 'First steps',
    text: 'Welcome to FocusFlow, where all your tasks come true! First task logged successfully :)',
    highlighted: true,
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
  return (
    <aside className="analytics-page__right-panel">
      <header className="analytics-page__right-header">
        <h2>Tips & tricks</h2>
        <p>Improve your focus and achieve your goals</p>
      </header>

      <section className="analytics-page__tip-card">
        <div className="analytics-page__tip-title">
          <RotateCcw size={20} />
          <span>Pomodoro technique</span>
        </div>
        <p>Use focused 25-minute sprints followed by a 5-minute break</p>
      </section>

      <section className="analytics-page__timer-card" aria-label="Pomodoro timer">
        <div className="analytics-page__timer-actions">
          <button type="button" aria-label="Pause timer">
            <Pause size={13} />
          </button>
          <button type="button" aria-label="Start timer">
            <Play size={13} />
          </button>
        </div>
        <Timer size={36} className="analytics-page__timer-icon" />
        <span className="analytics-page__timer-value">24:55</span>
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
              Completion percent
            </span>
          </div>

          <div
            className="analytics-page__bars"
            style={{ '--average-position': `${100 - weeklyAverage}%` }}
          >
            <div className="analytics-page__average-line" aria-hidden="true" />
            <div className="analytics-page__average-label" aria-hidden="true">
              This is
              <br />
              your
              <br />
              average
            </div>

            {weeklyData.map((item, index) => (
              <div
                key={item.day}
                className={`analytics-page__bar ${item.featured ? 'analytics-page__bar--featured' : ''}`}
                data-side={index < 4 ? 'left' : 'right'}
                style={{ height: `${item.value}%` }}
                title={`${item.day}: ${item.value}%`}
              />
            ))}
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
                <BarChart3 size={24} />
              </div>
              <h3>Data awaits</h3>
              <p>Stay in focus mode to unlock deeper weekly insights.</p>
              <div className="analytics-page__locked-progress" aria-hidden="true">
                <span />
              </div>
            </article>
          </div>
        </section>
      </main>

      <AnalyticsRightPanel />
    </div>
  );
}
