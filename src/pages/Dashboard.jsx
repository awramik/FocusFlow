export default function Dashboard() {
  return (
    <div className="dashboard-layout">
      
      {/* Środkowa kolumna: Największa (Zadania) */}
      <section className="center-content">
        <header className="header-title">
          <div>
            <h1>Today's tasks</h1>
            <p className="date-subtitle">Tuesday, April 14, 2026</p>
          </div>
          <button className="btn-primary">+ new task</button>
        </header>

        {/* Miejsce na listę zadań (Active / Completed) */}
        <div className="tasks-container">
          <h3 className="section-label">ACTIVE</h3>
          {/* Komponenty kart zadań dojdą tutaj */}
        </div>
      </section>

      {/* Prawa kolumna: Analityka */}
      <aside className="right-sidebar">
        <h2>Analytics</h2>
        <p className="subtitle">Your productivity insights</p>

        {/* Miejsce na widgety z wykresami (Completion rate, Focus score) */}
        <div className="widgets-container">
          <div className="widget">Completion rate: 87%</div>
          <div className="widget">Focus score: 94</div>
        </div>
      </aside>
      
    </div>
  );
}