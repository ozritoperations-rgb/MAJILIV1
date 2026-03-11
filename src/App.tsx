import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/Auth/AuthPage';
import { DocumentList } from './components/Documents/DocumentList';
import { DocumentUpload } from './components/Documents/DocumentUpload';
import { TaskList } from './components/Tasks/TaskList';
import { TaskCreate } from './components/Tasks/TaskCreate';
import { ChatBot } from './components/Chat/ChatBot';
import GovernanceDashboard from './components/Governance/GovernanceDashboard';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import type { Notification } from './types/database';

function AppContent() {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'documents' | 'tasks' | 'governance'>('documents');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setNotifications(data);
    }
  };

  const markNotificationRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    fetchNotifications();
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9fafb',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48,
            height: 48,
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite',
          }} />
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">M</div>
            <h1 className="logo-text">MAJILIS</h1>
          </div>
          <div className="header-actions">
            <div className="notification-wrapper">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="notification-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>
              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h3>Notifications</h3>
                    <span className="notifications-count">{unreadCount} new</span>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="notifications-empty">No notifications</div>
                  ) : (
                    <div className="notifications-list">
                      {notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                        >
                          <div className="notification-title">{notif.title}</div>
                          <div className="notification-message">{notif.message}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="user-profile">
              <div className="user-avatar">
                {profile?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="user-info">
                <div className="user-name">{profile?.full_name}</div>
                <div className="user-role">{profile?.role}</div>
              </div>
            </div>
            <button onClick={signOut} className="btn-sign-out">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="sign-out-text">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="main-nav">
        <div className="nav-content">
          <button
            onClick={() => setActiveTab('documents')}
            className={`nav-tab ${activeTab === 'documents' ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2"/>
              <path d="M13 2v7h7" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>Documents</span>
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`nav-tab ${activeTab === 'tasks' ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Tasks</span>
          </button>
          <button
            onClick={() => setActiveTab('governance')}
            className={`nav-tab ${activeTab === 'governance' ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Governance</span>
          </button>
        </div>
      </nav>

      <main className="main-content">
        {activeTab === 'documents' && (
          <div className="content-layout">
            <DocumentList key={refreshKey} />
            <aside className="sidebar">
              <DocumentUpload onUploadSuccess={() => setRefreshKey(prev => prev + 1)} />
            </aside>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="content-layout">
            <TaskList key={refreshKey} />
            <aside className="sidebar">
              <TaskCreate onCreateSuccess={() => setRefreshKey(prev => prev + 1)} />
            </aside>
          </div>
        )}

        {activeTab === 'governance' && (
          <GovernanceDashboard />
        )}
      </main>

      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
          cursor: 'pointer',
          fontSize: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.4)';
        }}
      >
        {isChatOpen ? '✕' : '🤖'}
      </button>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
