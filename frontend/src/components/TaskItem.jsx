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

  const isMobile = window.innerWidth <= 768;

  return (
    <div style={{
      ...styles.container,
      ...(isMobile && styles.containerMobile),
    }}>
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

      <div style={{
        ...styles.actions,
        ...(isMobile && styles.actionsMobile),
      }}>
        {task.status === 'completed' && task.output_filename && (
          <a
            href={getDownloadUrl(task.output_filename)}
            download={task.output_filename}
            style={{
              ...styles.downloadButton,
              ...(isMobile && styles.downloadButtonMobile),
            }}
          >
            Download
          </a>
        )}
        
        <button
          onClick={onDelete}
          style={{
            ...styles.deleteButton,
            ...(isMobile && styles.deleteButtonMobile),
          }}
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
    padding: '20px',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'all 0.3s ease',
  },
  containerMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '16px',
    gap: '12px',
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
  actionsMobile: {
    width: '100%',
    marginLeft: '0',
    flexDirection: 'column',
  },
  downloadButton: {
    padding: '8px 20px',
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    lineHeight: '1.5',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(72, 187, 120, 0.3)',
  },
  downloadButtonMobile: {
    width: '100%',
    textAlign: 'center',
  },
  deleteButton: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(245, 101, 101, 0.3)',
  },
  deleteButtonMobile: {
    width: '100%',
  },
};

export default TaskItem;
