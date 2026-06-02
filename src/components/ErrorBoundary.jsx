import React from 'react';
import { ShieldAlert, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Aktualizuje stan, aby następny render pokazał zastępcze UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("FocusFlow przechwycił błąd:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Zastępcze UI
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100vh', width: '100vw', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)',
          fontFamily: "'JetBrains Mono', monospace", textAlign: 'center', padding: '20px', boxSizing: 'border-box'
        }}>
          <ShieldAlert size={64} color="var(--dashboard-pink)" style={{ marginBottom: '24px' }} />
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Oops! System overload.</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '400px' }}>
            It seems we've encountered an unexpected error. Don't worry, your data is safe in the cloud.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
              backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none',
              borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px'
            }}
          >
            <RefreshCcw size={16} />
            REBOOT SYSTEM
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;