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

  const isMobile = window.innerWidth <= 768;

  return (
    <div style={{
      ...styles.container,
      padding: isMobile ? '20px 12px' : '40px 24px',
    }}>
      <header style={{
        ...styles.header,
        marginBottom: isMobile ? '24px' : '48px',
      }}>
        <h1 style={{
          ...styles.title,
          fontSize: isMobile ? '32px' : '48px',
        }}>Video Forage</h1>
        <p style={{
          ...styles.subtitle,
          fontSize: isMobile ? '14px' : '18px',
        }}>Upload videos and create multiple variants</p>
      </header>

      <div style={{
        ...styles.grid,
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '20px' : '32px',
      }}>
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 24px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '48px',
    animation: 'fadeInDown 0.8s ease-out',
  },
  title: {
    fontSize: '48px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '12px',
    textShadow: '0 2px 20px rgba(0,0,0,0.1)',
    letterSpacing: '-1px',
  },
  subtitle: {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
    letterSpacing: '0.5px',
  },
  loading: {
    textAlign: 'center',
    padding: '48px',
    fontSize: '20px',
    color: '#ffffff',
    fontWeight: '500',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px',
    maxWidth: '1600px',
    margin: '0 auto',
    animation: 'fadeIn 0.6s ease-out',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '20px',
    },
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideInLeft 0.6s ease-out',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideInRight 0.6s ease-out',
  },
  '@media (max-width: 768px)': {
    container: {
      padding: '20px 12px',
    },
    title: {
      fontSize: '32px',
    },
    subtitle: {
      fontSize: '14px',
    },
    header: {
      marginBottom: '24px',
    },
  },
};

export default Dashboard;
