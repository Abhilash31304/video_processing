import React, { useState } from 'react';
import { createTask } from '../api/backend';

const VariantSelector = ({ video, onTaskCreated }) => {
  const [resolution, setResolution] = useState('720p');
  const [format, setFormat] = useState('mp4');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const resolutions = ['360p', '480p', '720p', '1080p'];
  const formats = ['mp4', 'webm', 'mov'];

  const handleCreateTask = async () => {
    if (!video) return;

    setCreating(true);
    setError(null);

    try {
      const result = await createTask({
        videoId: video.id,
        resolution,
        format,
      });
      console.log('Task created:', result);
      if (onTaskCreated) {
        onTaskCreated(result.task);
      }
    } catch (err) {
      console.error('Task creation error:', err);
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const isMobile = window.innerWidth <= 768;

  if (!video) {
    return (
      <div style={{
        ...styles.container,
        ...(isMobile && styles.containerMobile),
      }}>
        <p style={styles.noVideo}>Select a video to create variants</p>
      </div>
    );
  }

  return (
    <div style={{
      ...styles.container,
      ...(isMobile && styles.containerMobile),
    }}>
      <h3 style={{
        ...styles.title,
        ...(isMobile && styles.titleMobile),
      }}>Create Video Variant</h3>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Resolution:</label>
        <select
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          style={styles.select}
          disabled={creating}
        >
          {resolutions.map((res) => (
            <option key={res} value={res}>
              {res}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Format:</label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          style={styles.select}
          disabled={creating}
        >
          {formats.map((fmt) => (
            <option key={fmt} value={fmt}>
              {fmt.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleCreateTask}
        disabled={creating}
        style={{
          ...styles.button,
          ...(creating && styles.buttonDisabled)
        }}
      >
        {creating ? 'Creating...' : 'Create Variant'}
      </button>

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  containerMobile: {
    padding: '20px 16px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#333',
  },
  titleMobile: {
    fontSize: '16px',
  },
  noVideo: {
    color: '#666',
    fontStyle: 'italic',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#333',
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    border: '2px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: 'white',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  error: {
    color: '#dc3545',
    fontSize: '14px',
    marginTop: '12px',
  },
};

export default VariantSelector;
