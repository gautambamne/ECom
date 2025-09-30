import multer from 'multer';
import { ApiError } from '../advices/ApiError';

// Allowed MIME types for images
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/gif'
];

// File size limit (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Configure multer for memory storage (no disk storage)
const upload = multer({
  storage: multer.memoryStorage(), // Store in memory buffer
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5 // Maximum 5 files at once
  },
  fileFilter: (req, file, cb) => {
    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new ApiError(
        400, 
        `Invalid file type: ${file.mimetype}. Only ${ALLOWED_MIME_TYPES.join(', ')} are allowed.`
      ) as any);
    }
    
    // Validate field name
    if (!['image', 'images'].includes(file.fieldname)) {
      return cb(new ApiError(
        400, 
        `Invalid field name: ${file.fieldname}. Use 'image' for single upload or 'images' for multiple.`
      ) as any);
    }

    cb(null, true);
  }
});

// Export different upload configurations
export const uploadSingle = upload.single('image');
export const uploadMultiple = upload.array('images', 5);
export const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 4 }
]);

export default upload;