export type EditUserForm = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: string;
};

export type EditUserErrors = Partial<Record<keyof EditUserForm, string>>;

const nombrePattern = /^[A-Za-zÁÉÍÓÚÑÜáéíóúñü'\s-]+$/;
const telefonoPattern = /^\+?[0-9\s-]{6,30}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateNombre(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "Campo obligatorio.";
  if (trimmed.length > 100) return "No puede superar los 100 caracteres.";
  if (!nombrePattern.test(trimmed)) return "Solo se permiten letras y espacios.";
  return undefined;
}

export function validateEditUserForm(form: EditUserForm): EditUserErrors {
  const errors: EditUserErrors = {};

  const nombreError = validateNombre(form.nombre);
  if (nombreError) errors.nombre = nombreError;

  const apellidoError = validateNombre(form.apellido);
  if (apellidoError) errors.apellido = apellidoError;

  const email = form.email.trim();
  if (!email) errors.email = "Campo obligatorio.";
  else if (email.length > 50) errors.email = "No puede superar los 50 caracteres.";
  else if (!emailPattern.test(email)) errors.email = "Formato de email inválido.";

  const telefono = form.telefono.trim();
  if (!telefono) errors.telefono = "Campo obligatorio.";
  else if (telefono.length > 30) errors.telefono = "No puede superar los 30 caracteres.";
  else if (!telefonoPattern.test(telefono)) errors.telefono = "Solo números, espacios, + y -.";

  if (!form.rol) errors.rol = "Campo obligatorio.";

  return errors;
}

export function hasEditUserErrors(errors: EditUserErrors) {
  return Object.keys(errors).length > 0;
}
