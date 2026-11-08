import type { Request, Response } from "express";

import * as adminUsersService from "./admin-users.service";
import { adminUserIdSchema, type ListAdminUsersQuery } from "./admin-users.validation";

export async function listUsersHandler(_req: Request, res: Response) {
  const users = await adminUsersService.listUsers(res.locals.query as ListAdminUsersQuery);
  res.status(200).json(users);
}

export async function updateUserHandler(req: Request, res: Response) {
  const userId = adminUserIdSchema.parse(req.params.id);
  const user = await adminUsersService.updateUser(userId, req.user!.sub, req.body);

  res.status(200).json(user);
}

export async function deactivateUserHandler(req: Request, res: Response) {
  const userId = adminUserIdSchema.parse(req.params.id);
  const user = await adminUsersService.deactivateUser(userId, req.user!.sub);

  res.status(200).json(user);
}
