"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const geminiController_1 = require("../controllers/geminiController");
const router = (0, express_1.Router)();
// Route for generating LinkedIn post text
router.post('/generate-text', geminiController_1.generateText);
// Route for generating image
router.post('/generate-image', geminiController_1.generateImage);
exports.default = router;
