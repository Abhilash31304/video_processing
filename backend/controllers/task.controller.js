const taskService = require('../services/task.service');
const videoQueue = require('../workers/video.worker');

class TaskController {
  async createTask(req, res, next) {
    try {
      const { videoId, resolution, format } = req.body;

      if (!videoId || !resolution || !format) {
        return res.status(400).json({ 
          error: 'Missing required fields: videoId, resolution, format' 
        });
      }

      const task = await taskService.createTask({
        videoId,
        resolution,
        format
      });

      // Add job to processing queue
      await videoQueue.add('process-video', {
        taskId: task.id,
        videoId,
        resolution,
        format
      });

      res.status(201).json({
        message: 'Task created successfully',
        task
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllTasks(req, res, next) {
    try {
      const { videoId } = req.query;
      const tasks = await taskService.getAllTasks(videoId);
      res.json({ tasks });
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req, res, next) {
    try {
      const { id } = req.params;
      const task = await taskService.getTaskById(id);
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.json({ task });
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      await taskService.deleteTask(id);
      
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
