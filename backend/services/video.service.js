const supabase = require('../config/supabaseClient');
const fs = require('fs').promises;
const path = require('path');

class VideoService {
  async saveVideo(videoData) {
    const { data, error } = await supabase
      .from('videos')
      .insert([{
        original_name: videoData.originalName,
        filename: videoData.filename,
        file_path: videoData.path,
        file_size: videoData.size,
        mime_type: videoData.mimetype,
        uploaded_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save video: ${error.message}`);
    }

    return data;
  }

  async getAllVideos() {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch videos: ${error.message}`);
    }

    return data;
  }

  async getVideoById(id) {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch video: ${error.message}`);
    }

    return data;
  }

  async deleteVideo(id) {
    const video = await this.getVideoById(id);
    
    if (!video) {
      throw new Error('Video not found');
    }

    // Delete file from disk
    try {
      await fs.unlink(video.file_path);
    } catch (err) {
      console.error('Failed to delete video file:', err);
    }

    // Delete from database
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete video: ${error.message}`);
    }
  }
}

module.exports = new VideoService();
