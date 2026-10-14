import multer from "multer";

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new Error("Solo se permiten archivos de imagen"));
      return;
    }
    callback(null, true);
  },
});
