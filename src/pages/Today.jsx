import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Circle, 
  Clock, 
  MoreHorizontal 
} from 'lucide-react';
import RightAnalytics from '../components/RightAnalytics';

export default function Today() {
  const { tasks, updateTaskStatus } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleToggleComplete = (taskId, currentStatus) => {
    if (updateTaskStatus) {
      const newStatus = currentStatus === 'Done' ? 'To do' : 'Done';
      updateTaskStatus(taskId, newStatus);
    } else {
      console.error("Nie znaleziono funkcji updateTaskStatus w TaskContext!");
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTasks = filteredTasks.filter(task => task.status !== 'Done');
  const completedTasks = filteredTasks.filter(task => task.status === 'Done');

  return (
    <div className="dashboard-layout">
      
      {/* SEKCJA GŁÓWNA*/}
      <main className="center-content" style={{ padding: '40px', overflowY: 'auto' }}>
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: '700', margin: 0, letterSpacing: '-0.5px' }}>
              Today's tasks
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              {formattedDate}
            </p>
          </div>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px' }}>
            <Plus size={16} />
            new task
          </button>
        </div>

        {/* WYSZUKIWARKA */}
        <div style={{ position: 'relative', marginBottom: '40px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#231236',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '14px 16px 14px 48px',
              color: 'var(--text-main)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        {/* SEKCJA: ACTIVE */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>ACTIVE</span>
            <div style={{ flex: 1, borderBottom: '1px dashed var(--border)', opacity: 0.5 }}></div>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)' }}>{activeTasks.length}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeTasks.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No active tasks for today.</p>
            ) : (
              activeTasks.map(task => (
                <div key={task.id} className="card" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '16px', padding: '24px' }}>
                  <Circle 
                    size={20} 
                    onClick={() => handleToggleComplete(task.id, task.status)}
                    style={{ color: 'var(--accent-primary)', cursor: 'pointer', flexShrink: 0 }} 
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)' }}>{task.title}</div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={13} style={{ color: 'var(--text-muted)' }} /> 
                        deadline 10:30 am
                      </span>
                      {task.project && (
                        <span style={{ backgroundColor: '#231236', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', fontSize: '10px', fontWeight: '700', border: '1px solid var(--border)' }}>
                          {task.project}
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="icon-btn" style={{ padding: '4px' }}>
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SEKCJA: COMPLETED */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>COMPLETED</span>
            <div style={{ flex: 1, borderBottom: '1px dashed var(--border)', opacity: 0.5 }}></div>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)' }}>{completedTasks.length}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {completedTasks.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No completed tasks yet.</p>
            ) : (
              completedTasks.map(task => (
                <div key={task.id} className="card" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', opacity: 0.6 }}>
                  <CheckCircle2 
                    size={20} 
                    onClick={() => handleToggleComplete(task.id, task.status)}
                    style={{ color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }} 
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      {task.title}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={13} style={{ color: 'var(--text-muted)' }} /> 
                        deadline 10:30 am
                      </span>
                      {task.project && (
                        <span style={{ backgroundColor: '#231236', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', fontSize: '10px', fontWeight: '700', border: '1px solid var(--border)' }}>
                          {task.project}
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="icon-btn" style={{ padding: '4px' }}>
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <RightAnalytics />

    </div>
  );
}