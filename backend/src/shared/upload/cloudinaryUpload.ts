import { cloudinary } from "../../config/cloudinary";

export function uploadBufferToCloudinary(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder, resource_type: "image" }, (error, result) => {
      if (error || !result) {
        reject(error ?? new Error("Cloudinary upload failed"));
        return;
      }
      resolve(result.secure_url);
    });

    uploadStream.end(buffer);
  });
}
