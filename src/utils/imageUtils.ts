/**
 * Utility functions for image processing
 */

/**
 * Compresses an image file to reduce size while maintaining quality
 * @param file - The image file to compress
 * @param maxWidth - Maximum width of the compressed image (default: 1200px)
 * @param quality - JPEG quality from 0 to 1 (default: 0.7)
 * @returns A Promise that resolves to a Blob of the compressed image
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.7,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        // Create canvas
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions if needed
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw image on canvas
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Could not create blob from canvas"));
            }
          },
          "image/jpeg",
          quality,
        );
      };

      img.onerror = () => {
        reject(new Error("Error loading image"));
      };
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };
  });
}

/**
 * Generates a thumbnail from an image file
 * @param file - The image file to create a thumbnail from
 * @param maxWidth - Maximum width of the thumbnail (default: 300px)
 * @returns A Promise that resolves to a Blob of the thumbnail
 */
export async function generateThumbnail(
  file: File,
  maxWidth: number = 300,
): Promise<Blob> {
  return compressImage(file, maxWidth, 0.6);
}
