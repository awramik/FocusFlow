import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { Plus, X, Folder, ShieldAlert, Calendar } from 'lucide-react';
import '../style/kanban.css';

const columns = ['To do', 'Doing', 'Done'];

export default function Kanban() {
  const { tasks, updateTaskStatus } = useTasks();
  const navigate = useNavigate(); 

  // Stany wyszukiwania i filtrów
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [showFilters, setShowFilters] = useState(false);

  // STAN DLA NOWYCH ZADAŃ I FORMULARZA
  const [localTasks, setLocalTasks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('LOW');
  const [newProject, setNewProject] = useState('FocusFlow');
  const [newStatus, setNewStatus] = useState('To do');
  const [newDeadline, setNewDeadline] = useState('');

  // Łączymy zadania z kontekstu oraz nowo dodane lokalnie
  const allCombinedTasks = [...localTasks, ...tasks];

  // Obsługa tworzenia nowego zadania przez formularz UI
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTaskObj = {
      id: `local-${Date.now()}`,
      title: newTitle.trim(),
      priority: newPriority,
      project: newProject || 'FocusFlow',
      status: newStatus,
      deadline: newDeadline ? newDeadline.replace('T', ' ') : '',
      comments: [],
      attachments: []
    };

    setLocalTasks([newTaskObj, ...localTasks]);
    
    // Resetowanie pól formularza
    setNewTitle('');
    setNewDeadline('');
    setNewPriority('LOW');
    setNewStatus('To do');
    setIsFormOpen(false);
  };

  const onDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, targetStatus) => {
    const id = e.dataTransfer.getData('text');
    
    if (String(id).startsWith('local-')) {
      setLocalTasks(prev => prev.map(t => 
        t.id === id ? { ...t, status: targetStatus } : t
      ));
    } else {
      if (updateTaskStatus) {
        updateTaskStatus(id, targetStatus);
      }
    }
  };

  const getPriorityClass = (priority) => {
    if (priority === 'CRIT') return 'priority-tag critical';
    if (priority === 'HIGH') return 'priority-tag high';
    return 'priority-tag low';
  };

  // Filtrowanie połączonej listy zadań
  const filteredTasks = allCombinedTasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === 'ALL' || task.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="kanban-page" style={{ padding: '40px', width: '100%', minHeight: '100vh', overflowY: 'auto' }}>    
      
      {/* NAGŁÓWEK */}
      <div className="kanban-header">
        <div>
          <h1 className="kanban-title">Kanban</h1>
          <p className="kanban-subtitle">Visual workflow management</p>
        </div>
        <button onClick={() => setIsFormOpen(!isFormOpen)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isFormOpen ? <X size={16} /> : <Plus size={16} />}
          {isFormOpen ? 'cancel' : 'new task'}
        </button>
      </div>

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
            gap: '16px',
            borderRadius: '12px'
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
              // CREATE A NEW TASK DIRECTLY ON THE BOARD
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
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

            <div>
              <label className="category-tag" style={{ display: 'block', marginBottom: '6px', fontSize: '10px', paddingLeft: 0, marginLeft: 0 }}>INITIAL COLUMN</label>
              <select 
                value={newStatus} 
                onChange={(e) => setNewStatus(e.target.value)}
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
                {columns.map(col => <option key={col} value={col}>{col}</option>)}
              </select>
            </div>

            <div>
              <label className="category-tag" style={{ display: 'block', marginBottom: '6px', fontSize: '10px', paddingLeft: 0, marginLeft: 0 }}>DEADLINE</label>
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
              style={{ padding: '8px 16px', fontSize: '12px', fontWeight: '500', fontFamily: "'JetBrains Mono', monospace" }}
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

      {/* AKCJE I FILTRY */}
      <div className="kanban-actions">
        <div className="search-container">
          <span className="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" width="16" height="16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="kanban-search-input"
          />
        </div>
        <button 
          className="btn-filter" 
          onClick={() => setShowFilters(!showFilters)}
          style={{ borderColor: showFilters ? 'var(--accent-primary)' : 'var(--border)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="14" height="14">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          Filter options
        </button>
      </div>

      {showFilters && (
        <div className="priority-filters-bar">
          <span className="filter-label">Priority:</span>
          {['ALL', 'CRIT', 'HIGH', 'LOW'].map(prio => (
            <button
              key={prio}
              className={`filter-chip ${selectedPriority === prio ? 'active' : ''}`}
              onClick={() => setSelectedPriority(prio)}
            >
              {prio}
            </button>
          ))}
        </div>
      )}

      <div className="kanban-divider" />

      {/* SIATKA TABLICY KANBAN */}
      <div className="kanban-board-grid">
        {columns.map(column => (
          <div 
            key={column}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, column)}
            className="kanban-column"
          >
            <h2 className="column-title">{column}</h2>

            <div className="column-tasks-container">
              {filteredTasks
                .filter(task => task.status === column)
                .map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, task.id)}
                    onClick={() => navigate(`/kanban/${task.id}`)}
                    className="task-card clickable-card"
                  >
                    <div className="task-indicator-line" data-priority={task.priority} />
                    
                    <h3 className="task-title">{task.title}</h3>

                    <div className="task-card-footer">
                      <span className={getPriorityClass(task.priority)}>
                        [{task.priority || 'LOW'}]
                      </span>
                      <span className="category-tag">
                        {task.project || 'FocusFlow'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}