import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function TaskDetails({ tasks }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return (
      <div className="center-content">
        <h2 style={{ marginBottom: '16px' }}>Task not found</h2>
        <button onClick={() => navigate('/kanban')} className="btn-primary">
          Return to Kanban
        </button>
      </div>
    );
  }

  const getPriorityClass = (priority) => {
    if (priority === 'CRIT') return 'priority-tag critical';
    if (priority === 'HIGH') return 'priority-tag high';
    return 'priority-tag low';
  };

  return (
    <div className="center-content kanban-page">
      
      <div className="flex-between" style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Dashboard</span>
          <span style={{ margin: '0 8px' }}>&gt;</span>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/kanban')}>Kanban</span>
          <span style={{ margin: '0 8px' }}>&gt;</span>
          <span style={{ color: 'var(--text-main)', fontWeight: '750' }}>{task.title}</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn-primary" style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '12px', letterSpacing: '0.5px' }}>
            SHARE
          </button>
          <button className="icon-btn" style={{ fontSize: '18px' }}>•••</button>
        </div>
      </div>

      <div className="kanban-board-grid" style={{ gridTemplateColumns: '1fr 320px', gap: '40px' }}>
        
        <div className="column-tasks-container" style={{ gap: '32px' }}>
          
          <div>
            <h1 className="kanban-title" style={{ fontSize: '36px', marginBottom: '16px', letterSpacing: '0.5px' }}>
              {task.title}
            </h1>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span className="filter-chip active" style={{ cursor: 'default', padding: '4px 14px', borderRadius: '20px', textTransform: 'uppercase' }}>
                ⚫ {task.status}
              </span>
              <span className={getPriorityClass(task.priority)} style={{ padding: '4px 12px', borderRadius: '20px' }}>
                {task.priority === 'CRIT' ? '⚠️ ' : ''}{task.priority}
              </span>
              <span className="deadline" style={{ marginLeft: '6px' }}>
                📅 MAY 05, 2026
              </span>
            </div>
          </div>

          <div>
            <h2 className="category-tag" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📄 Description
            </h2>
            <div style={{ backgroundColor: '#130823', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#1c0c30', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }}></span>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></span>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
                </div>
                <span className="category-tag" style={{ fontSize: '11px', lowercase: 'none' }}>README.md</span>
              </div>
              <div style={{ padding: '24px', fontFamily: 'Space Mono, monospace', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                <span style={{ color: 'var(--accent-primary)' }}>const</span> project = <span style={{ color: '#38BDF8' }}>"{task.project}"</span>;<br/>
                <span style={{ color: 'rgba(255,255,255,0.25)' }}>// views_completed_status</span><br/>
                01  dashboard     <span style={{ color: '#34D399' }}>[DONE]</span><br/>
                02  analytics     <span style={{ color: '#34D399' }}>[DONE]</span><br/>
                03  settings      <span style={{ color: '#34D399' }}>[DONE]</span><br/>
                04  all_tasks     <span style={{ color: '#F59E0B' }}>[IN_PROGRESS]</span><br/>
                05  kanban_view   <span style={{ color: 'var(--accent-primary)' }}>[PENDING]</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <h2 className="category-tag">📎 Attachments <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>(1)</span></h2>
              <button className="icon-btn" style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: '700' }}>+ Add Attachment</button>
            </div>
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '380px', margin: '0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ backgroundColor: 'var(--bg-main)', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', border: '1px solid var(--border)', color: 'var(--accent-primary)' }}>FIG</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>FigmaViews.fig</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>12.4 MB</div>
                </div>
              </div>
              <button className="icon-btn" style={{ fontSize: '16px' }}>📥</button>
            </div>
          </div>

          <div>
            <h2 className="category-tag" style={{ marginBottom: '16px' }}>💬 Activity & Comments</h2>
            <div className="card" style={{ margin: '0', padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>💬</div>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>No conversation yet</div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0' }}>Be the first to comment on this task and get the discussion started.</p>
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="card" style={{ margin: '0' }}>
            <span className="category-tag" style={{ display: 'block', marginBottom: '16px', fontSize: '11px' }}>ASSIGNEE</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent-purple)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700' }}>
                WA
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700' }}>Wiktoria Awramik</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Project Manager</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ margin: '0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <span className="category-tag" style={{ display: 'block', marginBottom: '6px', fontSize: '11px' }}>START DATE</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Apr 28, 2026</span>
              </div>
              <div>
                <span className="category-tag" style={{ display: 'block', marginBottom: '6px', fontSize: '11px' }}>END DATE</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-primary)' }}>MAY 5, 2026</span>
              </div>
            </div>
            
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <span className="category-tag" style={{ display: 'block', marginBottom: '6px', fontSize: '11px' }}>ESTIMATED TIME</span>
              <span style={{ fontSize: '14px', fontWeight: '700' }}>20 hours</span>
            </div>
          </div>

          <div className="card" style={{ margin: '0' }}>
            <span className="category-tag" style={{ display: 'block', marginBottom: '16px', fontSize: '11px' }}>TAGS</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span className="priority-tag low" style={{ textTransform: 'uppercase', padding: '4px 10px', fontSize: '11px', background: '#111827' }}>DESIGN</span>
              <span className="priority-tag critical" style={{ textTransform: 'uppercase', padding: '4px 10px', fontSize: '11px' }}>V3.1</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/kanban')} 
            className="btn-filter" 
            style={{ 
              width: '100%', 
              justifyContent: 'center', 
              padding: '16px', 
              borderRadius: '12px', 
              fontWeight: '700', 
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border)'
            }}
          >
            Return to Kanban
          </button>

        </div>

      </div>
    </div>
  );
}