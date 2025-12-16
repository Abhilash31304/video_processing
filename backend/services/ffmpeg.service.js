const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const { VIDEO_RESOLUTIONS, OUTPUTS_DIR, BITRATE_PROFILES, CODEC_CONFIGS } = require('../config/constants');
const { v4: uuidv4 } = require('uuid');

// Set FFmpeg path explicitly for Windows
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

class FFmpegService {
  async processVideo(inputPath, resolution, outputFormat) {
    return new Promise((resolve, reject) => {
      const resolutionConfig = VIDEO_RESOLUTIONS[resolution];
      
      if (!resolutionConfig) {
        return reject(new Error(`Invalid resolution: ${resolution}`));
      }

      const outputFilename = `${uuidv4()}_${resolution}.${outputFormat}`;
      const outputPath = path.join(OUTPUTS_DIR, outputFilename);

      const bitrate = BITRATE_PROFILES[resolution] || '2.5M';
      
      console.log(`[FFmpeg] Processing: ${inputPath} -> ${outputPath}`);
      console.log(`[FFmpeg] Target: ${resolution} (${resolutionConfig.width}x${resolutionConfig.height}), Format: ${outputFormat}, Bitrate: ${bitrate}`);

      let command = ffmpeg(inputPath)
        .output(outputPath)
        .size(`${resolutionConfig.width}x${resolutionConfig.height}`);

      // V1: MP4 with H.264 + AAC
      if (outputFormat === 'mp4' || outputFormat === 'mov') {
        command
          .videoCodec('libx264')
          .audioCodec('aac')
          .outputOptions([
            '-preset ultrafast',
            '-b:v ' + bitrate,
            '-b:a 128k',
            '-pix_fmt yuv420p'
          ]);
      } 
      // V2: WebM with VP9 + Opus (as per hackathon requirements)
      else if (outputFormat === 'webm') {
        command
          .videoCodec('libvpx-vp9')
          .audioCodec('libopus')
          .outputOptions([
            '-b:v ' + bitrate,
            '-b:a 128k',
            '-deadline realtime',
            '-cpu-used 8',          // Maximum speed
            '-threads 4'
          ]);
      }
      // Fallback
      else {
        command
          .videoCodec('libx264')
          .audioCodec('aac')
          .outputOptions([
            '-preset ultrafast',
            '-b:v ' + bitrate,
            '-b:a 128k'
          ]);
      }

      command.on('start', (commandLine) => {
          console.log('[FFmpeg] Command:', commandLine);
        })
        .on('progress', (progress) => {
          console.log(`Processing: ${progress.percent}% done`);
        })
        .on('end', () => {
          console.log('Processing finished successfully');
          resolve({
            outputPath,
            outputFilename,
            resolution,
            format: outputFormat
          });
        })
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          reject(err);
        })
        .run();
    });
  }

  async getVideoMetadata(inputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (err, metadata) => {
        if (err) {
          return reject(err);
        }
        
        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
        
        resolve({
          duration: metadata.format.duration,
          width: videoStream?.width,
          height: videoStream?.height,
          codec: videoStream?.codec_name,
          bitrate: metadata.format.bit_rate,
          size: metadata.format.size
        });
      });
    });
  }
}

module.exports = new FFmpegService();
