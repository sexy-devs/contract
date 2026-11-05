import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface User {
  nombre: string;
  apellido: string;
  rol: string;
}

const clientCardData = [
  {
    title: "Buscar prestadores",
    description: "Encontrá profesionales por oficio, zona y disponibilidad",
    linkText: "Ir a la sección →",
    link: "/catalogo",
  },
  {
    title: "Mi perfil",
    description: "Gestioná los datos de tu perfil.",
    linkText: "Ir a la sección →",
    link: "/perfil",
  },
];
const providerCardData = [
  {
    title: "Mi perfil",
    description: "Gestioná los datos de tu perfil.",
    linkText: "Ir a la sección →",
    link: "/perfil",
  },
  {
    title: "Servicios ofrecidos",
    description: "Revisá los servicios asociados a tu perfil.",
    linkText: "Ir a la sección →",
    link: "/perfil",
  },
  {
    title: "Matrícula / Documentación",
    description: "Revisá el estado de tu documentación.",
    linkText: "Ir a la sección →",
    link: "/perfil",
  },
];
const adminCardData = [
  {
    title: "Panel de control",
    description: "Gestiona usuarios, roles y demás datos",
    linkText: "Ir a la sección →",
    link: "/panel",
  },
];

function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/usuarios/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      })
      .catch((err) => console.error("Error fetching current user:", err));
  }, []);

  return (
    <div id="home-page" className="bg-blue-50 ">
      <section
        id="content"
        className=" pl-10 pr-10 font-carlito w-screen h-screen"
      >
        <h1 className="text-3xl pt-10">
          <b>
            Hola, {user?.nombre} {user?.apellido}
          </b>
        </h1>

        <div
          id="cards"
          className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,max(320px,calc((100%-4*0.625rem)/5))),1fr))]
          gap-2.5 overflow-auto mt-10 mx-auto"
        >
          {user?.rol === "cliente" &&
            clientCardData.map((card) => (
              <div
                key={card.title}
                className="user-card flex flex-col justify-between bg-white p-5 border-2
              rounded-3xl border-gray-200 shadow min-w-50"
              >
                <h3 className="text-[18px]">
                  <b>{card.title}</b>
                </h3>
                <p className="text-gray-600 mb-2.5">{card.description}</p>
                <Link to={card.link} className="text-blue-500">
                  {card.linkText}
                </Link>
              </div>
            ))}
          {user?.rol === "profesional" &&
            providerCardData.map((card) => (
              <div
                key={card.title}
                className="user-card flex flex-col justify-between bg-white p-5 border-2
              rounded-3xl border-gray-200 shadow min-w-50"
              >
                <h3 className="text-[18px]">
                  <b>{card.title}</b>
                </h3>
                <p className="text-gray-600 mb-2.5">{card.description}</p>
                <Link to={card.link} className="text-blue-500">
                  {card.linkText}
                </Link>
              </div>
            ))}
          {user?.rol === "admin" &&
            adminCardData.map((card) => (
              <div
                key={card.title}
                className="user-card flex flex-col justify-between bg-white p-5 border-2
              rounded-3xl border-gray-200 shadow min-w-50"
              >
                <h3 className="text-[18px]">
                  <b>{card.title}</b>
                </h3>
                <p className="text-gray-600 mb-2.5">{card.description}</p>
                <Link to={card.link} className="text-blue-500">
                  {card.linkText}
                </Link>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
