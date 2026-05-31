import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, CheckCircle2, Circle, ChevronLeft } from 'lucide-react';

export default function Calendar() {
  const { tasks } = useTasks();
  const navigate = useNavigate();
  
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
    <div style={{ padding: '24px', color: 'var(--text-main)', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
      
      {/* NAGŁÓWEK Z RETURN BUTTONEM */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* PRZYCISK POWROTU (Return Button) */}
          <button 
            onClick={() => navigate(-1)} 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              color: 'var(--text-main)',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
            }}
            title="Go back"
          >
            <ChevronLeft size={20} />
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CalendarIcon size={26} style={{ color: 'var(--accent-primary)' }} />
              <h1 style={{ fontSize: '32px', fontWeight: '700', margin: 0, letterSpacing: '-0.5px' }}>
                Calendar View
              </h1>
            </div>
            <p style={{ color: 'var(--text-muted)', margin: '6px 0 0 0', fontSize: '14px' }}>
              Schedule tracker • <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>{currentMonth} {currentYear}</span>
            </p>
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: '#231236', padding: '10px 18px', borderRadius: '12px', 
          border: '1px solid var(--border)', fontSize: '13px', fontFamily: "'JetBrains Mono', monospace"
        }}>
          Month tracked tasks: <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>{totalDeadlinesCount}</span>
        </div>
      </div>

      {/* GŁÓWNY KONTENER (ELASTYCZNY REAKTYWNY UKŁAD) */}
      <div style={{ display: 'flex', gap: '24px', width: '100%', alignItems: 'start', flexWrap: 'wrap' }}>
        
        {/* LEWA STRONA: ELASTYCZNA SIATKA KALENDARZA */}
        <div style={{ 
          background: 'rgba(35, 18, 54, 0.4)', 
          borderRadius: '16px', 
          border: '1px solid var(--border)', 
          padding: '24px', 
          flex: '1.7', // Kalendarz zajmuje proporcjonalnie więcej miejsca
          minWidth: '320px', // Bezpieczna minimalna szerokość dla małych ekranów
          boxSizing: 'border-box' 
        }}>
          
          {/* Nazwy dni tygodnia */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '16px' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, idx) => (
              <div key={idx} style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Dni miesiąca dopasowujące się do szerokości (1fr) */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', // Każda kolumna ma identyczny procent szerokości
            gridAutoRows: 'minmax(75px, auto)', // Wysokość dopasowuje się, ale ma bezpieczne minimum
            gap: '8px',
            justifyContent: 'center'
          }}>
            {emptySpaces.map(space => (
              <div key={`empty-${space}`} style={{ opacity: 0 }} />
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
                    aspectRatio: '1 / 1', // Sprawia, że kafelki są idealnymi kwadratami niezależnie od szerokości ekranu
                    background: isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.02)',
                    border: isToday && !isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '8px',
                    cursor: 'pointer',
                    position: 'relative',
                    boxSizing: 'border-box',
                    transition: 'transform 0.1s ease, background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                  }}
                >
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '700', 
                    color: isSelected ? '#2F1547' : isToday ? 'var(--accent-primary)' : 'var(--text-main)',
                    fontFamily: "'JetBrains Mono', monospace",
                    position: 'absolute',
                    top: '8px',
                    left: '8px'
                  }}>
                    {day}
                  </span>

                  {dayTasks.length > 0 && (
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '8px', 
                      left: '4px',
                      right: '4px',
                      display: 'flex', 
                      gap: '4px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      pointerEvents: 'none',
                      flexWrap: 'wrap'
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

        {/* PRAWA STRONA: PANEL Z ZADANIAMI */}
        <div style={{ 
          background: '#231236', 
          borderRadius: '16px', 
          border: '1px solid var(--border)', 
          padding: '24px', 
          minHeight: '400px',
          flex: '1', // Panel zadań jest nieco węższy niż siatka
          minWidth: '280px',
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
                      
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap' }}>
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