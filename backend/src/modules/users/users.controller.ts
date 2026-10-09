import type { Request, Response } from "express";

import * as usersService from "./users.service";

export async function getMeHandler(req: Request, res: Response) {
  const profile = await usersService.getProfile(req.user!.sub);
  res.status(200).json(profile);
}

export async function updateMeHandler(req: Request, res: Response) {
  const profile = await usersService.updateProfile(req.user!.sub, req.body);
  res.status(200).json(profile);
}
