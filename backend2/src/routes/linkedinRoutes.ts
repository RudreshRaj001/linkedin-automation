import { Router } from 'express';
import { postToLinkedIn, getUserInfo, postImageToLinkedIn } from '../controllers/linkedinController'; // Import getUserInfo

const router = Router();

// Route for posting to LinkedIn
router.post('/post', postToLinkedIn);

// Route for getting user info from LinkedIn
router.get('/userinfo', getUserInfo);

router.post("/post-with-image", postImageToLinkedIn); 

export default router;
