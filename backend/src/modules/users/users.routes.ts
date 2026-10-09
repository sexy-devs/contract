import { Router } from "express";

import { asyncHandler } from "../../shared/http/asyncHandler";
import { requireAuth } from "../../shared/middleware/auth";
import { validateBody } from "../../shared/middleware/validate";
import { getMeHandler, updateMeHandler } from "./users.controller";
import { updateProfileSchema } from "./users.validation";

export const usersRouter = Router();

usersRouter.use(requireAuth);
usersRouter.get("/me", asyncHandler(getMeHandler));
usersRouter.patch("/me", validateBody(updateProfileSchema), asyncHandler(updateMeHandler));
