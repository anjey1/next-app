import express from 'express';
import { protect } from '../middleware/auth';
import * as taskController from '../controllers/taskController';
import { upload } from '../config/upload';

const router = express.Router();

router.route('/')
  .post(protect, upload.single('image'), taskController.createTask)
  .get(protect, taskController.getTasks);

router.route('/:id')
  .put(protect, upload.single('image'), taskController.updateTask)
  .delete(protect, taskController.deleteTask);

export default router;