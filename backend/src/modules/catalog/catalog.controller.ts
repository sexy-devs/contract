import type { Request, Response } from "express";

import * as catalogService from "./catalog.service";

export async function searchProvidersHandler(req: Request, res: Response) {
  const result = await catalogService.searchProviders(req.query as unknown as Parameters<typeof catalogService.searchProviders>[0]);
  res.status(200).json(result);
}

export async function getProviderPublicProfileHandler(req: Request, res: Response) {
  const providerId = Number(req.params.id);
  const profile = await catalogService.getProviderPublicProfile(providerId);
  res.status(200).json(profile);
}
