import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, deleteDoc, increment } from 'firebase/firestore';
import { useAuth } from './AuthContext';


const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { currentUser } = useAuth(); 
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // --- POBIERANIE ZADAŃ Z CHMURY (W CZASIE RZECZYWISTYM) ---
  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setLoadingTasks(false);
      return;
    }

    // Zapytanie do Firestore o zadania przypisane do zalogowanego użytkownika
    const q = query(collection(db, 'tasks'), where('userId', '==', currentUser.uid));

    // Live nasłuchiwanie zmian w bazie danych
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksFromDB = [];
      snapshot.forEach((doc) => {
        tasksFromDB.push({ id: doc.id, ...doc.data() });
      });
      
      // Sortowanie zadań od najnowszych
      tasksFromDB.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setTasks(tasksFromDB);
      setLoadingTasks(false);
    }, (error) => {
      console.error("Błąd podczas pobierania zadań z chmury:", error);
      setLoadingTasks(false);
    });

    return () => unsubscribe(); 
  }, [currentUser]);

  // --- LOGIKA EWOLUCJI PANA FERDYNANDA ---
  useEffect(() => {
    if (!currentUser?.ferdynand) return;

    const xp = currentUser.ferdynand.currentXP || 0;
    let newStage = 1;

    if (xp > 1000) newStage = 5;
    else if (xp > 600) newStage = 4;
    else if (xp > 300) newStage = 3;
    else if (xp > 100) newStage = 2;

    // Jeśli wyliczony poziom jest wyższy niż obecny, aktualizujemy bazę
    if (newStage !== currentUser.ferdynand.stage) {
      const userRef = doc(db, 'users', currentUser.uid);
      updateDoc(userRef, { "ferdynand.stage": newStage });
    }
  }, [currentUser?.ferdynand?.currentXP]);

  useEffect(() => {
    if (!currentUser) return;

    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const lastActive = currentUser.stats?.lastActiveDate;

  
    if (lastActive !== todayStr) {
      const workGoal = currentUser.settings?.workHoursGoal || 6;
      const focusGoal = currentUser.settings?.focusedHoursGoal || 2;
      
      let bonusXP = 0;
      
      if (lastActive) {
        if ((currentUser.stats?.workHoursCurrent || 0) >= workGoal) bonusXP += 20;
        if ((currentUser.stats?.focusedHoursCurrent || 0) >= focusGoal) bonusXP += 20;
      }

      const userRef = doc(db, 'users', currentUser.uid);
      updateDoc(userRef, {
        "stats.workHoursCurrent": 0,
        "stats.focusedHoursCurrent": 0,
        "stats.lastActiveDate": todayStr,
        "ferdynand.currentXP": increment(bonusXP)
      }).catch(err => console.error("Błąd resetu dnia:", err));
    }
  }, [currentUser]);

  // --- DODAWANIE I AKTUALIZACJA ZADAŃ ---
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const isNowDone = newStatus === 'Done' || newStatus === 'done';
      const userRef = doc(db, 'users', currentUser.uid);

      const taskRef = doc(db, 'tasks', String(taskId));
      await updateDoc(taskRef, {
        status: newStatus,
        completedAt: isNowDone ? new Date().toISOString() : null
      });

      // Jeśli zadanie zostało ukończone, dodaj 10 XP
      if (isNowDone) {
        await updateDoc(userRef, {
          "ferdynand.currentXP": increment(10)
        });
      }
    } catch (error) {
      console.error("Błąd aktualizacji statusu:", error);
    }
  };

  const addTask = async (taskData) => {
    try {
      if (!currentUser) return;
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

  const deleteTask = async (taskId) => {
    try {
      if (!currentUser || !taskId) return;
      const taskRef = doc(db, 'tasks', String(taskId));
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("BĹ‚Ä…d podczas usuwania zadania:", error);
    }
  };

  // --- POMODORO TIMER, CHMURA, DŹWIĘK I POWIADOMIENIA ---
  const timerSetting = currentUser?.settings?.timerDuration || 25;
  const breakSetting = currentUser?.settings?.breakInterval || 5;
  const defaultTime = timerSetting * 60;

  const [timeLeft, setTimeLeft] = useState(defaultTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(timerSetting * 60);
      setIsRunning(false);
    }
  }, [timerSetting]);

  const playTimerSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3');
    audio.play().catch(e => console.log("Zablokowano autoodtwarzanie dźwięku: ", e));
  };

  const showNotification = () => {
    if (Notification.permission === "granted") {
      new Notification("FocusFlow", { body: "Czas minął! Zrobiłaś świetną robotę." });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("FocusFlow", { body: "Czas minął! Zrobiłaś świetną robotę." });
        }
      });
    }
  };

  const handleTimerComplete = async () => {
    if (!currentUser) return;
    playTimerSound();
    showNotification();

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const durationHours = timerSetting / 60;
      const xpEarned = 5; 

      await updateDoc(userRef, {
        "stats.focusTimeSeconds": increment(timerSetting * 60),
        "stats.focusedHoursCurrent": increment(durationHours),
        "stats.workHoursCurrent": increment(durationHours),
        "ferdynand.currentXP": increment(xpEarned) 
      });
      
      setTimeLeft(breakSetting * 60);
    } catch (error) {
      console.error("Błąd zapisu timera:", error);
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
    setTimeLeft(timerSetting * 60);
  };

  // --- NALICZANIE GODZIN PRACY W TLE ---
  useEffect(() => {
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

    return () => clearInterval(backgroundWorkTimer);
  }, [currentUser]);

  // ---DYNAMICZNE BUDOWANIE DANYCH DLA DASHBOARDU ---
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
    deleteTask,
    currentUser,
    statsData,       
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
