import { Router } from "express";

import { asyncHandler } from "../../shared/http/asyncHandler";
import { validateQuery } from "../../shared/middleware/validate";
import {
  getProviderPublicProfileHandler,
  listServiciosHandler,
  listZonesHandler,
  searchProvidersHandler,
} from "./catalog.controller";
import { searchProvidersSchema } from "./catalog.validation";

export const catalogRouter = Router();

catalogRouter.get("/servicios", asyncHandler(listServiciosHandler));
catalogRouter.get("/profesionales", validateQuery(searchProvidersSchema), asyncHandler(searchProvidersHandler));
catalogRouter.get("/profesionales/:id", asyncHandler(getProviderPublicProfileHandler));
catalogRouter.get("/zonas", asyncHandler(listZonesHandler));
