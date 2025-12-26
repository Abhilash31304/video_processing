import React, { useState } from 'react';
import { uploadVideo } from '../api/backend';

const UploadVideo = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await uploadVideo(file);
      console.log('Upload successful:', result);
      setFile(null);
      if (onUploadSuccess) {
        onUploadSuccess(result.video);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <div style={{
      ...styles.container,
      ...(isMobile && styles.containerMobile),
    }}>
      <h2 style={{
        ...styles.title,
        ...(isMobile && styles.titleMobile),
      }}>Upload Video</h2>
      
      <div style={styles.uploadArea}>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          style={styles.fileInput}
          disabled={uploading}
        />
        
        {file && (
          <div style={styles.fileInfo}>
            <p><strong>Selected:</strong> {file.name}</p>
            <p><strong>Size:</strong> {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          style={{
            ...styles.button,
            ...((!file || uploading) && styles.buttonDisabled)
          }}
        >
          {uploading ? 'Uploading...' : 'Upload Video'}
        </button>

        {error && <p style={styles.error}>{error}</p>}
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
    transition: 'all 0.3s ease',
  },
  containerMobile: {
    padding: '20px 16px',
    marginBottom: '20px',
    borderRadius: '12px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#2d3748',
    letterSpacing: '-0.5px',
  },
  titleMobile: {
    fontSize: '18px',
    marginBottom: '16px',
  },
  uploadArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  fileInput: {
    padding: '12px',
    border: '2px dashed #cbd5e0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#f7fafc',
  },
  fileInfo: {
    padding: '16px',
    background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
    borderRadius: '8px',
    fontSize: '14px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  button: {
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    letterSpacing: '0.5px',
  },
  buttonDisabled: {
    background: '#cbd5e0',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  error: {
    color: '#dc3545',
    fontSize: '14px',
    marginTop: '8px',
  },
};

export default UploadVideo;
