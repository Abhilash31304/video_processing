import React, { useState, useEffect } from 'react';
import UploadVideo from '../components/UploadVideo';
import VariantSelector from '../components/VariantSelector';
import VideoList from '../components/VideoList';
import TaskList from '../components/TaskList';
import usePolling from '../hooks/usePolling';
import { getAllVideos, deleteVideo, getAllTasks, deleteTask } from '../api/backend';

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      const result = await getAllVideos();
      setVideos(result.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      // Fetch tasks for selected video only (or all if none selected)
      const videoId = selectedVideo?.id || null;
      const result = await getAllTasks(videoId);
      setTasks(result.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchVideos();
    fetchTasks();
  }, []);

  // Refetch tasks when selected video changes
  useEffect(() => {
    fetchTasks();
  }, [selectedVideo]);

  // Poll for task updates
  usePolling(() => {
    fetchTasks();
  }, 3000);

  const handleUploadSuccess = (video) => {
    setVideos([video, ...videos]);
    setSelectedVideo(video);
  };

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      await deleteVideo(videoId);
      setVideos(videos.filter((v) => v.id !== videoId));
      if (selectedVideo?.id === videoId) {
        setSelectedVideo(null);
      }
      // Also remove tasks for this video
      setTasks(tasks.filter((t) => t.video_id !== videoId));
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video');
    }
  };

  const handleTaskCreated = (task) => {
    setTasks([task, ...tasks]);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Video Processing Dashboard</h1>
        <p style={styles.subtitle}>Upload videos and create multiple variants</p>
      </header>

      <div style={styles.grid}>
        <div style={styles.leftColumn}>
          <UploadVideo onUploadSuccess={handleUploadSuccess} />
          
          <VariantSelector
            video={selectedVideo}
            onTaskCreated={handleTaskCreated}
          />
          
          <VideoList
            videos={videos}
            selectedVideo={selectedVideo}
            onSelectVideo={handleSelectVideo}
            onDeleteVideo={handleDeleteVideo}
          />
        </div>

        <div style={styles.rightColumn}>
          <TaskList
            tasks={tasks}
            selectedVideo={selectedVideo}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '24px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
  },
  loading: {
    textAlign: 'center',
    padding: '48px',
    fontSize: '18px',
    color: '#666',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
};

export default Dashboard;
