"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const linkedinController_1 = require("../controllers/linkedinController"); // Import getUserInfo
const router = (0, express_1.Router)();
// Route for posting to LinkedIn
router.post('/post', linkedinController_1.postToLinkedIn);
// Route for getting user info from LinkedIn
router.get('/userinfo', linkedinController_1.getUserInfo); // New route added
exports.default = router;
