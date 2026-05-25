import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Calendar as CalendarIcon, Clock, CheckCircle2, Circle } from 'lucide-react';

export default function Calendar() {
  const { tasks } = useTasks();
  
  const today = new Date();
  const currentDayNum = today.getDate(); 
  const currentYear = today.getFullYear(); 
  const currentMonth = today.toLocaleString('en-US', { month: 'long' });
  const currentMonthISO = String(today.getMonth() + 1).padStart(2, '0');

  const [selectedDay, setSelectedDay] = useState(currentDayNum);

  // Dynamiczne generowanie liczby dni
  const totalDaysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();
  const daysInMonth = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
  
  const firstDayIndex = new Date(currentYear, today.getMonth(), 1).getDay();
  const shiftAmount = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  const emptySpaces = Array.from({ length: shiftAmount }, (_, i) => i);

  const getTasksForDay = (day) => {
    if (!tasks || !Array.isArray(tasks)) return [];
    
    return tasks.filter(task => {
      if (!task.deadline) return false;
      const deadlineStr = String(task.deadline).trim();
      const match = deadlineStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (!match) return false;
      
      return parseInt(match[1], 10) === currentYear && 
             parseInt(match[2], 10) === parseInt(currentMonthISO, 10) && 
             parseInt(match[3], 10) === day;
    });
  };

  const selectedDayTasks = getTasksForDay(selectedDay);
  
  const totalDeadlinesCount = tasks && Array.isArray(tasks)
    ? tasks.filter(task => {
        if (!task.deadline) return false;
        const match = String(task.deadline).trim().match(/^(\d{4})-(\d{2})/);
        if (!match) return false;
        return parseInt(match[1], 10) === currentYear && parseInt(match[2], 10) === parseInt(currentMonthISO, 10);
      }).length 
    : 0;

  return (
    <div style={{ padding: '40px', color: 'var(--text-main)', width: '100%', maxWidth: '1240px', margin: '0 auto', boxSizing: 'border-box' }}>
      
      {/* NAGŁÓWEK */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', width: '100%' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarIcon size={28} style={{ color: 'var(--accent-primary)' }} />
            <h1 style={{ fontSize: '36px', fontWeight: '700', margin: 0, letterSpacing: '-0.5px' }}>
              Calendar View
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', margin: '6px 0 0 0', fontSize: '14px' }}>
            Schedule tracker • <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>{currentMonth} {currentYear}</span>
          </p>
        </div>
        
        <div style={{ 
          backgroundColor: '#231236', padding: '10px 18px', borderRadius: '12px', 
          border: '1px solid var(--border)', fontSize: '13px', fontFamily: "'JetBrains Mono', monospace"
        }}>
          Month tracked tasks: <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>{totalDeadlinesCount}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', width: '100%', alignItems: 'start' }}>
        
        {/* LEWA STRONA: SZEROKA SIATKA KALENDARZA */}
        <div style={{ 
          background: 'rgba(35, 18, 54, 0.4)', 
          borderRadius: '16px', 
          border: '1px solid var(--border)', 
          padding: '24px', 
          width: '720px',
          flexShrink: 0,
          boxSizing: 'border-box' 
        }}>
          
          {/* Nazwy dni tygodnia */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', textAlign: 'center', marginBottom: '16px' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, idx) => (
              <div key={idx} style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase' }}>
                {d}
              </div>
            ))}
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 85px)', 
            gridAutoRows: '85px', 
            gap: '12px',
            justifyContent: 'center'
          }}>
            {emptySpaces.map(space => (
              <div key={`empty-${space}`} style={{ width: '85px', height: '85px', opacity: 0 }} />
            ))}

            {daysInMonth.map(day => {
              const dayTasks = getTasksForDay(day);
              const isSelected = day === selectedDay;
              const isToday = day === currentDayNum;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    width: '85px',
                    height: '85px',
                    background: isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.02)',
                    border: isToday && !isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '10px',
                    cursor: 'pointer',
                    position: 'relative',
                    boxSizing: 'border-box'
                  }}
                >
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '700', 
                    color: isSelected ? '#2F1547' : isToday ? 'var(--accent-primary)' : 'var(--text-main)',
                    fontFamily: "'JetBrains Mono', monospace",
                    position: 'absolute',
                    top: '10px',
                    left: '10px'
                  }}>
                    {day}
                  </span>

                  {/* Kropki - absolutna warstwa na dole kafelka */}
                  {dayTasks.length > 0 && (
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '10px', 
                      left: '0',
                      right: '0',
                      display: 'flex', 
                      gap: '4px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      pointerEvents: 'none'
                    }}>
                      {dayTasks.slice(0, 3).map((t, idx) => (
                        <div 
                          key={idx} 
                          style={{ 
                            width: '6px', 
                            height: '6px', 
                            borderRadius: '50%', 
                            backgroundColor: isSelected 
                              ? '#2F1547' 
                              : t.status === 'Done' ? 'rgba(255,255,255,0.4)' : '#FFAFD7' 
                          }} 
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* PRAWA STRONA: PANEL Z ZADANIAMI (Zajmuje całą pozostałą przestrzeń) */}
        <div style={{ 
          background: '#231236', 
          borderRadius: '16px', 
          border: '1px solid var(--border)', 
          padding: '24px', 
          minHeight: '520px',
          flex: 1,              // Elastycznie bierze wszystko, co zostało z prawej strony
          boxSizing: 'border-box'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0' }}>
            Deadlines for {currentMonth} {selectedDay}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '0 0 20px 0' }}>
            {selectedDayTasks.length} {selectedDayTasks.length === 1 ? 'task planned' : 'tasks planned'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {selectedDayTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '13px', fontStyle: 'italic' }}>No deadlines scheduled for this day. Free flow!</p>
              </div>
            ) : (
              selectedDayTasks.map(task => (
                <div 
                  key={task.id} 
                  style={{ 
                    padding: '14px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', borderRadius: '10px',
                    opacity: task.status === 'Done' ? 0.6 : 1
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
                    {task.status === 'Done' ? (
                      <CheckCircle2 size={16} style={{ color: 'var(--text-muted)', marginTop: '2px' }} />
                    ) : (
                      <Circle size={16} style={{ color: 'var(--accent-primary)', marginTop: '2px' }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        margin: 0, fontSize: '14px', fontWeight: '600',
                        textDecoration: task.status === 'Done' ? 'line-through' : 'none',
                        color: task.status === 'Done' ? 'var(--text-muted)' : 'var(--text-main)'
                      }}>
                        {task.title}
                      </h4>
                      
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                        <span style={{ 
                          backgroundColor: '#170b24', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '700',
                          border: '1px solid rgba(255,255,255,0.05)', color: 'var(--accent-primary)'
                        }}>
                          {task.project || 'FocusFlow'}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} /> {task.deadline && task.deadline.includes(' ') ? task.deadline.split(' ')[1] + ' ' + task.deadline.split(' ')[2] : "10:30 AM"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}