import React from 'react';

const VideoList = ({ videos, selectedVideo, onSelectVideo, onDeleteVideo }) => {
  if (!videos || videos.length === 0) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>Videos</h3>
        <p style={styles.empty}>No videos uploaded yet</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Videos ({videos.length})</h3>
      
      <div style={styles.list}>
        {videos.map((video) => (
          <div
            key={video.id}
            style={{
              ...styles.videoItem,
              ...(selectedVideo?.id === video.id && styles.videoItemSelected)
            }}
            onClick={() => onSelectVideo(video)}
          >
            <div style={styles.videoInfo}>
              <p style={styles.videoName}>{video.original_name}</p>
              <p style={styles.videoMeta}>
                {(video.file_size / (1024 * 1024)).toFixed(2)} MB • {video.mime_type}
              </p>
              <p style={styles.videoDate}>
                {new Date(video.uploaded_at).toLocaleString()}
              </p>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteVideo(video.id);
              }}
              style={styles.deleteButton}
            >
              Delete
            </button>
          </div>
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
    marginBottom: '28px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15), 0 0 1px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.8)',
    backdropFilter: 'blur(10px)',
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
  videoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  videoItemSelected: {
    borderColor: '#667eea',
    background: 'linear-gradient(135deg, #f0f4ff 0%, #e8ecff 100%)',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
    transform: 'translateY(-2px)',
  },
  videoInfo: {
    flex: 1,
  },
  videoName: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '4px',
  },
  videoMeta: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '4px',
  },
  videoDate: {
    fontSize: '12px',
    color: '#999',
  },
  deleteButton: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginLeft: '12px',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(245, 101, 101, 0.3)',
  },
};

export default VideoList;
