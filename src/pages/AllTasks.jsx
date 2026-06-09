import React, { useState, useRef, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Circle, 
  Clock, 
  SlidersHorizontal,
  X,
  ShieldAlert,
  Folder,
  Calendar,
  Layers,
  Trash2,
  ArrowUp // Importujemy strzałkę do obsługi FAB
} from 'lucide-react';
import RightAnalytics from '../components/RightAnalytics';

export default function AllTasks() {
  const { tasks, updateTaskStatus, addTask, deleteTask } = useTasks();
  const navigate = useNavigate();
  
  // Referencja do przewijanego kontenera środkowego
  const scrollContainerRef = useRef(null);
  
  // Stan kontrolujący kierunek i widoczność przycisku FAB
  // 'down' oznacza przewijanie w dół, 'up' przewijanie do góry
  const [scrollDirection, setScrollDirection] = useState('down');

  // Stany wyszukiwania i filtrów
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Wybrane filtry
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState(''); 

  // STAN DLA FORMULARZA I NOWYCH ZADAŃ
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('LOW');
  const [newProject, setNewProject] = useState('FocusFlow');
  const [newDeadline, setNewDeadline] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTags, setNewTags] = useState('');

  // Obsługa dynamicznej zmiany kierunku strzałki na FAB
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    
    // Jeśli jesteśmy blisko góry (mniej niż 150px od początku), zawsze pokazuj "w dół"
    if (scrollTop < 150) {
      setScrollDirection('down');
    } 
    // Jeśli zbliżamy się do końca listy, zmień kierunek "w górę"
    else if (scrollTop + clientHeight >= scrollHeight - 150) {
      setScrollDirection('up');
    }
    // W przeciwnym wypadku domyślnie zostawiamy "w górę" jako szybki powrót
    else {
      setScrollDirection('up');
    }
  };

  // Funkcja realizująca gładkie przewijanie po kliknięciu w FAB
  const handleFabClick = () => {
    if (!scrollContainerRef.current) return;

    if (scrollDirection === 'down') {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    } else {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Pobieranie unikalnych projektów TYLKO z aktywnych zadań
  const uniqueProjects = tasks 
    ? ['ALL', ...new Set(tasks.filter(t => t.status !== 'Done').map(t => t.project).filter(Boolean))]
    : ['ALL'];

  const handleToggleComplete = (taskId, currentStatus) => {
    if (updateTaskStatus) {
      const newStatus = currentStatus === 'Done' ? 'To do' : 'Done';
      updateTaskStatus(taskId, newStatus);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (deleteTask) {
      await deleteTask(taskId);
    }
  };

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

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPriority('ALL');
    setSelectedProject('ALL');
    setSelectedDate('');
  };

  const getPriorityClass = (priority) => {
    if (priority === 'CRIT') return 'priority-tag critical';
    if (priority === 'HIGH') return 'priority-tag high';
    return 'priority-tag low';
  };

  const handleDateChange = (e) => {
    let raw = e.target.value.replace(/[^\d]/g, '');
    let year = raw.slice(0, 4);
    let month = raw.slice(4, 6);
    let day = raw.slice(6, 8);

    if (month.length === 1 && month !== '0' && month !== '1') month = '0' + month;
    if (month.length === 2) {
      const mNum = parseInt(month, 10);
      if (mNum < 1) month = '01';
      if (mNum > 12) month = '12';
    }

    if (day.length === 1 && day !== '0' && day !== '1' && day !== '2' && day !== '3') day = '0' + day;
    if (day.length === 2 && month.length === 2) {
      const mNum = parseInt(month, 10);
      const dNum = parseInt(day, 10);
      const yNum = year.length === 4 ? parseInt(year, 10) : 2026;

      let maxDays = 31;
      if ([4, 6, 9, 11].includes(mNum)) {
        maxDays = 30;
      } else if (mNum === 2) {
        const isLeap = (yNum % 4 === 0);
        maxDays = isLeap ? 29 : 28;
      }
      if (dNum < 1) day = '01';
      if (dNum > maxDays) day = String(maxDays).padStart(2, '0');
    }

    let formatted = year;
    if (raw.length > 4 || month.length > 0) formatted += '-' + month;
    if (raw.length > 6 || day.length > 0) formatted += '-' + day;
    setSelectedDate(formatted);
  };

  const filteredTasks = tasks?.filter(task => {
    if (task.status === 'Done') return false;

    const matchesSearch = task.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === 'ALL' || task.priority === selectedPriority;
    const matchesProject = selectedProject === 'ALL' || task.project === selectedProject;
    
    let matchesDate = true;
    if (selectedDate) {
      matchesDate = task.deadline && task.deadline.startsWith(selectedDate);
    }

    return matchesSearch && matchesPriority && matchesProject && matchesDate;
  }) || [];

  const shouldShowReset = selectedPriority !== 'ALL' || selectedProject !== 'ALL' || selectedDate !== '' || searchQuery !== '';

  return (
    <div className="dashboard-layout all-tasks-page" style={{ position: 'relative' }}>
      
      {/* GŁÓWNY KONTENER ŚRODKOWY - Dodano ref oraz onScroll */}
      <main 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="center-content" 
        style={{ padding: '40px', overflowY: 'auto', position: 'relative' }}
      >
        
        {/* NAGŁÓWEK */}
        <div className="page-header">
          <div className="page-header__main">
            <h1>
              All tasks
            </h1>
            <p>
              You can do it ALL, but focus on one thing at a time :)
              <br />
              Use filters to find the most relevant tasks and crush them!
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

        {/* NOWY FORMULARZ SZYBKIEGO DODAWANIA */}
        {isFormOpen && (
          <form 
            onSubmit={handleCreateTask}
            className="card animate-fade-in" 
            style={{ 
              margin: '0 0 32px 0', 
              padding: '24px', 
              backgroundColor: 'var(--bg-column)', 
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
                // ADD A NEW TASK TO YOUR LIST!
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
                background: 'var(--calendar-tag-bg)',
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
                    background: 'var(--calendar-tag-bg)',
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
                    background: 'var(--calendar-tag-bg)',
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
                    background: 'var(--calendar-tag-bg)',
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

        {/* AKCJE I WYSZUKIWARKA */}
        <div className="kanban-actions" style={{ marginBottom: showFilters ? '16px' : '24px' }}>
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
            <SlidersHorizontal size={14} />
            Filter options
          </button>
        </div>

        {/* PANEL FILTRÓW */}
        {showFilters && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            <div className="priority-filters-bar" style={{ margin: 0 }}>
              <span className="filter-label" style={{ minWidth: '80px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={12} /> Priority:
              </span>
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

            <div className="priority-filters-bar" style={{ margin: 0 }}>
              <span className="filter-label" style={{ minWidth: '80px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Folder size={12} /> Project:
              </span>
              {uniqueProjects.map(proj => (
                <button
                  key={proj}
                  className={`filter-chip ${selectedProject === proj ? 'active' : ''}`}
                  onClick={() => setSelectedProject(proj)}
                >
                  {proj}
                </button>
              ))}
            </div>

            <div className="priority-filters-bar" style={{ margin: 0, justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="filter-label" style={{ minWidth: '80px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={12} /> Date:
                </span>
                <input 
                  type="text"
                  placeholder="YYYY-MM-DD"
                  value={selectedDate}
                  onChange={handleDateChange}
                  maxLength={10} 
                  style={{
                    backgroundColor: 'var(--calendar-tag-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-main)',
                    padding: '4px 10px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '12px',
                    width: '110px',
                    outline: 'none',
                  }}
                />
              </div>

              {shouldShowReset && (
                <button 
                  onClick={handleResetFilters}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  <X size={12} /> Reset filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* LISTA ZADAŃ */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={14} /> {shouldShowReset ? 'FILTERED TASKS' : 'ACTIVE TASKS'}
            </span>
            <div style={{ flex: 1, borderBottom: '1px dashed var(--border)', opacity: 0.5 }}></div>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)' }}>{filteredTasks.length}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredTasks.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No active tasks match your filters.
              </p>
            ) : (
              filteredTasks.map(task => (
                <div 
                  key={task.id} 
                  className="card today-task-row"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/kanban/${task.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      navigate(`/kanban/${task.id}`);
                    }
                  }}
                  style={{ 
                    margin: 0, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px', 
                    padding: '24px',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                >
                  <div className="task-indicator-line" data-priority={task.priority} />

                  <Circle 
                    size={20} 
                    onClick={(event) => {
                      event.stopPropagation();
                      handleToggleComplete(task.id, task.status);
                    }}
                    style={{ color: 'var(--accent-primary)', cursor: 'pointer', flexShrink: 0, marginLeft: '4px' }} 
                  />
                  
                  <div className="today-task-row__content" style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)' }}>
                      {task.title}
                    </div>

                    <div className="today-task-row__meta" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
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

                  <div className="today-task-row__actions">
                    <button
                      className="icon-btn task-delete-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteTask(task.id);
                      }}
                      title="Delete task"
                      aria-label={`Delete ${task.title}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
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
