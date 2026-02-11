export const imgbbUpload = async (imagesFile: File[]): Promise<string[]> => {
  const uploadedImageUrls: string[] = [];

  // Loop through each image file and upload to ImgBB
  for (let i = 0; i < imagesFile.length; i++) {
    const imageFile = imagesFile[i]; // Get each file
    const formData = new FormData();
    formData.append("image", imageFile); // Append the image file to FormData

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_TOKEN}`,
        {
          method: "POST",
          body: formData,
        },
      );
      const result = await res.json();

      if (result.success) {
        uploadedImageUrls.push(result.data.url); // Push the image URL to the array
      } else {
        console.error("Error uploading image:", result);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  // Return the array of image URLs after all uploads
  return uploadedImageUrls;
};
