import { Router } from "express";

import { asyncHandler } from "../../shared/http/asyncHandler";
import { validateQuery } from "../../shared/middleware/validate";
import { getProviderPublicProfileHandler, searchProvidersHandler } from "./catalog.controller";
import { searchProvidersSchema } from "./catalog.validation";

export const catalogRouter = Router();

catalogRouter.get("/profesionales", validateQuery(searchProvidersSchema), asyncHandler(searchProvidersHandler));
catalogRouter.get("/profesionales/:id", asyncHandler(getProviderPublicProfileHandler));
