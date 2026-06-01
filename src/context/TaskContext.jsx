import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, increment } from 'firebase/firestore'; 
import { useAuth } from './AuthContext';

import { projectsData, recentActivity } from '../data/mockData';

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

  // --- DODAWANIE I AKTUALIZACJA ZADAŃ ---
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

  // --- POMODORO TIMER, CHMURA, DŹWIĘK I POWIADOMIENIA ---
  
  // Dynamicznie czyta czas z Firebase (ustawienia usera) lub domyślnie 25
  const timerSetting = currentUser?.settings?.timerDuration || 25;
  const breakSetting = currentUser?.settings?.breakInterval || 5;
  const defaultTime = timerSetting * 60;

  const [timeLeft, setTimeLeft] = useState(defaultTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(timerSetting * 60);
    }
  }, [timerSetting, isRunning]);

  // Efekt dźwiękowy (krótki sygnał zakończenia zadania)
  const playTimerSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log("Zablokowano autoodtwarzanie dźwięku: ", e));
  };

  // Pop-up systemowy (Powiadomienie przeglądarki)
  const showNotification = () => {
    if (Notification.permission === "granted") {
      new Notification("FocusFlow", { body: "Czas minął! Zrobiłaś świetną robotę. 🚀" });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("FocusFlow", { body: "Czas minął! Zrobiłaś świetną robotę. 🚀" });
        }
      });
    }
  };

  // Odpala się gdy czas dojdzie do zera
  const handleTimerComplete = async () => {
    if (!currentUser) return;
    
    playTimerSound();
    showNotification();

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const durationSeconds = timerSetting * 60;
      const durationHours = timerSetting / 60;

      // Zapisujemy progres w bazie
      await updateDoc(userRef, {
        "stats.focusTimeSeconds": increment(durationSeconds),
        "stats.focusedHoursCurrent": increment(durationHours),
        "stats.workHoursCurrent": increment(durationHours) 
      });
      
      // Automatycznie przełącz na przerwę
      setTimeLeft(breakSetting * 60);
    } catch (error) {
      console.error("Błąd zapisu statystyk timera:", error);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleStartPause = () => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(defaultTime);
  };
// --- NALICZANIE GODZIN PRACY W TLE ---
  useEffect(() => {
    // Jeśli nikt nie jest zalogowany, nie naliczamy czasu
    if (!currentUser) return;

    const backgroundWorkTimer = setInterval(async () => {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        
        await updateDoc(userRef, {
          "stats.workHoursCurrent": increment(1 / 60)
        });
      } catch (error) {
        console.error("Błąd naliczania czasu pracy w tle:", error);
      }
    }, 60000); 

    // Czyścimy stoper, gdy użytkownik się wyloguje lub przełączy konto
    return () => clearInterval(backgroundWorkTimer);
  }, [currentUser]);


  // --- WERSJA DEMO NA PREZENTACJĘ (Szybkie naliczanie) ---

  // useEffect(() => {
  //   if (!currentUser) return;

  //   // Przyspieszamy czas - Co każde 5 sekund (5000 ms) dodajemy 0.1 godziny pracy
  //   const backgroundWorkTimer = setInterval(async () => {
  //     try {
  //       const userRef = doc(db, 'users', currentUser.uid);
  //       await updateDoc(userRef, {
  //         "stats.workHoursCurrent": increment(0.1)
  //       });
  //     } catch (error) {
  //       console.error("Błąd wersji demo:", error);
  //     }
  //   }, 5000); 

  //   return () => clearInterval(backgroundWorkTimer);
  // }, [currentUser]);



  // --- DYNAMICZNE BUDOWANIE DANYCH DLA DASHBOARDU ---
  
  const totalSeconds = currentUser?.stats?.focusTimeSeconds || 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  const statsData = {
    focusTime: `${hours}h ${minutes}m`
  };

  const hoursData = {
    workHours: {
      current: parseFloat((currentUser?.stats?.workHoursCurrent || 0).toFixed(1)),
      goal: currentUser?.settings?.workHoursGoal || 6,
      unit: "h"
    },
    focusedHours: {
      current: parseFloat((currentUser?.stats?.focusedHoursCurrent || 0).toFixed(1)),
      goal: currentUser?.settings?.focusedHoursGoal || 2,
      unit: "h"
    }
  };

  const contextValue = {
    tasks,
    loadingTasks,
    updateTaskStatus,
    addTask,
    currentUser,
    statsData,       
    hoursData,       
    projectsData,
    recentActivity,
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