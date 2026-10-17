import type { Request, Response } from "express";

import * as catalogService from "./catalog.service";
import type { SearchProvidersInput } from "./catalog.validation";

export async function searchProvidersHandler(req: Request, res: Response) {
  const result = await catalogService.searchProviders(
    res.locals.query as SearchProvidersInput,
  );
  res.status(200).json(result);
}

export async function getProviderPublicProfileHandler(req: Request, res: Response) {
  const providerId = Number(req.params.id);
  const profile = await catalogService.getProviderPublicProfile(providerId);
  res.status(200).json(profile);
}

export async function listZonesHandler(_req: Request, res: Response) {
  res.status(200).json(await catalogService.listZones());
}

export async function listServicesHandler(_req: Request, res: Response) {
  res.status(200).json(await catalogService.listServices());
}
