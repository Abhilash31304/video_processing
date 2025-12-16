import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, selectedVideo, onDeleteTask }) => {
  const displayMessage = !selectedVideo 
    ? 'Select a video to view its tasks' 
    : 'No tasks created for this video yet';

  if (!tasks || tasks.length === 0) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>Processing Tasks</h3>
        <p style={styles.empty}>{displayMessage}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        Processing Tasks ({tasks.length})
        {selectedVideo && <span style={styles.videoName}> - {selectedVideo.original_name}</span>}
      </h3>
      
      <div style={styles.list}>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={() => onDeleteTask(task.id)}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15), 0 0 1px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.8)',
    backdropFilter: 'blur(10px)',
    minHeight: '400px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#2d3748',
    letterSpacing: '-0.5px',
  },
  empty: {
    color: '#666',
    fontStyle: 'italic',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  videoName: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#666',
  },
};

export default TaskList;
