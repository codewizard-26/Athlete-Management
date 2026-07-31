import api from './axios';

/**
 * Uploads an image file to the backend, which proxies it to Cloudinary.
 * @param {File} file - The image file object from an input element.
 * @param {string} folder - The target folder name in Cloudinary (e.g., 'team-logos', 'avatars').
 * @returns {Promise<Object>} - The uploaded image data containing { url, public_id }
 */
export const uploadImage = async (file, folder) => {
    if (!file) throw new Error("No file provided for upload");
    
    // Extract raw browser File object if Ant Design wrapper object is passed
    const rawFile = file.originFileObj || file;

    const formData = new FormData();
    formData.append('image', rawFile);
    if (folder) {
        formData.append('folder', folder);
    }

    try {
        const response = await api.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        
        if (response.data && response.data.success) {
            return response.data.data; // { url, public_id }
        }
        throw new Error("Upload failed. No data returned.");
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};
