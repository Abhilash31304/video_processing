const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller');
const uploadMiddleware = require('../middlewares/upload.middleware');

// Upload video
router.post('/upload', uploadMiddleware.single('video'), videoController.uploadVideo);

// Get all videos
router.get('/', videoController.getAllVideos);

// Download output file (must be before /:id route)
router.get('/download/:filename', videoController.downloadFile);

// Get video by ID
router.get('/:id', videoController.getVideoById);

// Delete video
router.delete('/:id', videoController.deleteVideo);

module.exports = router;
