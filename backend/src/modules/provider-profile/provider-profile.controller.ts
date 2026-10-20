import type { Request, Response } from "express";

import * as providerProfileService from "./provider-profile.service";

export async function getProviderProfileHandler(req: Request, res: Response) {
  const profile = await providerProfileService.getProviderProfile(req.user!.sub);
  res.status(200).json(profile);
}

export async function updateProviderProfileHandler(req: Request, res: Response) {
  const profile = await providerProfileService.updateProviderProfile(req.user!.sub, req.body);
  res.status(200).json(profile);
}

export async function getMyServicesHandler(req: Request, res: Response) {
  const services = await providerProfileService.getMyServices(req.user!.sub);
  res.status(200).json(services);
}

export async function replaceServicesHandler(req: Request, res: Response) {
  const services = await providerProfileService.replaceServices(req.user!.sub, req.body);
  res.status(200).json(services);
}

export async function createMatriculaHandler(req: Request, res: Response) {
  const matricula = await providerProfileService.createMatricula(req.user!.sub, req.body, req.file);
  res.status(201).json(matricula);
}

export async function getMyMatriculaHandler(req: Request, res: Response) {
  const matricula = await providerProfileService.getMyMatricula(req.user!.sub);
  res.status(200).json(matricula);
}

export async function updateMyMatriculaHandler(req: Request, res: Response) {
  const matricula = await providerProfileService.updateMyMatricula(req.user!.sub, req.body);
  res.status(200).json(matricula);
}

export async function deleteMyMatriculaHandler(req: Request, res: Response) {
  await providerProfileService.deleteMyMatricula(req.user!.sub);
  res.status(204).send();
}
