export const isValidPhoto = (file: File): boolean => {
  const validExtensions = ["png", "jpeg", "jpg", "webp"];
  const fileExtension = file.type?.split("/")[1]?.toLowerCase();
  return validExtensions.includes(fileExtension);
};
