import type { Request, Response } from "express";

import * as adminUsersService from "./admin-users.service";
import { adminUserIdSchema } from "./admin-users.validation";

export async function deactivateUserHandler(req: Request, res: Response) {
  const userId = adminUserIdSchema.parse(req.params.id);
  const user = await adminUsersService.deactivateUser(userId, req.user!.sub);

  res.status(200).json(user);
}
