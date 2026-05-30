import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { 
  ChevronRight, 
  Share2, 
  MoreHorizontal, 
  Circle, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  Paperclip, 
  Plus, 
  Download, 
  User,
  X 
} from 'lucide-react';

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, currentUser } = useTasks();
  const task = tasks?.find(t => t.id?.toString() === id?.toString());

  // LOKALNY STAN NA KOMENTARZE I INPUT
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');

  // Synchronizacja stanu z danymi z mockData przy załadowaniu zadania
  useEffect(() => {
    if (task?.comments) {
      setComments(task.comments);
    } else {
      setComments([]);
    }
  }, [task]);

  if (!task) {
    return (
      <div className="center-content" style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Task not found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>The task with ID #{id} could not be loaded.</p>
        <button onClick={() => navigate(-1)} className="btn-primary">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: "Dev Stranger",
      text: newCommentText.trim(),
      date: "Just now"
    };

    setComments([...comments, newComment]);
    setNewCommentText('');
  };

  // Obsługa wysyłania przez naciśnięcie klawisza Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddComment();
    }
  };

  const getPriorityClass = (priority) => {
    const p = priority?.toUpperCase();
    if (p === 'CRIT' || p === 'CRITICAL') return 'priority-tag critical';
    if (p === 'HIGH') return 'priority-tag high';
    return 'priority-tag low';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'NOT SET';
    try {
      const cleanStr = String(dateStr).split(' ')[0];
      const date = new Date(cleanStr);
      if (isNaN(date.getTime())) return String(dateStr).toUpperCase();
      return date.toLocaleDateString('en-US', { month: 'SHORT', day: 'numeric', year: 'numeric' }).toUpperCase();
    } catch (e) {
      return 'NOT SET';
    }
  };

  return (
    <div className="center-content kanban-page">

      <div className="flex-between" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Dashboard</span>
          <ChevronRight size={14} style={{ color: 'var(--text-muted)', opacity: 0.6 }} />
          <span style={{ color: 'var(--text-main)', fontWeight: '750' }}>{task.title}</span>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '8px', fontSize: '12px', letterSpacing: '0.5px' }}>
            <Share2 size={14} />
            SHARE
          </button>
          <button className="icon-btn" style={{ padding: '6px' }}>
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      <div className="kanban-board-grid" style={{ gridTemplateColumns: '1fr 320px', gap: '40px' }}>
        
        {/* LEWA KOLUMNA */}
        <div className="column-tasks-container" style={{ gap: '32px' }}>
          
          {/* NAGŁÓWEK */}
          <div>
            <h1 className="kanban-title" style={{ fontSize: '36px', marginBottom: '16px', letterSpacing: '0.5px' }}>
              {task.title || 'Untitled Task'}
            </h1>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span className="filter-chip active" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'default', padding: '4px 14px', borderRadius: '20px', textTransform: 'uppercase' }}>
                <Circle size={10} fill="currentColor" /> {task.status || 'To do'}
              </span>
              <span className={getPriorityClass(task.priority)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px' }}>
                {(task.priority === 'CRIT' || task.priority === 'critical') && <AlertTriangle size={12} />}
                {task.priority || 'LOW'}
              </span>
              <span className="deadline" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
                <Calendar size={14} /> {task.deadline ? String(task.deadline).toUpperCase() : 'NO DEADLINE'}
              </span>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h2 className="category-tag" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={14} /> Description
            </h2>
            <div style={{ backgroundColor: '#130823', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#1c0c30', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }}></span>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></span>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
                </div>
                <span className="category-tag" style={{ fontSize: '11px', textTransform: 'none' }}>README.md</span>
              </div>
              <div style={{ padding: '24px', fontFamily: 'Space Mono, monospace', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                <span style={{ color: 'var(--accent-primary)' }}>const</span> project = <span style={{ color: '#38BDF8' }}>"{task.project || 'FocusFlow'}"</span>;<br/>
                <span style={{ color: 'rgba(255,255,255,0.25)' }}>// task_details_output</span><br/>
                <div style={{ color: 'var(--text-main)', marginTop: '8px', fontFamily: 'inherit' }}>
                  {task.description || task.title || "// No description provided."}
                </div>
              </div>
            </div>
          </div>

          {/* ATTACHMENTS */}
          <div>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <h2 className="category-tag" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Paperclip size={14} /> Attachments <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({task.attachments?.length || 0})</span>
              </h2>
              <button className="icon-btn" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--accent-primary)', fontWeight: '700' }}>
                <Plus size={14} /> Add Attachment
              </button>
            </div>

            {task.attachments && task.attachments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {task.attachments.map(file => (
                  <div key={file.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '380px', margin: '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ backgroundColor: 'var(--bg-main)', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', border: '1px solid var(--border)', color: 'var(--accent-primary)' }}>
                        {file.name?.split('.').pop()?.toUpperCase() || 'FILE'}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>{file.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{file.size}</div>
                      </div>
                    </div>
                    <button className="icon-btn" style={{ padding: '6px' }}>
                      <Download size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>No attachments uploaded.</p>
            )}
          </div>

          {/* SEKCJA KOMENTARZY*/}
          <div>
            <h2 className="category-tag" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={14} style={{ transform: 'rotate(45deg)' }} /> Activity & Comments <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({comments.length})</span>
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Lista komentarzy pobierana ze stanu lokalnego */}
              {comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id} style={{ 
                    backgroundColor: '#130823', 
                    border: '1px solid var(--border)', 
                    borderRadius: '12px', 
                    padding: '16px'
                  }}>
                    <div className="flex-between" style={{ marginBottom: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: '750', color: 'var(--accent-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
                        @{comment.author.replace(/\s+/g, '').toLowerCase()}
                      </span>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {comment.date}
                        </span>

                        {comment.author === "Dev Stranger" && (
                          <button
                            onClick={() => setComments(comments.filter(c => c.id !== comment.id))}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#EF4444',
                              fontSize: '10px',
                              fontWeight: '700',
                              fontFamily: "'JetBrains Mono', monospace",
                              cursor: 'pointer',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              letterSpacing: '0.5px',
                              transition: 'all 0.2s ease',
                              backgroundColor: 'rgba(239, 68, 68, 0.05)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                              e.currentTarget.style.textDecoration = 'underline';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
                              e.currentTarget.style.textDecoration = 'none';
                            }}
                          >
                            DELETE
                          </button>
                        )}
                      </div>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5', margin: 0 }}>
                      {comment.text}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', margin: '0 0 8px 0' }}>
                  No comments yet. Start the discussion below.
                </p>
              )}

              {/* Formularz dodawania nowego komentarza */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                alignItems: 'center', 
                backgroundColor: '#1c0c30', 
                border: '1px solid var(--border)', 
                borderRadius: '12px', 
                padding: '8px 12px 8px 16px',
                marginTop: '8px'
              }}>
                <input 
                  type="text" 
                  placeholder="Write a comment..." 
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{ 
                    flex: 1, 
                    background: 'none', 
                    border: 'none', 
                    outline: 'none', 
                    color: 'var(--text-main)', 
                    fontSize: '13px',
                    fontFamily: "'JetBrains Mono', monospace"
                  }} 
                />
                <button 
                  onClick={handleAddComment}
                  className="btn-primary" 
                  style={{ 
                    padding: '6px 14px', 
                    borderRadius: '8px', 
                    fontSize: '11px', 
                    fontWeight: '700', 
                    letterSpacing: '0.5px' 
                  }}
                >
                  SEND
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* PRAWY PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* ASSIGNEES */}
          <div className="card" style={{ margin: '0' }}>
            <span className="category-tag" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', fontSize: '11px' }}>
              <User size={12} /> ASSIGNEES ({currentUser?.length || 0})
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {currentUser && currentUser.map(user => (
                <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--accent-purple)', 
                    border: '1px solid var(--border)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '12px', 
                    fontWeight: '700',
                    flexShrink: 0 
                  }}>
                    {user.avatarInitials}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '750', color: 'var(--text-main)' }}>
                      {user.firstName} {user.lastName}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {user.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DATES & TIME */}
          <div className="card" style={{ margin: '0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <span className="category-tag" style={{ display: 'block', marginBottom: '6px', fontSize: '11px' }}>START DATE</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  {formatDate(task.startDate)}
                </span>
              </div>
              <div>
                <span className="category-tag" style={{ display: 'block', marginBottom: '6px', fontSize: '11px' }}>END DATE</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-primary)' }}>
                  {formatDate(task.endDate)}
                </span>
              </div>
            </div>
            
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <span className="category-tag" style={{ display: 'block', marginBottom: '6px', fontSize: '11px' }}>ESTIMATED TIME</span>
              <span style={{ fontSize: '14px', fontWeight: '700' }}>
                {task.estimate || 'Not estimated'}
              </span>
            </div>
          </div>

          {/* TAGS */}
          <div className="card" style={{ margin: '0' }}>
            <span className="category-tag" style={{ display: 'block', marginBottom: '16px', fontSize: '11px' }}>TAGS</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {task.tags && task.tags.length > 0 ? (
                task.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className={`priority-tag ${idx % 2 === 0 ? 'low' : 'high'}`} 
                    style={{ textTransform: 'uppercase', padding: '4px 10px', fontSize: '11px', background: idx % 2 === 0 ? '#111827' : undefined }}
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No tags</span>
              )}
            </div>
          </div>

          {/* PRZYCISK ZAMYKANIA DETAILS */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px', paddingRight: '4px' }}>
            <button 
              onClick={() => navigate(-1)} 
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 0',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--accent-primary)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                opacity: 0.8,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.8';
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              <X size={12} />
              Close details
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}