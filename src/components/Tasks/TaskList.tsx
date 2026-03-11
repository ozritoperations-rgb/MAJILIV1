import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Task, TaskStatus } from '../../types/database';
import { useAuth } from '../../contexts/AuthContext';
import TaskCard from './TaskCard';

type FilterType = 'all' | TaskStatus;

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTasks(data);
    }
    setLoading(false);
  };

  const filteredTasks = activeFilter === 'all'
    ? tasks
    : tasks.filter(task => task.status === activeFilter);

  const getCountByStatus = (status: TaskStatus) => {
    return tasks.filter(t => t.status === status).length;
  };

  if (loading) {
    return <div className="loading-state">Loading tasks...</div>;
  }

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks & Decisions</h1>
          <p className="page-subtitle">Track all instructions, assignments, and recorded decisions</p>
        </div>
        <button className="btn-new-task">+ New Task</button>
      </div>

      <div className="task-tabs">
        <button className="tab-primary">Tasks ({tasks.length})</button>
        <button className="tab-secondary">Decision Log (0)</button>
      </div>

      <div className="task-filters">
        <button
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All ({tasks.length})
        </button>
        <button
          className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveFilter('pending')}
        >
          Pending ({getCountByStatus('pending')})
        </button>
        <button
          className={`filter-btn ${activeFilter === 'in_progress' ? 'active' : ''}`}
          onClick={() => setActiveFilter('in_progress')}
        >
          In Progress ({getCountByStatus('in_progress')})
        </button>
        <button
          className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveFilter('completed')}
        >
          Completed ({getCountByStatus('completed')})
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          No {activeFilter !== 'all' ? activeFilter : ''} tasks found. Create your first task to get started.
        </div>
      ) : (
        <div className="tasks-list">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
