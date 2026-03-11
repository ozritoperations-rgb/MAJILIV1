export type UserRole = 'admin' | 'manager' | 'staff';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  department?: string;
  created_at: string;
  updated_at: string;
}

export type DocumentCategory = 'law_proposal' | 'report' | 'memo' | 'other';
export type DocumentStatus = 'pending' | 'processing' | 'processed' | 'failed';
export type ReviewStatus = 'pending' | 'reviewed' | 'approved';

export interface Document {
  id: string;
  title: string;
  description?: string;
  file_path: string;
  file_type: string;
  file_size: number;
  category: DocumentCategory;
  status: DocumentStatus;
  confidence_score?: number;
  tags?: string[];
  review_status?: ReviewStatus;
  ocr_text?: string;
  ai_summary?: string;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory = 'legal' | 'finance' | 'investment' | 'communication' | 'personal' | 'general';
export type TaskSource = 'manual' | 'whatsapp' | 'voice_note' | 'email' | 'system';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category?: TaskCategory;
  source?: TaskSource;
  due_date?: string;
  assigned_to?: string;
  created_by?: string;
  document_id?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export type NotificationType = 'task_assigned' | 'task_updated' | 'document_processed' | 'system';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  metadata: Record<string, any>;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  changes: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export type DecisionType = 'approved' | 'rejected' | 'deferred' | 'amended';
export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';

export interface DecisionLog {
  id: string;
  title: string;
  description?: string;
  decision_type: DecisionType;
  related_document_id?: string;
  decided_by: string;
  decision_date: string;
  impact_level?: ImpactLevel;
  metadata: Record<string, any>;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  device_type?: string;
  ip_address?: string;
  user_agent?: string;
  last_activity: string;
  is_active: boolean;
  created_at: string;
}

export type SecurityEventType = 'login_success' | 'login_failed' | 'permission_denied' | 'data_access' | 'threat_blocked' | 'suspicious_activity';
export type EventSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface SecurityEvent {
  id: string;
  event_type: SecurityEventType;
  severity: EventSeverity;
  user_id?: string;
  ip_address?: string;
  details?: string;
  metadata: Record<string, any>;
  created_at: string;
}
