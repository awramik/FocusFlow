import React from 'react';
import { useTasks } from '../context/TaskContext';
import { LoaderCircle, Zap, Star, MoveUpRight, Clock } from 'lucide-react';
import '../style/RightAnalytics.css';

const RightAnalytics = () => {
  const { tasks, statsData } = useTasks();

  // Dynamiczne obliczenia do widżetu "Today's focus"
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.status === 'done').length || 0;
  const focusPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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
          <span className="focus-time-text">{statsData?.focusTime || "6h 13 minutes"} focused</span>
        </div>
      </div>

    </aside>
  );
};

export default RightAnalytics;