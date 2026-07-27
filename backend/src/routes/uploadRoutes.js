import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// ============================================
// CONFIGURE CLOUDINARY
// ============================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ============================================
// CONFIGURE MULTER WITH CLOUDINARY
// ============================================
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'inez-collections/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [
      { width: 800, height: 800, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ],
    public_id: (req, file) => {
      // Generate unique filename
      const ext = file.originalname.split('.').pop();
      return `${uuidv4()}`;
    },
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed (JPEG, PNG, WEBP, GIF)'), false);
    }
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
      
      // Cloudinary returns the URL
      const fileUrl = req.file.path;
      
      console.log('📸 Image uploaded to Cloudinary:', fileUrl);
      
      res.json({
        success: true,
        url: fileUrl,
        filename: req.file.filename,
        public_id: req.file.filename,
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
        url: file.path,
        filename: file.filename,
        public_id: file.filename,
      }));
      
      console.log(`📸 ${fileUrls.length} images uploaded to Cloudinary`);
      
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
// DELETE IMAGE FROM CLOUDINARY
// ============================================
router.delete('/upload/:public_id', async (req, res) => {
  try {
    const { public_id } = req.params;
    
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(`inez-collections/products/${public_id}`);
    
    if (result.result === 'ok') {
      console.log('🗑️ Image deleted from Cloudinary:', public_id);
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found'
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