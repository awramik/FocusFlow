import React, { useMemo } from 'react';
import { CheckCircle2, Clock3, Flame, Printer, Target } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { buildWeeklyReportMetrics } from '../utils/reportMetrics';
import '../style/WeeklyReport.css';

const ProgressBar = ({ value, variant = 'pink' }) => (
  <div className={`weekly-report__progress-track weekly-report__progress-track--${variant}`}>
    <span style={{ width: `${Math.min(value, 100)}%` }} />
  </div>
);

const StatCard = ({ icon: Icon, label, value, detail }) => (
  <article className="weekly-report__stat-card">
    <div className="weekly-report__stat-head">
      <div className="weekly-report__stat-icon">
        <Icon size={18} />
      </div>
      <span>{label}</span>
    </div>
    <strong>{value}</strong>
    <p>{detail}</p>
  </article>
);

export default function WeeklyReport() {
  const { tasks, hoursData } = useTasks();
  const { currentUser } = useAuth();

  const report = useMemo(() => buildWeeklyReportMetrics(tasks), [tasks]);
  const weeklyWorkGoal = (hoursData?.workHours?.goal ?? 6) * 7;
  const weeklyFocusGoal = (hoursData?.focusedHours?.goal ?? 2) * 7;

  const workHoursPercentage = weeklyWorkGoal
    ? Math.min(100, Math.round(((hoursData?.workHours?.current ?? 0) / weeklyWorkGoal) * 100))
    : 0;

  const focusedHoursPercentage = weeklyFocusGoal
    ? Math.min(100, Math.round(((hoursData?.focusedHours?.current ?? 0) / weeklyFocusGoal) * 100))
    : 0;

  const displayName = currentUser?.firstName || currentUser?.email?.split('@')[0] || 'FocusFlow user';
  const recommendedFocus = report.remainingTasks === 0
    ? 'All scoped tasks are completed :)'
    : `${report.remainingTasks} task${report.remainingTasks === 1 ? '' : 's'} still need attention. Start with high-priority items.`;

  return (
    <main className="weekly-report">
      <section className="weekly-report__sheet">
        <header className="weekly-report__hero">
          <div>
            <span className="weekly-report__eyebrow">FocusFlow weekly report</span>
            <h1>{report.periodLabel}</h1>
            <p>Prepared for {displayName} • Generated {report.generatedAt}</p>
          </div>
          <button type="button" className="weekly-report__print-button" onClick={() => window.print()}>
            <Printer size={16} />
            Print PDF
          </button>
        </header>

        <section className="weekly-report__goal-card">
          <div>
            <span>Weekly goal completion</span>
            <strong>{report.completionPercentage}%</strong>
          </div>
          <ProgressBar value={report.completionPercentage} />
        </section>

        <section className="weekly-report__stats-grid">
          <StatCard icon={Target} label="Tasks in scope" value={report.totalTasks} detail="Created, due, or completed this week" />
          <StatCard icon={CheckCircle2} label="Completed" value={report.completedTasks} detail={`${report.completedThisWeek} completions on the chart`} />
          <StatCard icon={Clock3} label="Remaining" value={report.remainingTasks} detail={recommendedFocus} />
          <StatCard icon={Flame} label="Priority focus" value={report.activePriorityTasks} detail="Open high or critical tasks" />
        </section>

        <section className="weekly-report__chart-section">
          <div className="weekly-report__section-heading">
            <div>
              <h2>Analytics snapshot</h2>
              <p>Completed tasks per day</p>
            </div>
            <span>Avg {report.average}/day</span>
          </div>

          <div className="weekly-report__chart-wrap">
            <div className="weekly-report__chart-plot">
              <div
                className="weekly-report__average-line"
                style={{ bottom: `${Math.min(report.averagePercentage, 100)}%` }}
              />
              {report.data.map((item) => (
                <div className="weekly-report__bar-column" key={item.id}>
                  <div className={`weekly-report__bar ${item.featured ? 'weekly-report__bar--featured' : ''} ${item.tasksDone === 0 ? 'weekly-report__bar--empty' : ''}`}>
                    {item.tasksDone > 0 && (
                      <span style={{ height: `${Math.max(item.value, 8)}%` }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="weekly-report__chart-labels">
              {report.data.map((item) => (
                <div className="weekly-report__chart-label" key={`${item.id}-label`}>
                  <strong>{item.tasksDone}</strong>
                  <small>{item.day}</small>
                  <span>{item.dateLabel}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="weekly-report__details-grid">
          <article className="weekly-report__panel">
            <div className="weekly-report__section-heading weekly-report__section-heading--compact">
              <h2>Tasks overview</h2>
              <span>{report.totalTasks} total</span>
            </div>
            <div className="weekly-report__priority-list">
              <p><span className="weekly-report__dot weekly-report__dot--critical" /> Critical: {report.priorityBuckets.critical}</p>
              <p><span className="weekly-report__dot weekly-report__dot--high" /> High: {report.priorityBuckets.high}</p>
              <p><span className="weekly-report__dot weekly-report__dot--low" /> Low/other: {report.priorityBuckets.low}</p>
            </div>
          </article>

          <article className="weekly-report__panel">
            <div className="weekly-report__section-heading weekly-report__section-heading--compact">
              <h2>Focus goals</h2>
              <span>This week</span>
            </div>
            <div className="weekly-report__mini-progress">
              <p>Work hours <strong>{hoursData?.workHours?.current ?? 0}/{weeklyWorkGoal}h</strong></p>
              <ProgressBar value={workHoursPercentage} variant="pink" />
              <p>Focused hours <strong>{hoursData?.focusedHours?.current ?? 0}/{weeklyFocusGoal}h</strong></p>
              <ProgressBar value={focusedHoursPercentage} variant="purple" />
            </div>
          </article>
        </section>

        <footer className="weekly-report__footer">
          Remember, done is better than perfect
        </footer>
      </section>
    </main>
  );
}
