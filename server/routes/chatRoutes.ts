import express from 'express';
import { protect } from '../middleware/auth';
import * as chatController from '../controllers/chatController';

const router = express.Router();

router.get('/:groupId/messages', protect, chatController.getMessages);
router.post('/:groupId/messages', protect, chatController.sendMessage);

export default router;