import express from "express";
import { Router } from "express";
import multer from "multer";

const router = Router();

import storage  from "../cloudConfig.js";

const upload = multer({ storage });

router.post('/audio', upload.single('audio'), (req, res) => {
  console.log("Request received at /audio");
  console.log("req.file:", req.file);
  console.log("req.body:", req.body);
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    message: 'Audio uploaded successfully!',
    fileUrl: req.file.path,
    publicId: req.file.filename
  });
});

export default router;
