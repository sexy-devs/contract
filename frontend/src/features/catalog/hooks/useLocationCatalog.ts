import { useEffect, useState } from "react";
import { listProvincias, listZones, type Localidad, type Provincia } from "../api/catalogApi";

export function useLocationCatalog() {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listProvincias(), listZones()])
      .then(([provinciasData, localidadesData]) => {
        setProvincias(provinciasData);
        setLocalidades(localidadesData);
      })
      .catch(() => {
        // los selects de ubicación quedan sin opciones para elegir
      })
      .finally(() => setLoading(false));
  }, []);

  return { provincias, localidades, loading };
}
