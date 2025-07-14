import express from 'express';
import {
  createChannel,
  getChannel,
  updateChannel,
  deleteChannel,
  toggleSubscription,

  
} from '../controllers/channelController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadBanner } from '../middleware/multer.js';

const router = express.Router();

router.post('/', protect, uploadBanner, createChannel);
router.get('/:id', getChannel);
router.put('/:id', protect, uploadBanner, updateChannel);
router.delete('/:id', protect, deleteChannel);
router.post('/:id/subscribe', protect, toggleSubscription);



export default router;
