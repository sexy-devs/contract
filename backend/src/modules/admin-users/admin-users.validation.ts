import { z } from "zod";

export const adminUserIdSchema = z.coerce.number().int().positive();
