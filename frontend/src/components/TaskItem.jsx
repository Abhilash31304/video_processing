import React from 'react';
import { getDownloadUrl } from '../api/backend';

const TaskItem = ({ task, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'queued':
      case 'pending': // backward compatibility
        return '#ffc107';
      case 'processing':
        return '#17a2b8';
      case 'completed':
        return '#28a745';
      case 'failed':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <span style={{
            ...styles.status,
            backgroundColor: getStatusColor(task.status)
          }}>
            {getStatusText(task.status)}
          </span>
          <span style={styles.details}>
            {task.resolution} • {task.format.toUpperCase()}
          </span>
        </div>

        {task.error_message && (
          <p style={styles.error}>Error: {task.error_message}</p>
        )}

        {task.output_filename && (
          <p style={styles.output}>Output: {task.output_filename}</p>
        )}

        <p style={styles.date}>
          Created: {new Date(task.created_at).toLocaleString()}
        </p>
        
        {task.completed_at && (
          <p style={styles.date}>
            Completed: {new Date(task.completed_at).toLocaleString()}
          </p>
        )}
      </div>

      <div style={styles.actions}>
        {task.status === 'completed' && task.output_filename && (
          <a
            href={getDownloadUrl(task.output_filename)}
            download={task.output_filename}
            style={styles.downloadButton}
          >
            Download
          </a>
        )}
        
        <button
          onClick={onDelete}
          style={styles.deleteButton}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    border: '1px solid #e9ecef',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  status: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
  details: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  error: {
    fontSize: '13px',
    color: '#dc3545',
    marginTop: '4px',
  },
  output: {
    fontSize: '13px',
    color: '#28a745',
    marginTop: '4px',
    fontFamily: 'monospace',
  },
  date: {
    fontSize: '12px',
    color: '#999',
    marginTop: '4px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    marginLeft: '12px',
  },
  downloadButton: {
    padding: '6px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '13px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    lineHeight: '1.5',
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '13px',
    cursor: 'pointer',
  },
};

export default TaskItem;
