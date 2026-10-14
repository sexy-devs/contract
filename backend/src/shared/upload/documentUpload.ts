import multer from "multer";

import { ValidationError } from "../errors/AppError";

export const documentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/") && file.mimetype !== "application/pdf") {
      callback(new ValidationError("Solo se permiten imágenes o archivos PDF"));
      return;
    }
    callback(null, true);
  },
});
