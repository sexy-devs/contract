import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listServicios, type ServicioCatalogo } from "../../catalog/api/catalogApi";
import AccountTypeSelector, {
  type AccountType,
} from "../components/AccountTypeSelector";
import RegistrationProgress from "../components/RegistrationProgress";
import LogoContract from "../../../components/layout/LogoContract";
import PersonalDataStep, {
  type PersonalData,
} from "../components/PersonalDataStep";
import LocationStep, {
  type LocationData,
} from "../components/LocationStep";
import ProfessionalInfoStep, {
  type ProfessionalInfoData,
} from "../components/ProfessionalInfoStep";
import CoverageAvailabilityStep, {
  type CoverageData,
} from "../components/CoverageAvailabilityStep";
import ServicesStep, {
  type OfferedServiceData,
} from "../components/ServicesStep";
import DocumentationStep from "../components/DocumentationStep";
import { useRegister } from "../hooks/useRegister";
import {
  hasFieldErrors,
  hasServiceErrors,
  validateCoverage,
  validateDocumentation,
  validateLocation,
  validatePersonalData,
  validateProfessionalInfo,
  validateServices,
  type FieldErrors,
  type ServiceRowError,
} from "../registrationValidation";

const initialPersonalData: PersonalData = {
  nombre: "",
  apellido: "",
  email: "",
  contrasena: "",
  telefono: "",
  fotoPerfil: null,
};

const initialLocationData: LocationData = {
  idLocalidad: null,
};

const initialProfessionalInfo: ProfessionalInfoData = {
  descripcion: "",
  aniosExperiencia: "0",
};

const initialCoverageData: CoverageData = {
  idLocalidad: null,
  aceptaRadioKm: "0",
  disponibilidad: "",
};

const initialServices: OfferedServiceData[] = [{ idServ: "", monto: "0" }];

function Register() {
  const {
    submit: submitRegistration,
    loading: registrationLoading,
    error: registrationError,
    clearError: clearRegistrationError,
  } = useRegister();
  const [accountType, setAccountType] = useState<AccountType>("cliente");
  const [currentStep, setCurrentStep] = useState(1);
  const [personalData, setPersonalData] =
    useState<PersonalData>(initialPersonalData);
  const [locationData, setLocationData] =
    useState<LocationData>(initialLocationData);
  const [professionalInfo, setProfessionalInfo] =
    useState<ProfessionalInfoData>(initialProfessionalInfo);
  const [coverageData, setCoverageData] =
    useState<CoverageData>(initialCoverageData);
  const [services, setServices] =
    useState<OfferedServiceData[]>(initialServices);
  const [catalogo, setCatalogo] = useState<ServicioCatalogo[]>([]);
  const [catalogoLoading, setCatalogoLoading] = useState(true);
  const [catalogoError, setCatalogoError] = useState("");
  const [documentationFile, setDocumentationFile] = useState<File | null>(null);
  const [personalErrors, setPersonalErrors] =
    useState<FieldErrors<PersonalData>>({});
  const [locationErrors, setLocationErrors] =
    useState<FieldErrors<LocationData>>({});
  const [professionalInfoErrors, setProfessionalInfoErrors] =
    useState<FieldErrors<ProfessionalInfoData>>({});
  const [coverageErrors, setCoverageErrors] =
    useState<FieldErrors<CoverageData>>({});
  const [serviceErrors, setServiceErrors] = useState<ServiceRowError[]>([]);
  const [documentationError, setDocumentationError] = useState("");

  useEffect(() => {
    let cancelled = false;

    listServicios()
      .then((options) => {
        if (!cancelled) setCatalogo(options);
      })
      .catch(() => {
        if (!cancelled) setCatalogoError("No se pudo cargar el catálogo de servicios.");
      })
      .finally(() => {
        if (!cancelled) setCatalogoLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const isClientFinalStep = accountType === "cliente" && currentStep === 3;
  const isProfessionalFinalStep =
    accountType === "profesional" && currentStep === 6;
  const isFinalStep = isClientFinalStep || isProfessionalFinalStep;

  async function handleContinue() {
    if (registrationLoading) return;

    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      const errors = validatePersonalData(personalData);
      setPersonalErrors(errors);
      if (hasFieldErrors(errors)) return;

      setCurrentStep(3);
      return;
    }

    if (accountType === "cliente" && currentStep === 3) {
      const errors = validateLocation(locationData);
      setLocationErrors(errors);
      if (hasFieldErrors(errors)) return;

      await submitRegistration(
        {
          nombre: personalData.nombre.trim(),
          apellido: personalData.apellido.trim(),
          email: personalData.email.trim(),
          password: personalData.contrasena,
          telefono: personalData.telefono.trim(),
          rol: "cliente",
          idLocalidad: locationData.idLocalidad ?? undefined,
        },
        { fotoPerfil: personalData.fotoPerfil },
      );
      return;
    }

    if (accountType === "profesional" && currentStep === 3) {
      const errors = validateProfessionalInfo(professionalInfo);
      setProfessionalInfoErrors(errors);
      if (hasFieldErrors(errors)) return;

      setCurrentStep(4);
      return;
    }

    if (accountType === "profesional" && currentStep === 4) {
      const errors = validateCoverage(coverageData);
      setCoverageErrors(errors);
      if (hasFieldErrors(errors)) return;

      setCurrentStep(5);
      return;
    }

    if (accountType === "profesional" && currentStep === 5) {
      const errors = validateServices(services);
      setServiceErrors(errors);
      if (hasServiceErrors(errors)) return;

      setCurrentStep(6);
      return;
    }

    if (accountType === "profesional" && currentStep === 6) {
      const error = validateDocumentation(documentationFile);
      setDocumentationError(error);
      if (error) return;

      await submitRegistration(
        {
          nombre: personalData.nombre.trim(),
          apellido: personalData.apellido.trim(),
          email: personalData.email.trim(),
          password: personalData.contrasena,
          telefono: personalData.telefono.trim(),
          rol: "profesional",
          descripcion: professionalInfo.descripcion.trim(),
          aniosExperiencia: Number(professionalInfo.aniosExperiencia),
          idLocalidad: coverageData.idLocalidad as number,
          aceptaRadioKm: Number(coverageData.aceptaRadioKm),
          disponibilidad: coverageData.disponibilidad.trim(),
          servicios: services.map((servicio) => ({
            idServ: Number(servicio.idServ),
            monto: Number(servicio.monto),
          })),
        },
        { fotoPerfil: personalData.fotoPerfil, documentacion: documentationFile },
      );
    }
  }

  function handleBack() {
    setCurrentStep((step) => Math.max(1, step - 1));
  }

  function handleAccountTypeChange(nextAccountType: AccountType) {
    if (nextAccountType === accountType) return;

    if (nextAccountType === "profesional") {
      setLocationData(initialLocationData);
      setLocationErrors({});
    } else {
      setProfessionalInfo(initialProfessionalInfo);
      setCoverageData(initialCoverageData);
      setServices(initialServices);
      setDocumentationFile(null);
      setProfessionalInfoErrors({});
      setCoverageErrors({});
      setServiceErrors([]);
      setDocumentationError("");
    }

    setAccountType(nextAccountType);
    clearRegistrationError();
  }

  function handlePersonalDataChange(
    field: Exclude<keyof PersonalData, "fotoPerfil">,
    value: string,
  ) {
    setPersonalData((data) => ({ ...data, [field]: value }));
    clearRegistrationError();
    setPersonalErrors((errors) => {
      const nextErrors = { ...errors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function handlePhotoChange(file: File | null) {
    setPersonalData((data) => ({ ...data, fotoPerfil: file }));
    setPersonalErrors((errors) => {
      const nextErrors = { ...errors };
      delete nextErrors.fotoPerfil;
      return nextErrors;
    });
  }

  function handleLocationChange(field: keyof LocationData, value: number | null) {
    setLocationData((data) => ({ ...data, [field]: value }));
    setLocationErrors((errors) => {
      const nextErrors = { ...errors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function handleProfessionalInfoChange(
    field: keyof ProfessionalInfoData,
    value: string,
  ) {
    setProfessionalInfo((data) => ({ ...data, [field]: value }));
    clearRegistrationError();
    setProfessionalInfoErrors((errors) => {
      const nextErrors = { ...errors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function handleCoverageChange(field: keyof CoverageData, value: string | number | null) {
    setCoverageData((data) => ({ ...data, [field]: value }));
    clearRegistrationError();
    setCoverageErrors((errors) => {
      const nextErrors = { ...errors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function handleServicesChange(updatedServices: OfferedServiceData[]) {
    setServices(updatedServices);
    setServiceErrors([]);
    clearRegistrationError();
  }

  function handleDocumentationChange(file: File | null) {
    setDocumentationFile(file);
    setDocumentationError("");
  }

  return (
    <main className="min-h-screen bg-indigo-50 font-carlito lg:grid lg:grid-cols-[35%_65%]">
      <aside className="bg-blue-50 px-6 py-8 sm:px-10 lg:px-12 lg:py-12">
        <LogoContract />
        <div className="mt-10 max-w-sm lg:mt-14">
          <h2 className="text-3xl font-bold leading-tight text-gray-900">
            Conectamos clientes con profesionales de mantenimiento.
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Creá tu cuenta para comenzar a usar la plataforma.
          </p>
        </div>

        <div className="mt-12 hidden h-44 max-w-sm items-center justify-center rounded-xl border border-dashed border-sky-300 bg-white/30 text-sm text-sky-700 sm:flex">
          Ilustración / imagen de marca
        </div>
      </aside>

      <section className="flex items-start justify-center px-4 py-8 sm:px-8 lg:py-12">
        <div className="w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-md sm:p-8">
          <header>
            <h1 className="text-3xl font-bold text-gray-900">Crear cuenta</h1>
            <p className="mt-1 text-gray-600">
              Los campos marcados con <span className="text-red-600">*</span> son obligatorios.
            </p>
          </header>

          <div className="mt-7">
            <RegistrationProgress
              accountType={accountType}
              currentStep={currentStep}
            />
          </div>

          <div className="mt-7">
            {currentStep === 1 ? (
              <AccountTypeSelector
                value={accountType}
                onChange={handleAccountTypeChange}
              />
            ) : currentStep === 2 ? (
              <PersonalDataStep
                data={personalData}
                errors={personalErrors}
                onChange={handlePersonalDataChange}
                onPhotoChange={handlePhotoChange}
              />
            ) : accountType === "cliente" ? (
              <LocationStep
                data={locationData}
                errors={locationErrors}
                onChange={handleLocationChange}
              />
            ) : currentStep === 3 ? (
              <ProfessionalInfoStep
                data={professionalInfo}
                errors={professionalInfoErrors}
                onChange={handleProfessionalInfoChange}
              />
            ) : currentStep === 4 ? (
              <CoverageAvailabilityStep
                data={coverageData}
                errors={coverageErrors}
                onChange={handleCoverageChange}
              />
            ) : currentStep === 5 ? (
              <ServicesStep
                data={services}
                errors={serviceErrors}
                options={catalogo}
                loadingOptions={catalogoLoading}
                catalogError={catalogoError}
                onChange={handleServicesChange}
              />
            ) : (
              <DocumentationStep
                file={documentationFile}
                validationError={documentationError}
                onChange={handleDocumentationChange}
              />
            )}
          </div>

          <div className="mt-6 border-t border-gray-200 pt-5">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={registrationLoading}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Atrás
                </button>
              )}

              <button
                type="button"
                onClick={handleContinue}
                disabled={registrationLoading}
                className="flex-1 rounded-lg bg-sky-800 px-4 py-3 font-semibold text-white hover:bg-sky-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isFinalStep && registrationLoading
                  ? "Creando cuenta..."
                  : isFinalStep
                    ? "Registrarse"
                    : "Continuar"}
              </button>
            </div>

            {registrationError && (
              <p role="alert" className="mt-3 text-center text-sm text-red-600">
                {registrationError}
              </p>
            )}

            <p className="mt-4 text-center text-sm text-gray-600">
              ¿Ya tenés una cuenta?{" "}
              <Link to="/iniciar-sesion" className="font-medium text-sky-800 hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;
