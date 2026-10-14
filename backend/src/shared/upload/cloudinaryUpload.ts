import { cloudinary } from "../../config/cloudinary";
import { ValidationError } from "../errors/AppError";

export function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
  resourceType: "image" | "auto" = "image",
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder, resource_type: resourceType }, (error, result) => {
      if (error || !result) {
        if (error && error.http_code >= 400 && error.http_code < 500) {
          reject(new ValidationError(error.message ?? "El archivo enviado no es válido"));
          return;
        }

        reject(error ?? new Error("Cloudinary upload failed"));
        return;
      }
      resolve(result.secure_url);
    });

    uploadStream.end(buffer);
  });
}
