import { Router } from "express";

import { asyncHandler } from "../../shared/http/asyncHandler";
import { validateQuery } from "../../shared/middleware/validate";
import { getProviderPublicProfileHandler, listServicesHandler, searchProvidersHandler } from "./catalog.controller";
import { searchProvidersSchema } from "./catalog.validation";
import { listZonesHandler } from "./catalog.controller";

export const catalogRouter = Router();

catalogRouter.get("/profesionales", validateQuery(searchProvidersSchema), asyncHandler(searchProvidersHandler));
catalogRouter.get("/profesionales/:id", asyncHandler(getProviderPublicProfileHandler));
catalogRouter.get("/zonas", asyncHandler(listZonesHandler));
catalogRouter.get("/servicios", asyncHandler(listServicesHandler));
