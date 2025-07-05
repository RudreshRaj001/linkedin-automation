import { Request, Response } from "express";
import axios from "axios";
import multer from "multer";
import fs from "fs";
const upload = multer({ storage: multer.memoryStorage() }).single("image");
const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const YOUR_LINKEDIN_PERSON_ID = process.env.YOUR_LINKEDIN_PERSON_ID;
const PERSON_URN = `urn:li:person:${YOUR_LINKEDIN_PERSON_ID}`;

// Controller for posting to LinkedIn
export const postToLinkedIn = async (req: Request, res: Response) => {
  const { postText } = req.body;

  if (!postText) {
    return res
      .status(400)
      .json({ error: "postText is required to publish a LinkedIn post." });
  }
  if (!LINKEDIN_ACCESS_TOKEN || !YOUR_LINKEDIN_PERSON_ID) {
    return res.status(500).json({
      error:
        "LinkedIn Access Token or Person ID is not configured on the server.",
    });
  }

  const linkedinPostUrl = "https://api.linkedin.com/v2/ugcPosts";
  const headers = {
    Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
    "X-Restli-Protocol-Version": "2.0.0",
    "Content-Type": "application/json",
  };

  const authorUrn = `urn:li:person:${YOUR_LINKEDIN_PERSON_ID}`;

  const payload = {
    author: authorUrn,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: postText,
        },
        shareMediaCategory: "NONE", // This signifies a text-only post
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC", // Post visible to everyone
    },
  };

  try {
    console.log(
      `Attempting to post to LinkedIn for person ID: ${YOUR_LINKEDIN_PERSON_ID}...`
    );
    const response = await axios.post(linkedinPostUrl, payload, {
      headers,
      timeout: 10000,
      family: 6,
    });
    console.log("LinkedIn post successful!");
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error(
      "Error posting to LinkedIn:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      error: "Failed to post content to LinkedIn.",
      details: error.response ? error.response.data : error.message,
    });
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  if (!LINKEDIN_ACCESS_TOKEN) {
    return res.status(500).json({
      error: "LinkedIn Access Token is not configured on the server.",
    });
  }
  const linkedinUserInfoUrl = "https://api.linkedin.com/v2/userinfo";
  const headers = {
    Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
    "X-Restli-Protocol-Version": "2.0.0",
  };

  try {
    console.log("Attempting to fetch LinkedIn user info...");
    const response = await axios.get(linkedinUserInfoUrl, {
      headers,
      timeout: 10000,
      family: 6,
    });
    console.log("LinkedIn user info fetched successfully!");
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error(
      "Error fetching LinkedIn user info:",
      error.response ? error.response.data : error.message
    );
    // ... (your existing error handling for timeout/unreachable)
    if (error.code === "ETIMEDOUT" || error.code === "ENETUNREACH") {
      console.error("Network connectivity issue:", error.message);
      res.status(504).json({
        error:
          "Gateway Timeout or Network Unreachable. The server could not connect to LinkedIn.",
        details: error.message,
      });
    } else {
      console.error(
        "Error fetching LinkedIn user info:",
        error.response ? error.response.data : error.message
      );
      res.status(500).json({
        error: "Failed to fetch LinkedIn user information.",
        details: error.response ? error.response.data : error.message,
      });
    }
  }
};

export const postImageToLinkedIn = [
  // first parse the multipart form
  (req: Request, res: Response, next: any) =>
    upload(req, res, (err) =>
      err ? res.status(400).json({ error: err.message }) : next()
    ),
  async (req: Request, res: Response) => {
    const { postText, title = "Image Post", description = "" } = req.body;
    const file = (req as any).file;

    if (!postText || !file) {
      return res
        .status(400)
        .json({ error: "Both postText and an image file are required." });
    }

    console.log("🗂️  req.file:", req.file);
    console.log("✏️  req.body:", req.body);

    // 1) REGISTER UPLOAD
    const registerPayload = {
      registerUploadRequest: {
        owner: PERSON_URN,
        recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
        serviceRelationships: [
          {
            identifier: "urn:li:userGeneratedContent",
            relationshipType: "OWNER",
          },
        ],
        supportedUploadMechanism: ["SYNCHRONOUS_UPLOAD"],
      },
    };

    try {
      const registerRes = await axios.post(
        "https://api.linkedin.com/v2/assets?action=registerUpload",
        registerPayload,
        {
          headers: {
            Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
            "X-Restli-Protocol-Version": "2.0.0",
            "Content-Type": "application/json",
          },
        }
      );

      const uploadInfo = registerRes.data.value;
      const uploadUrl =
        uploadInfo.uploadMechanism[
          "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
        ].uploadUrl;
      const assetUrn = uploadInfo.asset; // e.g. "urn:li:digitalmediaAsset:C4D00AAA..."

      // 2) UPLOAD BINARY
      await axios.put(uploadUrl, file.buffer, {
        headers: {
          Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
          "Content-Type": file.mimetype,
        },
      });

      // 3) CREATE THE UGC POST
      const ugcPayload = {
        author: PERSON_URN,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: postText },
            shareMediaCategory: "IMAGE",
            media: [
              {
                status: "READY",
                description: { text: description },
                media: assetUrn,
                title: { text: title },
              },
            ],
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      };

      const postRes = await axios.post(
        "https://api.linkedin.com/v2/ugcPosts",
        ugcPayload,
        {
          headers: {
            Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
            "X-Restli-Protocol-Version": "2.0.0",
            "Content-Type": "application/json",
          },
        }
      );

      return res.status(200).json(postRes.data);
    } catch (error: any) {
      console.error(
        "Error in postImageToLinkedIn:",
        error.response?.data || error.message
      );
      return res.status(500).json({
        error: "Failed to post image to LinkedIn.",
        details: error.response?.data || error.message,
      });
    }
  },
];
