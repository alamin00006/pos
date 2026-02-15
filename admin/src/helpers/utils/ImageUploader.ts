import toast from "react-hot-toast";
import { isValidPhoto } from "./isValidPhoto";
import { imgBbApi } from "./imgBb";

interface ImgBBResponse {
  success: boolean;
  data: {
    url: string;
  };
}

export const ImageUploader = async (files: File[]): Promise<string[]> => {
  const uploadedImageUrls: string[] = [];

  // Iterate over each file and upload
  for (const file of files) {
    // Check file size (5MB limit)
    if (file.size > 5000000) {
      toast.error(`Picture ${file.name} exceeds 5MB, upload not allowed`);
      continue;
    }

    // Validate the photo
    if (!isValidPhoto(file)) {
      toast.error(`picture ${file.name} is not valid`);
      continue;
    }

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append("image", file);

      // ImgBB upload URL
      const url = `https://api.imgbb.com/1/upload?key=${imgBbApi}`;

      // Upload image
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const imgData: ImgBBResponse = await response.json();

      // Handle response
      if (imgData.success) {
        const imageUrl = imgData.data.url;
        uploadedImageUrls.push(imageUrl);
        // toast.success(`Image ${file.name} uploaded successfully!`);
      } else {
        toast.error(`Failed to upload image ${file.name}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(`An error occurred during the upload of ${file.name}`);
    }
  }

  return uploadedImageUrls;
};
