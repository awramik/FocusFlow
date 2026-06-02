import React, { useState, useEffect, useRef } from 'react';
import { useTasks } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Circle, 
  Clock, 
  MoreHorizontal,
  Folder,
  X,
  Trash2,
  ArrowUp
} from 'lucide-react';
import RightAnalytics from '../components/RightAnalytics';

export default function Today() {
  const { tasks, updateTaskStatus, addTask, deleteTask } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // STAN DLA WIZUALIZACJI NOWYCH ZADAŃ ORAZ FORMULARZA
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('LOW');
  const [newProject, setNewProject] = useState('FocusFlow');
  const [newDeadline, setNewDeadline] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTags, setNewTags] = useState('');

  // STAN I LOGIKA DLA INTELIGENTNEGO PRZYCISKU FAB
  const [scrollDirection, setScrollDirection] = useState('down');
  const mainContentRef = useRef(null);
  const lastScrollTop = useRef(0);

  // Monitorowanie kierunku scrollowania wewnątrz kontenera <main>
  useEffect(() => {
    const mainElement = mainContentRef.current;
    if (!mainElement) return;

    const handleScroll = () => {
      const currentScrollTop = mainElement.scrollTop;
      
      // Jeśli użytkownik zjedzie na sam dół, zmień na 'up'
      if (mainElement.scrollHeight - currentScrollTop <= mainElement.clientHeight + 10) {
        setScrollDirection('up');
      } 
      // Jeśli wróci na samą górę, zmień na 'down'
      else if (currentScrollTop <= 10) {
        setScrollDirection('down');
      } 
      // W innych wypadkach reaguj na dynamiczny kierunek ruchu ruch
      else if (currentScrollTop > lastScrollTop.current) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      
      lastScrollTop.current = currentScrollTop <= 0 ? 0 : currentScrollTop;
    };

    mainElement.addEventListener('scroll', handleScroll);
    return () => mainElement.removeEventListener('scroll', handleScroll);
  }, []);

  // Obsługa kliknięcia w FAB (płynne przewijanie góra/dół)
  const handleFabClick = () => {
    if (!mainContentRef.current) return;
    
    if (scrollDirection === 'down') {
      mainContentRef.current.scrollTo({
        top: mainContentRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setScrollDirection('up');
    } else {
      mainContentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      setScrollDirection('down');
    }
  };

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
    }
  };

  const handleDeleteTask = (taskId) => {
    if (deleteTask) {
      deleteTask(taskId);
    }
  };

  const getPriorityClass = (priority) => {
    if (priority === 'CRIT') return 'priority-tag critical';
    if (priority === 'HIGH') return 'priority-tag high';
    return 'priority-tag low';
  };


  const filteredTasks = tasks?.filter(task =>
    task.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTasks = filteredTasks.filter(task => task.status !== 'Done');
  const completedTasks = filteredTasks.filter(task => task.status === 'Done');

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTaskObj = {
      title: newTitle.trim(),
      description: newDescription.trim(),
      tags: newTags ? newTags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      priority: newPriority,
      project: newProject || 'FocusFlow',
      deadline: newDeadline ? newDeadline.replace('T', ' ') : '',
      status: 'To do',
      comments: [],
      attachments: []
    };

    await addTask(newTaskObj);

    setNewTitle('');
    setNewDescription('');
    setNewTags('');
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
      <button
        className="icon-btn task-delete-btn"
        onClick={() => handleDeleteTask(task.id)}
        title="Delete task"
        aria-label={`Delete ${task.title}`}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <div className="dashboard-layout today-page">
      
      {/* Podpięta referencja mainContentRef pod kontener ze scrollem */}
      <main ref={mainContentRef} className="center-content" style={{ padding: '40px', overflowY: 'auto' }}>
        <div className="page-header">
          <div className="page-header__main">
            <h1>
              Today's tasks
            </h1>
            <p>
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

        {/* WYSUWANY FORMULARZ */}
        {isFormOpen && (
          <form 
            onSubmit={handleCreateTask}
            className="card animate-fade-in" 
            style={{ 
              margin: '0 0 32px 0', 
              padding: '24px', 
              backgroundColor: 'var(--bg-card)',
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
                background: 'var(--bg-main)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'var(--text-main)',
                fontSize: '14px',
                fontFamily: "'JetBrains Mono', monospace",
                outline: 'none'
              }}
            />
            {/* OPIS */}
            <div>
              <label className="category-tag" style={{ display: 'block', marginBottom: '6px', fontSize: '10px', paddingLeft: 0, marginLeft: 0 }}>DESCRIPTION</label>
              <textarea 
                placeholder="Task details..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                style={{
                  width: '100%', background: 'var(--calendar-tag-bg)', border: '1px solid var(--border)',
                  borderRadius: '8px', padding: '12px 16px', color: 'var(--text-main)', minHeight: '80px',
                  resize: 'vertical', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", outline: 'none'
                }}
              />
            </div>

            {/* TAGI */}
            <div>
              <label className="category-tag" style={{ display: 'block', marginBottom: '6px', fontSize: '10px', paddingLeft: 0, marginLeft: 0 }}>TAGS (COMMA SEPARATED)</label>
              <input 
                type="text" 
                placeholder="e.g. design, frontend, urgent"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                style={{
                  width: '100%', background: 'var(--calendar-tag-bg)', border: '1px solid var(--border)',
                  borderRadius: '8px', padding: '10px 16px', color: 'var(--text-main)',
                  fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label className="category-tag" style={{ display: 'block', marginBottom: '6px', fontSize: '10px', paddingLeft: 0, marginLeft: 0 }}>PROJECT</label>
                <input 
                  type="text" 
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  placeholder="FocusFlow"
                  style={{
                    width: '100%',
                    background: 'var(--bg-main)',
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
                    background: 'var(--bg-main)',
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
                <label className="category-tag" style={{ display: 'block', marginBottom: '6px', fontSize: '10px', paddingLeft: 0, marginLeft: 0 }}>DEADLINE DATE</label>
                <input 
                  type="date" 
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-main)',
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
              backgroundColor: 'var(--bg-card)',
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
        <div style={{ marginBottom: '24px' }}>
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

        {/* INTELIGENTNY PRZYCISK FAB */}
        <button
          type="button"
          onClick={handleFabClick}
          title={scrollDirection === 'down' ? 'Scroll to bottom' : 'Scroll to top'}
          style={{
            position: 'sticky',
            bottom: '24px',
            left: '100%',
            transform: 'translateX(-24px)',
            zIndex: 99,
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-sidebar)',
            border: '2px solid var(--accent-purple)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-purple)';
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-sidebar)';
            e.currentTarget.style.borderColor = 'var(--accent-purple)';
          }}
        >
          <ArrowUp 
            size={20} 
            style={{
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: scrollDirection === 'down' ? 'rotate(180deg)' : 'rotate(0deg)'
            }} 
          />
        </button>

      </main>

      <RightAnalytics />

    </div>
  );
}
