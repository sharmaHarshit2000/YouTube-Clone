import express from 'express';
import {
  searchVideos,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  uploadVideo,

} from '../controllers/videoController.js';
import { protect } from '../middleware/authMiddleware.js';
import commentRoutes from './commentRoutes.js';
import { uploadBoth } from '../middleware/multer.js';

const router = express.Router();

router.use('/:videoId/comments', commentRoutes);

// Main video routes
router.get('/search', searchVideos);
router.get('/', getAllVideos);
router.get('/:id', getVideoById);
router.put('/:id', protect, uploadBoth, updateVideo);
router.delete('/:id', protect, deleteVideo);
router.post('/:id/like', protect, likeVideo);
router.post('/:id/dislike', protect, dislikeVideo);
router.post('/upload', protect, uploadBoth, uploadVideo);



export default router;
