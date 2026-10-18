import type { CoverageData } from "./components/CoverageAvailabilityStep";
import type { LocationData } from "./components/LocationStep";
import type { PersonalData } from "./components/PersonalDataStep";
import type { ProfessionalInfoData } from "./components/ProfessionalInfoStep";
import type { OfferedServiceData } from "./components/ServicesStep";

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export type ServiceRowError = Partial<
  Record<keyof OfferedServiceData, string>
>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneCharactersPattern = /^[+\d\s()-]+$/;
const postalCodePattern = /^[A-Za-z0-9 -]+$/;

const profilePhotoMaxBytes = 5 * 1024 * 1024;
export const documentationMaxBytes = 10 * 1024 * 1024;
export const acceptedDocumentationTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

export function hasFieldErrors<T>(errors: FieldErrors<T>) {
  return Object.keys(errors).length > 0;
}

export function validatePersonalData(data: PersonalData) {
  const errors: FieldErrors<PersonalData> = {};
  const nombre = data.nombre.trim();
  const apellido = data.apellido.trim();
  const email = data.email.trim();
  const telefono = data.telefono.trim();
  const phoneDigits = telefono.replace(/\D/g, "");

  if (!nombre) errors.nombre = "Ingresá tu nombre.";
  else if (nombre.length > 100)
    errors.nombre = "El nombre no puede superar los 100 caracteres.";

  if (!apellido) errors.apellido = "Ingresá tu apellido.";
  else if (apellido.length > 100)
    errors.apellido = "El apellido no puede superar los 100 caracteres.";

  if (!email) errors.email = "Ingresá tu email.";
  else if (email.length > 50)
    errors.email = "El email no puede superar los 50 caracteres.";
  else if (!emailPattern.test(email))
    errors.email = "Ingresá un email con formato válido.";

  if (!data.contrasena) errors.contrasena = "Ingresá una contraseña.";
  else if (data.contrasena.length < 8)
    errors.contrasena = "La contraseña debe tener al menos 8 caracteres.";
  else if (data.contrasena.length > 72)
    errors.contrasena = "La contraseña no puede superar los 72 caracteres.";
  else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(data.contrasena))
    errors.contrasena = "Debe incluir al menos una letra y un número.";

  if (!telefono) errors.telefono = "Ingresá un teléfono.";
  else if (telefono.length > 30)
    errors.telefono = "El teléfono no puede superar los 30 caracteres.";
  else if (!phoneCharactersPattern.test(telefono))
    errors.telefono = "Usá solamente números, espacios, +, guiones o paréntesis.";
  else if (phoneDigits.length < 6 || phoneDigits.length > 15)
    errors.telefono = "El teléfono debe contener entre 6 y 15 números.";

  if (data.fotoPerfil && !data.fotoPerfil.type.startsWith("image/"))
    errors.fotoPerfil = "La foto de perfil debe ser una imagen.";
  else if (data.fotoPerfil && data.fotoPerfil.size > profilePhotoMaxBytes)
    errors.fotoPerfil = "La foto de perfil no puede superar los 5 MB.";

  return errors;
}

export function validateLocation(data: LocationData) {
  const errors: FieldErrors<LocationData> = {};
  const direccion = data.direccion.trim();
  const ciudad = data.ciudad.trim();
  const codigoPostal = data.codigoPostal.trim();

  if (direccion.length > 200)
    errors.direccion = "La dirección no puede superar los 200 caracteres.";
  if (ciudad.length > 100)
    errors.ciudad = "La ciudad no puede superar los 100 caracteres.";
  if (codigoPostal.length > 10)
    errors.codigoPostal = "El código postal no puede superar los 10 caracteres.";
  else if (codigoPostal && !postalCodePattern.test(codigoPostal))
    errors.codigoPostal = "Ingresá un código postal válido.";

  return errors;
}

export function validateProfessionalInfo(data: ProfessionalInfoData) {
  const errors: FieldErrors<ProfessionalInfoData> = {};
  const years = Number(data.aniosExperiencia);
  const descripcion = data.descripcion.trim();

  if (!descripcion) errors.descripcion = "Ingresá una descripción profesional.";
  else if (descripcion.length > 500)
    errors.descripcion = "La descripción no puede superar los 500 caracteres.";

  if (data.aniosExperiencia === "")
    errors.aniosExperiencia = "Ingresá los años de experiencia.";
  else if (!Number.isInteger(years) || years < 0 || years > 100)
    errors.aniosExperiencia = "Ingresá un número entero entre 0 y 100.";

  return errors;
}

export function validateCoverage(data: CoverageData) {
  const errors: FieldErrors<CoverageData> = {};
  const radius = Number(data.aceptaRadioKm);
  const ciudad = data.ciudad.trim();
  const disponibilidad = data.disponibilidad.trim();

  if (!ciudad) errors.ciudad = "Ingresá tu ciudad.";
  else if (ciudad.length > 100)
    errors.ciudad = "La ciudad no puede superar los 100 caracteres.";

  if (data.aceptaRadioKm === "")
    errors.aceptaRadioKm = "Ingresá el radio de cobertura.";
  else if (!Number.isInteger(radius) || radius < 0 || radius > 200)
    errors.aceptaRadioKm = "Ingresá un número entero entre 0 y 200 km.";

  if (!disponibilidad) errors.disponibilidad = "Ingresá tu disponibilidad.";
  else if (disponibilidad.length > 200)
    errors.disponibilidad = "La disponibilidad no puede superar los 200 caracteres.";

  return errors;
}

export function validateServices(data: OfferedServiceData[]) {
  const selectedIds = new Set<string>();

  return data.map((service) => {
    const errors: ServiceRowError = {};
    const amount = Number(service.monto);

    if (!service.idServ) errors.idServ = "Seleccioná un servicio.";
    else if (selectedIds.has(service.idServ))
      errors.idServ = "Este servicio ya fue agregado.";
    else selectedIds.add(service.idServ);

    if (service.monto === "") errors.monto = "Ingresá un monto.";
    else if (!Number.isInteger(amount) || amount <= 0)
      errors.monto = "Ingresá un monto entero mayor a 0.";

    return errors;
  });
}

export function hasServiceErrors(errors: ServiceRowError[]) {
  return errors.some((row) => Object.keys(row).length > 0);
}

export function validateDocumentation(file: File | null) {
  if (!file) return "";
  if (!acceptedDocumentationTypes.includes(file.type))
    return "Seleccioná un archivo PDF, JPG o PNG.";
  if (file.size > documentationMaxBytes)
    return "El archivo no puede superar los 10 MB.";
  return "";
}
