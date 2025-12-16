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

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Upload Video</h2>
      
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
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#333',
  },
  uploadArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fileInput: {
    padding: '8px',
    border: '2px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  fileInfo: {
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    fontSize: '14px',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  error: {
    color: '#dc3545',
    fontSize: '14px',
    marginTop: '8px',
  },
};

export default UploadVideo;
