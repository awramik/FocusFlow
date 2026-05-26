import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Circle, 
  Clock, 
  MoreHorizontal,
  Folder,
  X
} from 'lucide-react';
import RightAnalytics from '../components/RightAnalytics';

export default function Today() {
  const { tasks, updateTaskStatus } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // STAN DLA WIZUALIZACJI NOWYCH ZADAŃ ORAZ FORMULARZA
  const [localTasks, setLocalTasks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('LOW');
  const [newProject, setNewProject] = useState('FocusFlow');
  const [newDeadline, setNewDeadline] = useState('');

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleToggleComplete = (taskId, currentStatus) => {
    // Sprawdzamy najpierw, czy zadanie jest z lokalnego stanu frontendowego
    if (String(taskId).startsWith('local-')) {
      setLocalTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: t.status === 'Done' ? 'To do' : 'Done' } : t
      ));
      return;
    }

    // Jeśli nie lokalne, standardowo aktualizujemy globalny kontekst
    if (updateTaskStatus) {
      const newStatus = currentStatus === 'Done' ? 'To do' : 'Done';
      updateTaskStatus(taskId, newStatus);
    } else {
      console.error("Nie znaleziono funkcji updateTaskStatus w TaskContext!");
    }
  };

  const getPriorityClass = (priority) => {
    if (priority === 'CRIT') return 'priority-tag critical';
    if (priority === 'HIGH') return 'priority-tag high';
    return 'priority-tag low';
  };

  // Łączymy zadania z Contextu z naszymi lokalnymi nowo dodanymi zadaniami frontendowymi
  const allCombinedTasks = [...localTasks, ...tasks];

  const filteredTasks = allCombinedTasks.filter(task =>
    task.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTasks = filteredTasks.filter(task => task.status !== 'Done');
  const completedTasks = filteredTasks.filter(task => task.status === 'Done');

  // Funkcja obsługująca zatwierdzenie formularza i stworzenie karty
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTaskObj = {
      id: `local-${Date.now()}`,
      title: newTitle.trim(),
      priority: newPriority,
      project: newProject || 'FocusFlow',
      deadline: newDeadline ? newDeadline.replace('T', ' ') : '',
      status: 'To do',
      comments: [],
      attachments: []
    };

    setLocalTasks([newTaskObj, ...localTasks]);
    
    // Czyszczenie pól formularza i zamknięcie go
    setNewTitle('');
    setNewDeadline('');
    setNewPriority('LOW');
    setIsFormOpen(false);
  };

  const TaskRow = ({ task, isCompleted }) => (
    <div 
      className="card" 
      style={{ 
        margin: 0, 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px', 
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        opacity: isCompleted ? 0.45 : 1
      }}
    >
      <div 
        className="task-indicator-line" 
        data-priority={task.priority} 
        style={isCompleted ? { backgroundColor: 'var(--text-muted)', backgroundImage: 'none' } : {}}
      />

      <Circle 
        size={20} 
        onClick={() => handleToggleComplete(task.id, task.status)}
        style={{ 
          color: isCompleted ? 'var(--text-muted)' : 'var(--accent-primary)', 
          cursor: 'pointer', 
          flexShrink: 0, 
          marginLeft: '4px',
          fill: isCompleted ? 'var(--text-muted)' : 'transparent'
        }} 
      />
      
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontSize: '15px', 
          fontWeight: '600', 
          color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)',
          textDecoration: isCompleted ? 'line-through' : 'none'
        }}>
          {task.title}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
          <span className={getPriorityClass(task.priority)}>
            [{task.priority || 'LOW'}]
          </span>
          
          <span className="category-tag" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Folder size={10} /> {task.project || 'FocusFlow'}
          </span>

          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '4px' }}>
            <Clock size={13} style={{ color: 'var(--text-muted)' }} /> 
            {task.deadline ? `deadline ${task.deadline}` : 'no deadline'}
          </span>
        </div>
      </div>

      <button 
        className="icon-btn" 
        style={{ padding: '4px' }}
        onClick={() => navigate(`/kanban/${task.id}`)}
        title="View task details"
      >
        <MoreHorizontal size={18} />
      </button>
    </div>
  );

  return (
    <div className="dashboard-layout">
      
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
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)} 
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px' }}
          >
            {isFormOpen ? <X size={16} /> : <Plus size={16} />}
            {isFormOpen ? 'cancel' : 'new task'}
          </button>
        </div>

        {/* WYSUWANY, WIZUALNIE DOPASOWANY FORMULARZ SZYBKIEGO DODAWANIA */}
        {isFormOpen && (
          <form 
            onSubmit={handleCreateTask}
            className="card animate-fade-in" 
            style={{ 
              margin: '0 0 32px 0', 
              padding: '24px', 
              backgroundColor: '#1c0c30', 
              border: '1px solid var(--accent-purple)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ padding: '0 0 4px 0', margin: 0 }}>
              <span style={{ 
                color: 'var(--accent-primary)', 
                fontSize: '11px', 
                fontWeight: '700', 
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '1px'
              }}>
                // ADD A NEW TASK!
              </span>
            </div>

            <input 
              type="text" 
              placeholder="Task title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              autoFocus
              style={{
                width: '100%',
                background: '#130823',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'var(--text-main)',
                fontSize: '14px',
                fontFamily: "'JetBrains Mono', monospace",
                outline: 'none'
              }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              {/* Projekt */}
              <div>
                <label className="category-tag" style={{ display: 'block', marginBottom: '6px', fontSize: '10px', paddingLeft: 0, marginLeft: 0 }}>PROJECT</label>
                <input 
                  type="text" 
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  placeholder="FocusFlow"
                  style={{
                    width: '100%',
                    background: '#130823',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'var(--text-main)',
                    fontSize: '12px',
                    fontFamily: "'JetBrains Mono', monospace",
                    outline: 'none'
                  }}
                />
              </div>

              {/* Priorytet */}
              <div>
                <label className="category-tag" style={{ display: 'block', marginBottom: '6px', fontSize: '10px', paddingLeft: 0, marginLeft: 0 }}>PRIORITY</label>
                <select 
                  value={newPriority} 
                  onChange={(e) => setNewPriority(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#130823',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'var(--text-main)',
                    fontSize: '12px',
                    fontFamily: "'JetBrains Mono', monospace",
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="LOW">LOW</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRIT">CRITICAL</option>
                </select>
              </div>

              {/* Deadline */}
              <div>
                <label className="category-tag" style={{ display: 'block', marginBottom: '6px', fontSize: '10px', paddingLeft: 0, marginLeft: 0 }}>DEADLINE DATE</label>
                <input 
                  type="date" 
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#130823',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '7px 12px',
                    color: 'var(--text-main)',
                    fontSize: '12px',
                    fontFamily: "'JetBrains Mono', monospace",
                    outline: 'none',
                    cursor: 'text'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '4px' }}>
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)}
                className="icon-btn" 
                style={{ 
                  padding: '8px 16px', 
                  fontSize: '12px', 
                  fontWeight: '500',
                  fontFamily: "'JetBrains Mono', monospace" 
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}
              >
                ADD TASK
              </button>
            </div>
          </form>
        )}

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>ACTIVE</span>
            <div style={{ flex: 1, borderBottom: '1px dashed var(--border)', opacity: 0.5 }}></div>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)' }}>{activeTasks.length}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeTasks.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No active tasks for today.</p>
            ) : (
              activeTasks.map(task => (
                <TaskRow key={task.id} task={task} isCompleted={false} />
              ))
            )}
          </div>
        </div>

        {/* SEKCJA: COMPLETED */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>COMPLETED</span>
            <div style={{ flex: 1, borderBottom: '1px dashed var(--border)', opacity: 0.5 }}></div>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)' }}>{completedTasks.length}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {completedTasks.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No completed tasks yet.</p>
            ) : (
              completedTasks.map(task => (
                <TaskRow key={task.id} task={task} isCompleted={true} />
              ))
            )}
          </div>
        </div>
      </main>

      <RightAnalytics />

    </div>
  );
}