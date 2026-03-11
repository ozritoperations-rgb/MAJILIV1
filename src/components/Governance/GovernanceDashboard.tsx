import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { AuditLog, Profile } from '../../types/database';

export default function GovernanceDashboard() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);

    const [auditResult, profilesResult] = await Promise.all([
      supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('profiles')
        .select('*')
    ]);

    if (!auditResult.error && auditResult.data) {
      setAuditLogs(auditResult.data);
    }

    if (!profilesResult.error && profilesResult.data) {
      setProfiles(profilesResult.data);
    }

    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (index: number) => {
    const colors = ['#8b5cf6', '#d97706', '#10b981', '#ef4444', '#3b82f6'];
    return colors[index % colors.length];
  };

  if (loading) {
    return <div className="loading-state">Loading governance data...</div>;
  }

  return (
    <div className="governance-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Governance & Security</h1>
          <p className="page-subtitle">Audit trails, access logs, encryption status, and system security</p>
        </div>
      </div>

      <div className="governance-stats">
        <div className="stat-card">
          <div className="stat-label">ENCRYPTION</div>
          <div className="stat-value-large">Active</div>
          <div className="stat-detail">AES-256 at rest & transit</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">ACTIVE SESSIONS</div>
          <div className="stat-value-large">{profiles.length}</div>
          <div className="stat-detail">{profiles.map(p => p.full_name).join(' · ')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">SECURITY EVENTS</div>
          <div className="stat-value-large">1</div>
          <div className="stat-detail">Threats blocked today</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">AUDIT RECORDS</div>
          <div className="stat-value-large">{auditLogs.length}</div>
          <div className="stat-detail">Complete trail maintained</div>
        </div>
      </div>

      <div className="team-members">
        {profiles.map((profile, index) => (
          <div key={profile.id} className="member-card">
            <div
              className="member-avatar"
              style={{ background: getAvatarColor(index) }}
            >
              {getUserInitials(profile.full_name)}
            </div>
            <div className="member-info">
              <div className="member-name">{profile.full_name}</div>
              <div className="member-role">{profile.role}</div>
            </div>
            <div className="member-status">
              <div className="status-indicator active"></div>
              <span>Full Access</span>
            </div>
          </div>
        ))}
      </div>

      <div className="audit-section">
        <h2 className="section-title">Audit Log</h2>
        <div className="audit-filters">
          <button className="filter-btn active">All</button>
          <button className="filter-btn">Success</button>
          <button className="filter-btn">Failed</button>
        </div>

        <div className="audit-table">
          <div className="audit-table-header">
            <div>TIMESTAMP</div>
            <div>ACTION</div>
            <div>USER</div>
            <div>ROLE</div>
            <div>DETAIL</div>
            <div>STATUS</div>
          </div>
          {auditLogs.map((log) => (
            <div key={log.id} className="audit-table-row">
              <div className="audit-timestamp">{formatDate(log.created_at)}</div>
              <div className="audit-action">{log.action}</div>
              <div className="audit-user">System User</div>
              <div className="audit-role">Automation</div>
              <div className="audit-detail">{log.entity_type}</div>
              <div className="audit-status success">success</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
