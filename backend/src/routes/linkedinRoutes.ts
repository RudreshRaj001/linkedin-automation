import { Router } from 'express';
import { postToLinkedIn, getUserInfo } from '../controllers/linkedinController'; // Import getUserInfo

const router = Router();

// Route for posting to LinkedIn
router.post('/post', postToLinkedIn);

// Route for getting user info from LinkedIn
router.get('/userinfo', getUserInfo); // New route added

export default router;

