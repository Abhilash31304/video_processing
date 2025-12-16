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
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#333',
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
    padding: '16px',
    border: '2px solid #e9ecef',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  videoItemSelected: {
    borderColor: '#007bff',
    backgroundColor: '#f0f8ff',
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
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    marginLeft: '12px',
  },
};

export default VideoList;
