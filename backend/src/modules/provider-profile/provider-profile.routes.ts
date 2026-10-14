import { Router } from "express";

import { asyncHandler } from "../../shared/http/asyncHandler";
import { requireAuth, requireRole } from "../../shared/middleware/auth";
import { validateBody } from "../../shared/middleware/validate";
import { documentUpload } from "../../shared/upload/documentUpload";
import {
  createMatriculaHandler,
  getMyMatriculaHandler,
  getProviderProfileHandler,
  replaceServicesHandler,
  updateProviderProfileHandler,
} from "./provider-profile.controller";
import { createMatriculaSchema, replaceServicesSchema, updateProviderProfileSchema } from "./provider-profile.validation";

export const providerProfileRouter = Router();

providerProfileRouter.use(requireAuth, requireRole("profesional"));
providerProfileRouter.get("/me", asyncHandler(getProviderProfileHandler));
providerProfileRouter.patch("/me", validateBody(updateProviderProfileSchema), asyncHandler(updateProviderProfileHandler));
providerProfileRouter.put("/me/servicios", validateBody(replaceServicesSchema), asyncHandler(replaceServicesHandler));
providerProfileRouter.get("/me/matricula", asyncHandler(getMyMatriculaHandler));
providerProfileRouter.post(
  "/me/matricula",
  documentUpload.single("documento"),
  validateBody(createMatriculaSchema),
  asyncHandler(createMatriculaHandler),
);
