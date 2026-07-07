import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

/**
 * Uploads an image buffer to Cloudinary.
 * @param {Buffer} fileBuffer - The memory buffer of the file from Multer.
 * @param {String} folderName - The folder name in Cloudinary (e.g., 'avatars', 'team-logos').
 * @returns {Promise<Object>} - Returns an object containing the secure URL and public_id.
 */
export const uploadImageToCloudinary = (fileBuffer, folderName) => {
    return new Promise((resolve, reject) => {
        if (!fileBuffer) return reject(new Error("No file buffer provided"));

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folderName,
                resource_type: 'image',
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    return reject(error);
                }
                resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};

/**
 * Deletes an image from Cloudinary using its public_id.
 * @param {String} publicId - The public_id of the image in Cloudinary.
 * @returns {Promise<Object>} - The deletion response from Cloudinary.
 */
export const deleteImageFromCloudinary = async (publicId) => {
    if (!publicId) return null;
    
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error(`Error deleting image ${publicId} from Cloudinary:`, error);
        throw error;
    }
};
