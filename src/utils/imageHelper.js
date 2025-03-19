import api from './axiosConfig';

/**
 * Upload image to server
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - A promise that resolves to the image URL
 */
export const uploadImage = async (file) => {
  try {
    // Convert file to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1]; // Remove data:image/jpeg;base64,

        // Upload to server
        api.post('/helpers/upload-image', { image: base64String })
          .then(response => {
            resolve(response.data.imageUrl);
          })
          .catch(error => {
            console.error('Error uploading image:', error);
            reject(error);
          });
      };
      reader.onerror = error => reject(error);
    });
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

/**
 * Create image preview from file
 * @param {File} file - The image file to preview
 * @param {Function} callback - Callback function that receives the preview URL
 */
export const createImagePreview = (file, callback) => {
  if (!file) return;
  
  const reader = new FileReader();
  reader.onloadend = () => {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
};