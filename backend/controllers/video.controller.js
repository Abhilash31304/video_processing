const videoService = require('../services/video.service');
const path = require('path');
const { OUTPUTS_DIR } = require('../config/constants');

class VideoController {
  async uploadVideo(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No video file provided' });
      }

      const videoData = {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      };

      const video = await videoService.saveVideo(videoData);
      
      res.status(201).json({
        message: 'Video uploaded successfully',
        video
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllVideos(req, res, next) {
    try {
      const videos = await videoService.getAllVideos();
      res.json({ videos });
    } catch (error) {
      next(error);
    }
  }

  async getVideoById(req, res, next) {
    try {
      const { id } = req.params;
      const video = await videoService.getVideoById(id);
      
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }
      
      res.json({ video });
    } catch (error) {
      next(error);
    }
  }

  async deleteVideo(req, res, next) {
    try {
      const { id } = req.params;
      await videoService.deleteVideo(id);
      
      res.json({ message: 'Video deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async downloadFile(req, res, next) {
    try {
      const { filename } = req.params;
      const filePath = path.join(OUTPUTS_DIR, filename);
      
      res.download(filePath, filename, (err) => {
        if (err) {
          console.error('Download error:', err);
          if (!res.headersSent) {
            res.status(404).json({ error: 'File not found' });
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VideoController();
