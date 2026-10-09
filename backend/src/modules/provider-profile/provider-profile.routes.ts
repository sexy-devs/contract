import { Router } from "express";

import { asyncHandler } from "../../shared/http/asyncHandler";
import { requireAuth, requireRole } from "../../shared/middleware/auth";
import { validateBody } from "../../shared/middleware/validate";
import {
  createMatriculaHandler,
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
providerProfileRouter.post("/me/matricula", validateBody(createMatriculaSchema), asyncHandler(createMatriculaHandler));
