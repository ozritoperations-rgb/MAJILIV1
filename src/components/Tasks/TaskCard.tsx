import type { Task } from '../../types/database';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = () => {
    switch (task.category) {
      case 'legal': return '#8b5cf6';
      case 'finance': return '#ec4899';
      case 'investment': return '#f59e0b';
      case 'communication': return '#10b981';
      case 'personal': return '#f97316';
      default: return '#6b7280';
    }
  };

  const formatDueDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const isOverdue = () => {
    if (!task.due_date || task.status === 'completed') return false;
    return new Date(task.due_date) < new Date();
  };

  return (
    <div className="task-card" onClick={onClick}>
      <div className="task-card-header">
        <div
          className="task-status-indicator"
          style={{
            background: task.status === 'completed' ? getStatusColor() : 'transparent',
            border: task.status === 'completed' ? 'none' : `2px solid ${getStatusColor()}`,
          }}
        >
          {task.status === 'completed' && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <div className="task-card-content">
          <h3 className="task-title">{task.title}</h3>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
        </div>
      </div>

      <div className="task-metadata">
        {task.category && (
          <span className="task-badge" style={{ background: `${getCategoryColor()}15`, color: getCategoryColor() }}>
            {task.category.toUpperCase()}
          </span>
        )}
        <span className="task-badge" style={{ background: `${getPriorityColor()}15`, color: getPriorityColor() }}>
          {task.priority.toUpperCase()}
        </span>
        <span className="task-badge" style={{ background: `${getStatusColor()}15`, color: getStatusColor() }}>
          {task.status.toUpperCase().replace('_', '-')}
        </span>
        {task.due_date && (
          <span className={`task-due-date ${isOverdue() ? 'overdue' : ''}`}>
            {formatDueDate(task.due_date)}
          </span>
        )}
      </div>

      {task.source && task.source !== 'manual' && (
        <div className="task-source">
          {task.source === 'whatsapp' && '→ WhatsApp'}
          {task.source === 'voice_note' && '→ Voice Note'}
          {task.source === 'email' && '→ Email'}
          {task.source === 'system' && '→ System'}
        </div>
      )}
    </div>
  );
}
