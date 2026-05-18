import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import '../kanban.css';

const columns = ['To do', 'Doing', 'Done'];

export default function Kanban() {
  const { tasks, updateTaskStatus, addTask } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate(); 

  const handleAddTask = () => {
    const title = prompt("Enter task title:");
    if (!title) return;
    
    const priority = prompt("Enter priority (CRIT, HIGH, LOW):", "HIGH").toUpperCase();
    const project = prompt("Enter project name or details:", "FocusFlow");
    const status = prompt("Enter status (To do, Doing, Done):", "To do");

    if (!columns.includes(status)) {
      alert("Invalid status! Choose 'To do', 'Doing', or 'Done'.");
      return;
    }

    addTask(title, priority, project, status);
  };

  const onDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, targetStatus) => {
    const id = e.dataTransfer.getData('text');
    updateTaskStatus(id, targetStatus);
  };

  const getPriorityClass = (priority) => {
    if (priority === 'CRIT') return 'priority-tag critical';
    if (priority === 'HIGH') return 'priority-tag high';
    return 'priority-tag low';
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === 'ALL' || task.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  return (
  <div className="kanban-page" style={{ padding: '40px', width: '100%', minHeight: '100vh' }}>    
      <div className="kanban-header">
        <div>
          <h1 className="kanban-title">Kanban</h1>
          <p className="kanban-subtitle">Visual workflow management</p>
        </div>
        <button onClick={handleAddTask} className="btn-primary">
          + new task
        </button>
      </div>

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
                        [{task.priority}]
                      </span>
                      <span className="category-tag">
                        {task.project}
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