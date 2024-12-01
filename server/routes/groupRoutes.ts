import express from 'express';
import { protect, adminOnly } from '../middleware/auth';
import * as groupController from '../controllers/groupController';

const router = express.Router();

// Regular user routes
router.route('/')
  .post(protect, groupController.createGroup)
  .get(protect, groupController.getGroups);

router.route('/:id')
  .put(protect, groupController.updateGroup)
  .delete(protect, groupController.deleteGroup);

router.post('/:id/join', protect, groupController.joinGroup);
router.post('/:id/leave', protect, groupController.leaveGroup);

// Admin routes
router.get('/all', protect, adminOnly, groupController.getAllGroups);
router.put('/:groupId/members', protect, adminOnly, groupController.updateGroupMembers);

export default router;