import React from 'react';
import { MoreVertical, Clock } from 'lucide-react';

export default function TaskCard({ task }) {
  const priorityClass = `priority-tag ${task.priority}`;

  return (
    <div className="task-card">
      <div className="task-card-header">
        <span className="category-tag">{task.category}</span>
        <button className="icon-btn"><MoreVertical size={16} /></button>
      </div>
      
      <h3 className="task-title">{task.title}</h3>
      
      <div className="task-card-footer">
        <div className="deadline">
          <Clock size={14} />
          <span>deadline {task.deadline}</span>
        </div>
        <span className={priorityClass}>
          {task.priority.toUpperCase()}
        </span>
      </div>
    </div>
  );
}