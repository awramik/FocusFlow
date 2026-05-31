import React, { createContext, useState, useContext, useEffect } from 'react';
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
  // --- ZARZĄDZANIE ZADANIAMI ---
  const [tasks, setTasks] = useState(() => {
    return tasksData.map(task => {
      let mappedStatus = 'To do';
      if (task.status === 'doing' || task.status === 'ongoing') mappedStatus = 'Doing';
      if (task.status === 'done') mappedStatus = 'Done';

      let mappedPriority = 'LOW';
      if (task.priority === 'critical') mappedPriority = 'CRIT';
      if (task.priority === 'high') mappedPriority = 'HIGH';

      return {
        ...task,
        id: task.id.toString(),
        status: mappedStatus,
        priority: mappedPriority,
        project: task.category || 'FocusFlow'
      };
    });
  });

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const addTask = (title, priority, project, status) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      priority,
      project,
      status,
      deadline: new Date().toISOString().split('T')[0] + ' 12:00 PM'
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  // --- ZARZĄDZANIE TIMEREM ---
  const INITIAL_TIME = 25 * 60;
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      // Możesz dodać tutaj np. powiadomienie dźwiękowe
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleStartPause = () => setIsRunning(prev => !prev);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(INITIAL_TIME);
  };

  // --- EXPORT DO KONTEKSTU ---
  const contextValue = {
    tasks,
    updateTaskStatus,
    addTask,
    currentUser,
    statsData,
    projectsData,
    recentActivity,
    hoursData,
    timeLeft,
    isRunning,
    handleStartPause,
    handleReset
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);