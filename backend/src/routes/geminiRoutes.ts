import { Router } from 'express';
import { generateText, generateImage } from '../controllers/geminiController';

const router = Router();

// Route for generating LinkedIn post text
router.post('/generate-text', generateText);

// Route for generating image
router.post('/generate-image', generateImage);

export default router;

