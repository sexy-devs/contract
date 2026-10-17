import type { Request, Response } from "express";

import * as catalogService from "./catalog.service";

export async function listServiciosHandler(_req: Request, res: Response) {
  const servicios = await catalogService.listServicios();
  res.status(200).json(servicios);
}

export async function searchProvidersHandler(_req: Request, res: Response) {
  const result = await catalogService.searchProviders(res.locals.query);
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
