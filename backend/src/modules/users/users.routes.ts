import { Router } from "express";

import { asyncHandler } from "../../shared/http/asyncHandler";
import { requireAuth } from "../../shared/middleware/auth";
import { validateBody } from "../../shared/middleware/validate";
import { imageUpload } from "../../shared/upload/multer";
import { getMeHandler, updateMeHandler, updateMePhotoHandler } from "./users.controller";
import { updateProfileSchema } from "./users.validation";

export const usersRouter = Router();

usersRouter.use(requireAuth);
usersRouter.get("/me", asyncHandler(getMeHandler));
usersRouter.patch("/me", validateBody(updateProfileSchema), asyncHandler(updateMeHandler));
usersRouter.patch("/me/foto", imageUpload.single("foto"), asyncHandler(updateMePhotoHandler));
