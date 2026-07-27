import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ============================================
// DETECT ENVIRONMENT
// ============================================
const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

// ============================================
// USE /tmp FOR UPLOADS ON VERCEL
// ============================================
const uploadDir = isVercel 
  ? path.join(os.tmpdir(), 'uploads') 
  : path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`📁 Uploads folder created at: ${uploadDir}`);
  }
} catch (error) {
  console.error('❌ Failed to create uploads directory:', error.message);
}

// ============================================
// CONFIGURE MULTER
// ============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed (JPEG, PNG, WEBP, GIF)'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// ============================================
// UPLOAD SINGLE IMAGE
// ============================================
router.post('/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }
      
      // Return RELATIVE PATH for both environments
      const fileUrl = `/uploads/${req.file.filename}`;
      
      console.log('📸 Image uploaded:', fileUrl);
      
      res.json({
        success: true,
        url: fileUrl,
        filename: req.file.filename,
        message: 'Image uploaded successfully'
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });
});

// ============================================
// UPLOAD MULTIPLE IMAGES
// ============================================
router.post('/upload-multiple', (req, res) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }
      
      const fileUrls = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
        filename: file.filename,
      }));
      
      console.log(`📸 ${fileUrls.length} images uploaded`);
      
      res.json({
        success: true,
        files: fileUrls,
        message: `${fileUrls.length} images uploaded successfully`
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });
});

// ============================================
// DELETE IMAGE
// ============================================
router.delete('/upload/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('🗑️ Image deleted:', filename);
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;