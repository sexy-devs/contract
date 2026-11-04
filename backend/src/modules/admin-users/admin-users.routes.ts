import { Router } from "express";

import { asyncHandler } from "../../shared/http/asyncHandler";
import { requireAuth, requireRole } from "../../shared/middleware/auth";
import { deactivateUserHandler } from "./admin-users.controller";

export const adminUsersRouter = Router();

adminUsersRouter.use(requireAuth, requireRole("admin"));
adminUsersRouter.delete("/:id", asyncHandler(deactivateUserHandler));
