import api from './axios';

/**
 * Uploads an image file to the backend, which proxies it to Cloudinary.
 * @param {File} file - The image file object from an input element.
 * @param {string} folder - The target folder name in Cloudinary (e.g., 'team-logos', 'avatars').
 * @returns {Promise<Object>} - The uploaded image data containing { url, public_id }
 */
export const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const rawFile = file.originFileObj || file;
        if (!(rawFile instanceof Blob)) {
            return resolve(typeof file === "string" ? { url: file, public_id: null } : { url: "", public_id: null });
        }
        const reader = new FileReader();
        reader.readAsDataURL(rawFile);
        reader.onload = () => resolve({ url: reader.result, public_id: null });
        reader.onerror = (error) => reject(error);
    });
};

export const uploadImage = async (file, folder) => {
    if (!file) throw new Error("No file provided for upload");
    
    // Extract raw browser File object if Ant Design wrapper object is passed
    const rawFile = file.originFileObj || file;

    try {
        const formData = new FormData();
        formData.append('image', rawFile);
        if (folder) {
            formData.append('folder', folder);
        }

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
        console.warn("Cloudinary API upload failed, applying Base64 resilient fallback:", error);
        return await convertFileToBase64(rawFile);
    }
};
