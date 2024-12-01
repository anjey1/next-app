import express from 'express';
import { protect } from '../middleware/auth'; // , adminOnly
import * as userController from '../controllers/userController';

const router = express.Router();

router.route('/')
    .post(userController.loginUser)
    .get(protect, userController.getUserProfile);



router.route('/register').post(userController.registerUser)

export default router;