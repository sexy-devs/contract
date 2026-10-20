//TODO: orden ascendente y descendente en "Ordenar por"
import { useEffect, useState } from "react";
import ProviderCard from "../components/ProviderCard";
import ProviderDetailPanel from "../components/ProviderDetailPanel";
import { searchProviders, type ProviderRow } from "../api/catalogApi";
import { CrossSVG, ArrowUp, ArrowDown } from "../../../assets/svg/svgs";
import { listZones } from "../api/catalogApi";

const JOBS = ["Plomería", "Pintura", "Gasista", "Electricidad", "Carpintería"];

const AVAILABILITY = [
  { value: "all", label: "Todos" },
  { value: "only-available", label: "Disponibles" },
];

const ORDER_OPTIONS = [
  { value: "calificacion", label: "Calificación" },
  { value: "precio", label: "Precio" },
  { value: "distancia", label: "Distancia" },
];

const defaultDirection: Record<string, string> = {
  calificacion: "desc",
  precio: "asc",
  distancia: "asc",
};

function JobsSection() {
  // muestra la grilla con las tarjetas de los proveedores de servicios
  const [providers, setProviders] = useState<ProviderRow[]>([]);
  const [zones, setZones] = useState<{ id: number; nombre: string }[]>([]);
  const [zone, setZone] = useState("");
  const [activeAvailability, setActiveAvailability] = useState("all");
  const [orderBy, setOrderBy] = useState("calificacion");
  const [jobType, setJobType] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectingFilters, setSelectingFilters] = useState(false);
  const [orderDirection, setOrderDirection] = useState("desc");
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  const limit = 10;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  function changeAvailabilityFilter(filter: string) {
    // filtrado de proveedores según su disponibilidad
    setActiveAvailability(filter);
    setPage(1);
  }

  function showFilteredJobs(e: React.ChangeEvent<HTMLSelectElement>) {
    // filtrado de proveedores por tipo de trabajo ofrecido
    setJobType(e.target.value);
    setPage(1);
  }

  function modifyOrder(type: string) {
    // func encargada del modificador de "ordenar por..."
    setOrderBy(type);
    setOrderDirection(defaultDirection[type]);
    setPage(1);
  }

  function toggleDirection() {
    setOrderDirection((d) => (d === "asc" ? "desc" : "asc"));
    setPage(1);
  }

  useEffect(() => {
    listZones().then(setZones).catch((err) => console.log(err.message));
  }, []);

  useEffect(() => {
    const query = new URLSearchParams();
    if (zone) query.set("zona", zone);
    if (activeAvailability === "only-available")
      query.set("soloDisponibles", "true");
    if (jobType) query.set("servicio", jobType);
    query.set("ordenarPor", orderBy);
    query.set("page", String(page));
    query.set("limit", String(limit));
    query.set("ordenarPor", orderBy);
    query.set("orden", orderDirection);

    searchProviders(`?${query}`)
      .then((res) => {
        setProviders(res.data);
        setTotal(res.pagination.total);
      })
      .catch((err) => console.log(err.message));
  }, [zone, activeAvailability, jobType, orderBy, orderDirection, page]);

  return (
    <div
      id="jobs-section"
      className="flex flex-col min-[1025px]:flex-row gap-5 pt-5 pb-5 px-4 min-[1025px]:px-8 bg-blue-50 font-carlito"
    >
      {/* barra de filtros para celu, oculto en pc */}
      <div
        id="mobile-filters-bar"
        className="flex justify-between gap-2.5 items-center min-[1025px]:hidden text-[14px]"
      >
        <button
          className="bg-white border-2 border-gray-200 rounded-[14px] p-2.5 min-w-40 hover:bg-slate-200 hover:border-gray-300"
          onClick={() => setSelectingFilters(true)}
        >
          Filtros
        </button>
        <div className="flex items-center gap-2.5 bg-white border-2 border-gray-200 rounded-[14px] p-2.5 min-w-40">
          <p className="text-gray-500">Orden: </p>
          <select value={orderBy} onChange={(e) => modifyOrder(e.target.value)}>
            {ORDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button onClick={toggleDirection}>
            {orderDirection === "asc" ? <ArrowUp /> : <ArrowDown />}
          </button>
        </div>
      </div>

      {/* filtros se muestran como tarjeta superpuesta en celu y lateral en pc */}
      <div
        id="filters-overlay"
        className={`${selectingFilters ? "fixed" : "hidden"} inset-0 z-99 p-5 backdrop-blur-[5px]
              min-[1025px]:static min-[1025px]:block min-[1025px]:p-0 min-[1025px]:backdrop-blur-none min-[1025px]:z-auto`}
      >
        <div
          id="filters"
          className="bg-white p-5 border-2 border-gray-200 rounded-3xl h-fit w-70 flex flex-col gap-2.5 mx-auto min-[1025px]:mx-0"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-[20px]">Filtros</h3>
            <button
              className="min-[1025px]:hidden"
              onClick={() => setSelectingFilters(false)}
            >
              <CrossSVG className="w-5 h-5 text-sky-800" />
            </button>
          </div>

          <p>Oficio</p>
          <select
            id="job-select"
            value={jobType}
            onChange={showFilteredJobs}
            className="border-2 border-gray-200 rounded-[14px] p-2.5 w-full"
          >
            <option value="">Todos</option>
            {JOBS.map((job) => (
              <option key={job} value={job}>
                {job}
              </option>
            ))}
          </select>

          <p>Zona</p>
          <select
            id="zone-select"
            value={zone}
            onChange={(e) => { setZone(e.target.value); setPage(1); }}
            className="border-2 border-gray-200 rounded-[14px] p-2.5 w-full"
          >
            <option value="">Todas</option>
            {zones.map((z) => (
              <option key={z.id} value={z.nombre}>{z.nombre}</option>
            ))}
          </select>

          <p>Disponibilidad</p>
          <div className="bg-blue-50 p-1.5 rounded-3xl flex justify-between items-center">
            {AVAILABILITY.map((ava) => (
              <button
                key={ava.value}
                onClick={() => changeAvailabilityFilter(ava.value)}
                className={`p-2.5 rounded-2xl w-full ${activeAvailability === ava.value ? "bg-white text-sky-800" : ""}`}
              >
                {ava.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div id="jobs-container" className="flex-1 min-w-0">
        <div className="flex justify-between">
          <h3 className="font-bold text-[16px]">
            {total} prestadores encontrados
          </h3>

          {/* botones de orden especificos para pc*/}
          <div
            id="order-filters"
            className="hidden min-[1025px]:flex items-center gap-2.5"
          >
            <p>Ordenar por</p>
            <div className="bg-white p-1.5 border-2 border-gray-200 rounded-3xl flex gap-2.5">
              {ORDER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => modifyOrder(option.value)}
                  className={`p-2.5 rounded-2xl ${orderBy === option.value ? "bg-blue-200 text-sky-800" : ""}`}
                >
                  {option.label}
                </button>
              ))}
              <button onClick={toggleDirection}>
                {orderDirection === "asc" ? <ArrowUp /> : <ArrowDown />}
              </button>
            </div>
          </div>
        </div>

        <div
          id="jobs-grid"
          className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,max(320px,calc((100%-3*0.625rem)/4))),1fr))] gap-2.5 overflow-auto mt-10 mx-auto"
        >
          {/* mapeo de tarjetas pasando los datos */}
          {providers.length > 0 ? (
            providers.map((p) => (
              <ProviderCard
                key={p.id}
                id={p.id}
                nombre={p.nombre}
                apellido={p.apellido}
                oficio={p.oficio ?? "Sin especificar"}
                direccion={p.zona ?? "Sin zona"}
                fotoUrl={p.fotoUrl}
                rating={Number(p.calificacionGlobal ?? 0)}
                reviewsCount={p.cantidadCalificaciones ?? 0}
                verificado={p.verificado}
                disponible={!!p.disponibilidad}
                precioDesde={Number(p.precioDesde ?? 0)}
                onVerFicha={setSelectedProviderId}
              />
            ))
          ) : (
            <h3 className="col-span-full text-center">
              No hay prestadores disponibles con los filtros seleccionados
            </h3>
          )}

        </div>

        <div className="flex items-center justify-center gap-4 mt-5">
          <button
            onClick={() => setPage((page) => page - 1)} // paginación
            disabled={page === 1} // evitar aumentar página si se alcanzó el limite
            className="p-2.5 rounded-2xl border-2 border-gray-200 bg-white disabled:opacity-40"
          >
            Anterior
          </button>
          <p>
            Página {page} de {totalPages}
          </p>
          <button
            onClick={() => setPage((page) => page + 1)}
            disabled={page >= totalPages} // evitar aumentar página si se alcanzó el limite
            className="p-2.5 rounded-2xl border-2 border-gray-200 bg-white disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      </div>

      {selectedProviderId !== null && (
        <ProviderDetailPanel providerId={selectedProviderId} onClose={() => setSelectedProviderId(null)} />
      )}
    </div>
  );
}

export default JobsSection;
