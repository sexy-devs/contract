import { useEffect, useState } from "react";
import { ApiError } from "../../../lib/api";
import { listServicios, type ServicioCatalogo } from "../../catalog/api/catalogApi";
import {
  getMyMatricula,
  getMyProviderProfile,
  getMyServices,
  updateMyProviderProfile,
  uploadMyMatricula,
  replaceMyServices,
  type Matricula,
  type ProviderProfile,
} from "../../providers/api/providerProfileApi";
import { getMe, updateMe, updateMyPhoto, type UserProfile } from "../api/usersApi";

type PersonalForm = { nombre: string; apellido: string; telefono: string };
type PersonalErrors = Partial<Record<keyof PersonalForm, string>>;
type ProfessionalForm = { descripcion: string; aniosExperiencia: string };
type CoverageForm = { aceptaRadioKm: string; disponibilidad: string };
type ServicioRow = { localId: number; idServ: string; monto: string };

const NAME_PATTERN = /^[A-Za-zÁÉÍÓÚÑÜáéíóúñü'\s-]+$/;
const PHONE_PATTERN = /^\+?[0-9\s-]{6,30}$/;

let localIdSeq = 1;

export function usePrestadorProfile() {
  const [usuario, setUsuario] = useState<UserProfile | null>(null);
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [catalogo, setCatalogo] = useState<ServicioCatalogo[]>([]);
  const [matricula, setMatricula] = useState<Matricula | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [personalForm, setPersonalForm] = useState<PersonalForm>({ nombre: "", apellido: "", telefono: "" });
  const [personalErrors, setPersonalErrors] = useState<PersonalErrors>({});
  const [personalSaving, setPersonalSaving] = useState(false);
  const [personalSaved, setPersonalSaved] = useState(false);

  const [professionalForm, setProfessionalForm] = useState<ProfessionalForm>({ descripcion: "", aniosExperiencia: "0" });
  const [professionalSaving, setProfessionalSaving] = useState(false);
  const [professionalSaved, setProfessionalSaved] = useState(false);

  const [coverageForm, setCoverageForm] = useState<CoverageForm>({ aceptaRadioKm: "0", disponibilidad: "" });
  const [coverageSaving, setCoverageSaving] = useState(false);
  const [coverageSaved, setCoverageSaved] = useState(false);

  const [servicios, setServicios] = useState<ServicioRow[]>([]);
  const [serviciosSaving, setServiciosSaving] = useState(false);
  const [serviciosSaved, setServiciosSaved] = useState(false);
  const [serviciosError, setServiciosError] = useState<string | null>(null);

  const [matriculaUploading, setMatriculaUploading] = useState(false);
  const [matriculaError, setMatriculaError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getMe(), getMyProviderProfile(), getMyServices(), getMyMatricula(), listServicios()])
      .then(([usuarioData, providerData, serviciosData, matriculaData, catalogoData]) => {
        setUsuario(usuarioData);
        setProvider(providerData);
        setMatricula(matriculaData);
        setCatalogo(catalogoData);
        setPersonalForm({ nombre: usuarioData.nombre, apellido: usuarioData.apellido, telefono: usuarioData.telefono });
        setProfessionalForm({
          descripcion: providerData.descripcion ?? "",
          aniosExperiencia: String(providerData.aniosExperiencia),
        });
        setCoverageForm({
          aceptaRadioKm: String(providerData.aceptaRadioKm),
          disponibilidad: providerData.disponibilidad ?? "",
        });
        setServicios(
          serviciosData.map((s) => ({ localId: localIdSeq++, idServ: String(s.idServ), monto: String(s.monto) })),
        );
      })
      .catch((err) => setLoadError(err instanceof ApiError ? err.message : "No se pudo cargar el perfil."))
      .finally(() => setLoading(false));
  }, []);

  async function uploadPhoto(file: File) {
    setUploadingPhoto(true);
    try {
      const updated = await updateMyPhoto(file);
      setUsuario(updated);
    } catch {
      // el error se refleja visualmente dejando la foto sin cambios
    } finally {
      setUploadingPhoto(false);
    }
  }

  function setPersonalField(key: keyof PersonalForm, value: string) {
    setPersonalForm((f) => ({ ...f, [key]: value }));
    setPersonalSaved(false);
  }

  function validatePersonal() {
    const next: PersonalErrors = {};
    if (!personalForm.nombre.trim()) next.nombre = "Este campo es obligatorio.";
    else if (!NAME_PATTERN.test(personalForm.nombre)) next.nombre = "Solo se permiten letras y espacios.";

    if (!personalForm.apellido.trim()) next.apellido = "Este campo es obligatorio.";
    else if (!NAME_PATTERN.test(personalForm.apellido)) next.apellido = "Solo se permiten letras y espacios.";

    if (!personalForm.telefono.trim()) next.telefono = "Este campo es obligatorio.";
    else if (!PHONE_PATTERN.test(personalForm.telefono)) next.telefono = "Formato de teléfono inválido.";

    setPersonalErrors(next);
    return Object.keys(next).length === 0;
  }

  async function savePersonal() {
    if (!validatePersonal()) return;
    setPersonalSaving(true);
    try {
      const updated = await updateMe(personalForm);
      setUsuario(updated);
      setPersonalSaved(true);
    } finally {
      setPersonalSaving(false);
    }
  }

  function setProfessionalField(key: keyof ProfessionalForm, value: string) {
    setProfessionalForm((f) => ({ ...f, [key]: value }));
    setProfessionalSaved(false);
  }

  async function saveProfessional() {
    setProfessionalSaving(true);
    try {
      const updated = await updateMyProviderProfile({
        descripcion: professionalForm.descripcion,
        aniosExperiencia: Number(professionalForm.aniosExperiencia) || 0,
      });
      setProvider(updated);
      setProfessionalSaved(true);
    } finally {
      setProfessionalSaving(false);
    }
  }

  function setCoverageField(key: keyof CoverageForm, value: string) {
    setCoverageForm((f) => ({ ...f, [key]: value }));
    setCoverageSaved(false);
  }

  async function saveCoverage() {
    setCoverageSaving(true);
    try {
      const updated = await updateMyProviderProfile({
        aceptaRadioKm: Number(coverageForm.aceptaRadioKm) || 0,
        disponibilidad: coverageForm.disponibilidad,
      });
      setProvider(updated);
      setCoverageSaved(true);
    } finally {
      setCoverageSaving(false);
    }
  }

  function addServicio() {
    setServicios((s) => [...s, { localId: localIdSeq++, idServ: "", monto: "" }]);
    setServiciosSaved(false);
  }

  function removeServicio(localId: number) {
    setServicios((s) => s.filter((row) => row.localId !== localId));
    setServiciosSaved(false);
  }

  function setServicioField(localId: number, key: "idServ" | "monto", value: string) {
    setServicios((s) => s.map((row) => (row.localId === localId ? { ...row, [key]: value } : row)));
    setServiciosSaved(false);
  }

  async function saveServicios() {
    const payload = servicios
      .filter((row) => row.idServ && row.monto)
      .map((row) => ({ idServ: Number(row.idServ), monto: Number(row.monto) }));

    setServiciosSaving(true);
    setServiciosError(null);
    try {
      await replaceMyServices(payload);
      const refreshed = await getMyServices();
      setServicios(refreshed.map((s) => ({ localId: localIdSeq++, idServ: String(s.idServ), monto: String(s.monto) })));
      setServiciosSaved(true);
    } catch (err) {
      setServiciosError(err instanceof ApiError ? err.message : "No se pudieron guardar los servicios.");
    } finally {
      setServiciosSaving(false);
    }
  }

  async function uploadMatricula(file: File) {
    setMatriculaUploading(true);
    setMatriculaError(null);
    try {
      const updated = await uploadMyMatricula(file);
      setMatricula(updated);
    } catch (err) {
      setMatriculaError(err instanceof ApiError ? err.message : "No se pudo subir el documento.");
    } finally {
      setMatriculaUploading(false);
    }
  }

  return {
    usuario,
    provider,
    catalogo,
    matricula,
    loading,
    loadError,
    activeTab,
    setActiveTab,
    uploadingPhoto,
    uploadPhoto,
    personalForm,
    personalErrors,
    personalSaving,
    personalSaved,
    setPersonalField,
    savePersonal,
    professionalForm,
    professionalSaving,
    professionalSaved,
    setProfessionalField,
    saveProfessional,
    coverageForm,
    coverageSaving,
    coverageSaved,
    setCoverageField,
    saveCoverage,
    servicios,
    serviciosSaving,
    serviciosSaved,
    serviciosError,
    addServicio,
    removeServicio,
    setServicioField,
    saveServicios,
    matriculaUploading,
    matriculaError,
    uploadMatricula,
  };
}
