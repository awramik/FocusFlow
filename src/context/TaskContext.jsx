import React, { createContext, useState, useContext } from 'react';
import { tasksData } from '../data/mockData';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(tasksData);

  // Funkcja do zmiany statusu zadania (np. z 'todo' na 'done')
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  // Funkcja do dodawania nowego zadania
  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
  };

  return (
    <TaskContext.Provider value={{ tasks, updateTaskStatus, addTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);