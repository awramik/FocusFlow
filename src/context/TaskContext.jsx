import React, { createContext, useState, useContext } from 'react';
import { tasksData } from '../data/mockData';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  // mapowanie danych na potrzeby kanbana
  const [tasks, setTasks] = useState(() => {
    return tasksData.map(task => {
      let mappedStatus = 'To do';
      if (task.status === 'doing') mappedStatus = 'Doing';
      if (task.status === 'done') mappedStatus = 'Done';

      let mappedPriority = 'LOW';
      if (task.priority === 'critical') mappedPriority = 'CRIT';
      if (task.priority === 'high') mappedPriority = 'HIGH';

      return {
        id: task.id.toString(),
        title: task.title,
        status: mappedStatus,
        priority: mappedPriority,
        project: task.category || 'FocusFlow'
      };
    });
  });

  // Funkcja do zmiany statusu zadania (drag & drop w kanbanie)
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  // Funkcja do dodawania nowego zadania
  const addTask = (title, priority, project, status) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      priority,
      project,
      status
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  return (
    <TaskContext.Provider value={{ tasks, updateTaskStatus, addTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);