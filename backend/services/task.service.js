const supabase = require('../config/supabaseClient');
const { TASK_STATUS } = require('../config/constants');
const fs = require('fs').promises;

class TaskService {
  async createTask(taskData) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        video_id: taskData.videoId,
        resolution: taskData.resolution,
        format: taskData.format,
        status: TASK_STATUS.QUEUED,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }

    return data;
  }

  async getAllTasks(videoId = null) {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (videoId) {
      query = query.eq('video_id', videoId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }

    return data;
  }

  async getTaskById(id) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch task: ${error.message}`);
    }

    return data;
  }

  async updateTaskStatus(id, status, additionalData = {}) {
    const updateData = {
      status,
      updated_at: new Date().toISOString(),
      ...additionalData
    };

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }

    return data;
  }

  async deleteTask(id) {
    const task = await this.getTaskById(id);
    
    if (!task) {
      throw new Error('Task not found');
    }

    // Delete output file if exists
    if (task.output_path) {
      try {
        await fs.unlink(task.output_path);
      } catch (err) {
        console.error('Failed to delete output file:', err);
      }
    }

    // Delete from database
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }
  }
}

module.exports = new TaskService();
