import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";

import { openapiDocument } from "./docs/openapi";
import { authRouter } from "./modules/auth/auth.routes";
import { catalogRouter } from "./modules/catalog/catalog.routes";
import { providerProfileRouter } from "./modules/provider-profile/provider-profile.routes";
import { usersRouter } from "./modules/users/users.routes";
import { errorHandler, notFoundHandler } from "./shared/middleware/errorHandler";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

app.use("/api/auth", authRouter);
app.use("/api/usuarios", usersRouter);
app.use("/api/profesionales", providerProfileRouter);
app.use("/api/catalogo", catalogRouter);

app.use(notFoundHandler);
app.use(errorHandler);
