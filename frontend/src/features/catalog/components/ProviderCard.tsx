import { useNavigate } from "react-router-dom";
import { CheckmarkSVG, StarSVG } from "../../../assets/svg/svgs";

type ProviderCardProps = {
  id: number;
  nombre: string;
  apellido: string;
  oficio: string;
  direccion: string;
  fotoUrl?: string | null;
  rating: number;
  reviewsCount: number;
  verificado: boolean;
  disponible: boolean;
  precioDesde: number;
};

function ProviderCard({
  // la tarjeta indiviudal para cada proveedor de servicios
  id,
  nombre,
  apellido,
  oficio,
  direccion,
  fotoUrl,
  rating,
  reviewsCount,
  verificado,
  disponible,
  precioDesde,
}: ProviderCardProps) {
  const navigate = useNavigate();

  return (
    <div
      id="provider-card"
      className={`bg-white flex flex-col justify-between p-5 shadow border-2 border-gray-200 rounded-3xl min-h-80 w-full max-w-100 mx-auto ${
        !disponible ? "opacity-50" : ""
      }`}
    >
      <div id="top" className="flex items-center gap-2">
        <div
          id="profile-pic"
          className="rounded-full bg-blue-200 w-12 h-12 overflow-hidden flex items-center justify-center"
        >
          {fotoUrl ? (
            <img
              src={fotoUrl}
              alt={`${nombre} ${apellido}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-bold text-sky-800">
              {nombre[0]}
              {apellido[0]}
            </span>
          )}
        </div>
        <div id="texts">
          <h3 className="text-[20px]">
            {nombre} {apellido}
          </h3>
          <p className="text-[14px]">{oficio}</p>
          <p className="text-[14px]">{direccion}</p>
        </div>
      </div>

      <div id="mid" className="flex flex-wrap items-center gap-1.5 mt-1.5">
        <div
          id="reviews"
          className="flex items-center justify-center gap-2 border border-gray-200 w-fit rounded-full p-1.5"
        >
          <StarSVG className="w-5 h-5 text-yellow-400" fill="currentColor" />
          <p className="font-bold text-[14px]">
            {rating.toFixed(1)}{" "}
            <span className="font-normal text-gray-400">({reviewsCount})</span>
          </p>
        </div>

        {verificado && (
          <div
            id="provider-status"
            className="flex items-center justify-center gap-2 border bg-blue-200 border-blue-400 w-fit rounded-full p-1.5"
          >
            <CheckmarkSVG className="w-5 h-5 text-sky-800" />
            <p className="font-bold text-sky-800 text-[14px]">Verificado</p>
          </div>
        )}

        {disponible ? (
          <div
            id="provider-available"
            className="flex items-center justify-center gap-2 border bg-green-200 border-green-400 w-fit rounded-full p-1.5"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-green-800"></span>
            <p className="font-bold text-green-800 text-[14px]">Disponible</p>
          </div>
        ) : (
          <div
            id="provider-unavailable"
            className="flex items-center justify-center gap-2 border bg-gray-200 border-gray-400 w-fit rounded-full p-1.5"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-gray-800"></span>
            <p className="font-bold text-gray-800 text-[14px]">
              Sin disponibilidad
            </p>
          </div>
        )}
      </div>

      <div id="bottom">
        <hr className="border-0 mb-5 bg-gray-200 h-0.5" />
        <div className="flex items-center justify-between">
          <p>
            Desde
            <span className="ml-2.5 font-bold text-[20px]">
              ${precioDesde.toLocaleString("es-AR")}
            </span>
          </p>
          <button
            className="border-2 border-blue-200 rounded-2xl p-2.5 text-sky-800 h-10 flex items-center hover:bg-blue-200"
            onClick={() => navigate(`/profile/${id}`)}
          >
            Ver ficha
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProviderCard;
