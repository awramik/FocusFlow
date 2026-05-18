import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Calendar as CalendarIcon, Clock, CheckCircle2, Circle } from 'lucide-react';

export default function Calendar() {
  const { tasks } = useTasks();
  
  // Stan wybranego dnia - domyślnie 18 (dzisiaj)
  const [selectedDay, setSelectedDay] = useState(18);

  const currentMonth = "May";
  const currentYear = 2026;

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const emptySpaces = Array.from({ length: 4 }, (_, i) => i);

  // Funkcja sprawdzająca zadania dla konkretnego dnia
  const getTasksForDay = (day) => {
    if (!tasks) return [];
    
    if (day === 18) {
      return tasks.filter(task => task.status !== 'done' || task.status === 'Done');
    }

    // Dla pozostałych dni próbujemy dopasować po polu task.deadline, jeśli istnieje pełna data
    const formattedDay = day < 10 ? `0${day}` : day;
    const targetDateStr = `2026-05-${formattedDay}`;
    
    return tasks.filter(task => {
      if (!task.deadline) return false;
      return task.deadline.startsWith(targetDateStr);
    });
  };

  const selectedDayTasks = getTasksForDay(selectedDay);
  
  // Obliczamy łączną liczbę zadań, które mają jakikolwiek deadline lub są na dziś
  const totalDeadlinesCount = tasks ? tasks.length : 0;

  return (
    <div style={{ padding: '40px', color: 'var(--text-main)', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '32px',
        width: '100%' 
      }}>
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
          backgroundColor: '#231236', 
          padding: '10px 18px', 
          borderRadius: '12px', 
          border: '1px solid var(--border)', 
          fontSize: '13px', 
          fontFamily: "'JetBrains Mono', monospace",
          whiteSpace: 'nowrap'
        }}>
          Total tracked tasks: <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>{totalDeadlinesCount}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* LEWA STRONA: SIATKA */}
        <div style={{ background: 'rgba(35, 18, 54, 0.4)', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center', marginBottom: '16px' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, idx) => (
              <div key={idx} style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {d}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
            {emptySpaces.map(space => (
              <div key={`empty-${space}`} style={{ aspectRatio: '1/1', opacity: 0 }} />
            ))}

            {daysInMonth.map(day => {
              const dayTasks = getTasksForDay(day);
              const isSelected = day === selectedDay;
              const isToday = day === 18; 

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    aspectRatio: '1/1',
                    background: isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.02)',
                    border: isToday && !isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                  className="calendar-day-tile"
                >
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '700', 
                    color: isSelected ? '#2F1547' : isToday ? 'var(--accent-primary)' : 'var(--text-main)',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}>
                    {day}
                  </span>

                  {dayTasks.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: 'auto' }}>
                      {isSelected ? (
                        <span style={{ fontSize: '10px', fontWeight: '800', color: '#2F1547' }}>
                          {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                        </span>
                      ) : (
                        <div style={{ display: 'flex', gap: '3px' }}>
                          {dayTasks.slice(0, 3).map((t, idx) => (
                            <div 
                              key={idx} 
                              style={{ 
                                width: '5px', 
                                height: '5px', 
                                borderRadius: '50%', 
                                backgroundColor: t.status === 'Done' ? 'rgba(255,255,255,0.3)' : '#FFAFD7' 
                              }} 
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* PRAWA STRONA: LISTA ZADAŃ */}
        <div style={{ background: '#231236', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', minHeight: '400px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0' }}>
            Deadlines for May {selectedDay}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '0 0 20px 0' }}>
            {selectedDayTasks.length} {selectedDayTasks.length === 1 ? 'task planned' : 'tasks planned'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {selectedDayTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '13px', fontStyle: 'italic' }}>No deadlines scheduled for this day. Free flow! ⚡</p>
              </div>
            ) : (
              selectedDayTasks.map(task => (
                <div 
                  key={task.id} 
                  style={{ 
                    padding: '14px', 
                    background: 'rgba(255, 255, 255, 0.02)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '10px',
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
                        margin: 0, 
                        fontSize: '14px', 
                        fontWeight: '600',
                        textDecoration: task.status === 'Done' ? 'line-through' : 'none',
                        color: task.status === 'Done' ? 'var(--text-muted)' : 'var(--text-main)'
                      }}>
                        {task.title}
                      </h4>
                      
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                        <span style={{ 
                          backgroundColor: '#170b24', 
                          padding: '2px 6px', 
                          borderRadius: '4px', 
                          fontSize: '10px', 
                          fontWeight: '700',
                          border: '1px solid rgba(255,255,255,0.05)',
                          color: 'var(--accent-primary)'
                        }}>
                          {task.project || 'FocusFlow'}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} /> {task.deadline || "10:30 am"}
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