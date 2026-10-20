import { Router } from "express";

import { asyncHandler } from "../../shared/http/asyncHandler";
import { validateBody } from "../../shared/middleware/validate";
import { loginHandler, registerHandler } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";

export const authRouter = Router();

authRouter.post("/registro", validateBody(registerSchema), asyncHandler(registerHandler));
authRouter.post("/login", validateBody(loginSchema), asyncHandler(loginHandler));
