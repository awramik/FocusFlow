import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, setDoc, addDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

import { statsData, projectsData, recentActivity, hoursData } from '../data/mockData';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // --- POBIERANIE ZADAŃ Z CHMURY ---
  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setLoadingTasks(false);
      return;
    }

    const q = query(collection(db, 'tasks'), where('userId', '==', currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksFromDB = [];
      snapshot.forEach((doc) => {
        tasksFromDB.push({ id: doc.id, ...doc.data() });
      });
      
      tasksFromDB.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setTasks(tasksFromDB);
      setLoadingTasks(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // --- AKTUALIZACJA STATUSU W CHMURZE  ---
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      setTasks(prev => prev.map(t => t.id === String(taskId) ? { ...t, status: newStatus } : t));
      
      const taskRef = doc(db, 'tasks', String(taskId));
      await updateDoc(taskRef, {
        status: newStatus,
        completedAt: newStatus === 'Done' ? new Date().toISOString() : null
      });
    } catch (error) {
      console.error("Błąd aktualizacji statusu:", error);
    }
  };
  // ---  DODAWANIE ZADAŃ DO CHMURY ---
  const addTask = async (taskData) => {
    try {
      const newTask = {
        ...taskData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        completedAt: taskData.status === 'Done' ? new Date().toISOString() : null
      };
      await addDoc(collection(db, 'tasks'), newTask);
    } catch (error) {
      console.error("Błąd podczas dodawania zadania:", error);
    }
  };

  // --- ZARZĄDZANIE TIMEREM POMODORO ---
  const INITIAL_TIME = 25 * 60;
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleStartPause = () => setIsRunning(prev => !prev);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(INITIAL_TIME);
  };

  const contextValue = {
    tasks,
    loadingTasks,
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