import toast from "react-hot-toast";

import { isValidPhoto } from "./isValidPhoto";
import { imgBbApi } from "./imgBb";

export const uploadImageToImgBB = async (file) => {
  // Check file size (5MB limit)
  if (file.size > 5000000) {
    toast.error("Picture size exceeds 5MB, upload not allowed");
    return null;
  }
  // Validate check
  if (!isValidPhoto(file)) {
    toast.error("Product picture is not valid");
    return null;
  }

  try {
    const formData = new FormData();
    formData.append("image", file);

    const url = `https://api.imgbb.com/1/upload?key=${imgBbApi}`;

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const imgData = await response.json();

    if (imgData.success) {
      const imageUrl = imgData.data.url;
      // toast.success("Image uploaded successfully!");
      return imageUrl;
    } else {
      toast.error("Failed to upload image");
      return null;
    }
  } catch (error) {
    toast.error("An error occurred during image upload");

    return null;
  }
};
