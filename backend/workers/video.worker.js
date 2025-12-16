const videoService = require('../services/video.service');
const taskService = require('../services/task.service');
const ffmpegService = require('../services/ffmpeg.service');
const { TASK_STATUS } = require('../config/constants');

// Simple in-memory queue for development (no Redis needed)
const processVideo = async (job) => {
  const { taskId, videoId, resolution, format } = job.data;

  try {
    console.log(`[Worker] Starting task ${taskId} - ${resolution} ${format}`);
    
    // Update task status to processing
    await taskService.updateTaskStatus(taskId, TASK_STATUS.PROCESSING);
    console.log(`[Worker] Task ${taskId} status updated to PROCESSING`);

    // Get video details
    const video = await videoService.getVideoById(videoId);
    
    if (!video) {
      throw new Error('Video not found');
    }

    // Process video with FFmpeg
    const result = await ffmpegService.processVideo(
      video.file_path,
      resolution,
      format
    );

    // Update task with output information
    await taskService.updateTaskStatus(taskId, TASK_STATUS.COMPLETED, {
      output_path: result.outputPath,
      output_filename: result.outputFilename,
      completed_at: new Date().toISOString()
    });
    console.log(`[Worker] Task ${taskId} COMPLETED successfully`);

    return { success: true, taskId };
  } catch (error) {
    console.error('[Worker] Video processing error:', error);
    
    // Update task status to failed
    try {
      await taskService.updateTaskStatus(taskId, TASK_STATUS.FAILED, {
        error_message: error.message,
        completed_at: new Date().toISOString()
      });
      console.log(`[Worker] Task ${taskId} marked as FAILED`);
    } catch (updateError) {
      console.error('[Worker] Failed to update task status:', updateError);
    }

    // Don't throw to prevent worker crash
    return { success: false, taskId, error: error.message };
  }
};

// Export a simple queue interface
module.exports = {
  add: async (jobName, data) => {
    console.log(`[Queue] Adding job: ${jobName}`, data);
    // Process immediately in the background
    setImmediate(async () => {
      try {
        await processVideo({ data });
      } catch (error) {
        console.error('[Queue] Job processing failed:', error);
      }
    });
    return { id: Date.now() };
  }
};
