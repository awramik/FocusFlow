import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { 
  Plus, 
  Circle, 
  Clock, 
  MoreHorizontal,
  SlidersHorizontal,
  X,
  ShieldAlert,
  Folder,
  Calendar,
  Layers
} from 'lucide-react';
import RightAnalytics from '../components/RightAnalytics';

export default function AllTasks() {
  const { tasks, updateTaskStatus } = useTasks();
  
  // Stany wyszukiwania i filtrów
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Wybrane filtry
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState(''); 

  // Pobieranie unikalnych projektów TYLKO z aktywnych zadań
  const uniqueProjects = tasks 
    ? ['ALL', ...new Set(tasks.filter(t => t.status !== 'Done').map(t => t.project).filter(Boolean))]
    : ['ALL'];

  const handleToggleComplete = (taskId) => {
    if (updateTaskStatus) {
      updateTaskStatus(taskId, 'Done');
    }
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

  // INTELIGENTNA WALIDACJA I SIKANIE DATY OD LEWEJ DO PRAWEJ
  const handleDateChange = (e) => {
    let raw = e.target.value.replace(/[^\d]/g, '');
    
    let year = raw.slice(0, 4);
    let month = raw.slice(4, 6);
    let day = raw.slice(6, 8);

    // walidacja miesiąca
    if (month.length === 1 && month !== '0' && month !== '1') {
      month = '0' + month;
    }
    if (month.length === 2) {
      const mNum = parseInt(month, 10);
      if (mNum < 1) month = '01';
      if (mNum > 12) month = '12';
    }

    // walidacja dnia
    if (day.length === 1 && day !== '0' && day !== '1' && day !== '2' && day !== '3') {
      day = '0' + day;
    }
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
    if (raw.length > 4 || month.length > 0) {
      formatted += '-' + month;
    }
    if (raw.length > 6 || day.length > 0) {
      formatted += '-' + day;
    }

    setSelectedDate(formatted);
  };

  // ZAAWANSOWANE FILTROWANIE
  const filteredTasks = tasks?.filter(task => {
    if (task.status === 'Done') return false;

    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === 'ALL' || task.priority === selectedPriority;
    const matchesProject = selectedProject === 'ALL' || task.project === selectedProject;
    
    let matchesDate = true;
    if (selectedDate) {
      matchesDate = task.deadline && task.deadline.startsWith(selectedDate);
    }

    return matchesSearch && matchesPriority && matchesProject && matchesDate;
  }) || [];

  // Flaga informująca, czy jakikolwiek filtr (lub wyszukiwarka) jest aktywny
  const shouldShowReset = selectedPriority !== 'ALL' || selectedProject !== 'ALL' || selectedDate !== '' || searchQuery !== '';

  return (
    <div className="dashboard-layout">
      
      <main className="center-content" style={{ padding: '40px', overflowY: 'auto' }}>
        
        {/* NAGŁÓWEK */}
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: '700', margin: 0, letterSpacing: '-0.5px' }}>
              All tasks
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              You can do it ALL, but focus on one thing at a time :)
              <br />
              Use filters to find the most relevant tasks and crush them!
            </p>
          </div>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px' }}>
            <Plus size={16} />
            new task
          </button>
        </div>

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
                    backgroundColor: '#170b24',
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

        <div className="kanban-divider" style={{ marginTop: '10px' }} />

        {/* LISTA ZADAŃ */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            {/* POPRAWKA: teraz sprawdzamy wyłącznie warunek dynamicznego filtrowania (shouldShowReset) */}
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
                  className="card" 
                  style={{ 
                    margin: 0, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px', 
                    padding: '24px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div className="task-indicator-line" data-priority={task.priority} />

                  <Circle 
                    size={20} 
                    onClick={() => handleToggleComplete(task.id)}
                    style={{ color: 'var(--accent-primary)', cursor: 'pointer', flexShrink: 0, marginLeft: '4px' }} 
                  />
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)' }}>
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