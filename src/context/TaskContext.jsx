import React, { createContext, useState, useContext } from 'react';
import { 
  tasksData, 
  currentUser, 
  statsData, 
  projectsData, 
  recentActivity 
} from '../data/mockData';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(tasksData);

  // Funkcja do zmiany statusu zadania
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

 const contextValue = {
    tasks,
    updateTaskStatus,
    addTask,
    currentUser,
    statsData,
    projectsData,
    recentActivity 
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);