import express from 'express';
import uploadMiddleware from '../../middleware/upload.middleware.js';
import { uploadImageToCloudinary } from '../../utils/cloudinaryUpload.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route POST /api/upload/image
 * @desc Uploads a single image to Cloudinary and returns { url, public_id }
 * @access Private
 */
router.post('/image', protect, uploadMiddleware.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image file provided.' });
        }

        const folder = req.body.folder || 'general'; // Default folder if none provided
        
        const result = await uploadImageToCloudinary(req.file.buffer, folder);

        return res.status(200).json({
            success: true,
            data: result // { url, public_id }
        });
    } catch (error) {
        console.error("Upload Route Error:", error);
        return res.status(500).json({
            success: false,
            message: 'Image upload failed.',
            error: error.message
        });
    }
});

export default router;
