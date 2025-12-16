const path = require('path');

module.exports = {
  // File paths
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  ORIGINALS_DIR: path.join(process.env.UPLOAD_DIR || './uploads', 'originals'),
  OUTPUTS_DIR: path.join(process.env.UPLOAD_DIR || './uploads', 'outputs'),
  
  // File constraints
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 200 * 1024 * 1024, // 200MB
  ALLOWED_MIME_TYPES: [
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'video/x-msvideo'
  ],
  ALLOWED_EXTENSIONS: ['.mp4', '.mov', '.webm', '.avi'],
  
  // Video processing presets
  VIDEO_RESOLUTIONS: {
    '360p': { width: 640, height: 360 },
    '480p': { width: 854, height: 480 },
    '720p': { width: 1280, height: 720 },
    '1080p': { width: 1920, height: 1080 },
    '1440p': { width: 2560, height: 1440 },
    '4k': { width: 3840, height: 2160 }
  },
  
  // Bitrate profiles (as per hackathon requirements)
  BITRATE_PROFILES: {
    '480p': '1M',    // ~1 Mbps
    '720p': '2.5M',  // ~2.5 Mbps
    '1080p': '5M',   // ~5 Mbps
    '1440p': '8M',   // Higher resolution
    '4k': '15M'      // 4K resolution
  },
  
  // Codec configurations
  CODEC_CONFIGS: {
    mp4: {
      videoCodec: 'libx264',
      audioCodec: 'aac'
    },
    webm: {
      videoCodec: 'libvpx-vp9',
      audioCodec: 'libopus'
    },
    mov: {
      videoCodec: 'libx264',
      audioCodec: 'aac'
    }
  },
  
  // Supported output formats
  OUTPUT_FORMATS: ['mp4', 'webm', 'mov'],
  
  // Task statuses
  TASK_STATUS: {
    QUEUED: 'queued',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed'
  }
};
