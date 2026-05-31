import React, { createContext, useState, useContext } from 'react';
import { 
  tasksData, 
  currentUser, 
  statsData, 
  projectsData, 
  recentActivity,
  hoursData 
} from '../data/mockData';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  // Mapowanie danych na potrzeby kanbana oraz innych widoków z zachowaniem oryginalnych pól (np. deadline)
  const [tasks, setTasks] = useState(() => {
    return tasksData.map(task => {
      let mappedStatus = 'To do';
      if (task.status === 'doing' || task.status === 'ongoing') mappedStatus = 'Doing';
      if (task.status === 'done') mappedStatus = 'Done';

      let mappedPriority = 'LOW';
      if (task.priority === 'critical') mappedPriority = 'CRITICAL';
      if (task.priority === 'high') mappedPriority = 'HIGH';
      if (task.priority === 'medium') mappedPriority = 'MEDIUM';

      return {
        ...task, // Przekazujemy wszystkie oryginalne pola (w tym deadline i opis)
        id: task.id.toString(),
        title: task.title,
        status: mappedStatus,
        priority: mappedPriority,
        project: task.category || 'FocusFlow'
      };
    });
  });

  // Funkcja do zmiany statusu zadania (używana w Kanbanie i Today)
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
      status,
      deadline: new Date().toISOString().split('T')[0] + ' 12:00 PM' // Domyślny deadline dla nowych zadań
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const contextValue = {
    tasks,
    updateTaskStatus,
    addTask,
    currentUser,
    statsData,
    projectsData,
    recentActivity,
    hoursData 
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);