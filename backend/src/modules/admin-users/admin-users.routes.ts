import { Router } from "express";

import { asyncHandler } from "../../shared/http/asyncHandler";
import { requireAuth, requireRole } from "../../shared/middleware/auth";
import { validateBody, validateQuery } from "../../shared/middleware/validate";
import { deactivateUserHandler, listUsersHandler, updateUserHandler } from "./admin-users.controller";
import { listAdminUsersQuerySchema, updateAdminUserSchema } from "./admin-users.validation";

export const adminUsersRouter = Router();

adminUsersRouter.use(requireAuth, requireRole("admin"));
adminUsersRouter.get("/", validateQuery(listAdminUsersQuerySchema), asyncHandler(listUsersHandler));
adminUsersRouter.patch("/:id", validateBody(updateAdminUserSchema), asyncHandler(updateUserHandler));
adminUsersRouter.delete("/:id", asyncHandler(deactivateUserHandler));
