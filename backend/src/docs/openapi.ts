export const openapiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Contract API",
    version: "1.0.0",
    description: "API de Contract — Sprint 1: registro, login, perfil y catálogo de prestadores.",
  },
  servers: [{ url: "/api" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      Registro: {
        type: "object",
        required: ["nombre", "apellido", "email", "contrasena", "telefono", "rol"],
        properties: {
          nombre: { type: "string" },
          apellido: { type: "string" },
          email: { type: "string", format: "email" },
          contrasena: { type: "string", minLength: 8 },
          telefono: { type: "string" },
          rol: { type: "string", enum: ["cliente", "profesional"] },
        },
      },
      Login: {
        type: "object",
        required: ["email", "contrasena"],
        properties: {
          email: { type: "string", format: "email" },
          contrasena: { type: "string" },
        },
      },
      ActualizarPerfil: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          apellido: { type: "string" },
          telefono: { type: "string" },
          fotoUrl: { type: "string", format: "uri" },
        },
      },
      ActualizarPerfilProfesional: {
        type: "object",
        properties: {
          descripcion: { type: "string" },
          aniosExperiencia: { type: "integer" },
          aceptaRadioKm: { type: "integer" },
          disponibilidad: { type: "string" },
        },
      },
      ServiciosProfesional: {
        type: "object",
        required: ["servicios"],
        properties: {
          servicios: {
            type: "array",
            items: {
              type: "object",
              required: ["idServ", "monto"],
              properties: {
                idServ: { type: "integer" },
                monto: { type: "integer" },
              },
            },
          },
        },
      },
      Matricula: {
        type: "object",
        required: ["fotoUrl"],
        properties: {
          fotoUrl: { type: "string", format: "uri" },
          fechaExpiracion: { type: "string", format: "date" },
        },
      },
    },
  },
  paths: {
    "/auth/registro": {
      post: {
        tags: ["Auth"],
        summary: "Registro de usuario (CO-01)",
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Registro" } } } },
        responses: { "201": { description: "Usuario creado" }, "409": { description: "Email ya registrado" } },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Inicio de sesión (CO-02)",
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Login" } } } },
        responses: { "200": { description: "Login exitoso" }, "401": { description: "Credenciales inválidas" } },
      },
    },
    "/usuarios/me": {
      get: {
        tags: ["Usuarios"],
        summary: "Obtener mi perfil (CO-03)",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Perfil del usuario" } },
      },
      patch: {
        tags: ["Usuarios"],
        summary: "Editar mi perfil (CO-03)",
        security: [{ bearerAuth: [] }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/ActualizarPerfil" } } } },
        responses: { "200": { description: "Perfil actualizado" } },
      },
    },
    "/profesionales/me": {
      get: {
        tags: ["Perfil profesional"],
        summary: "Obtener mi perfil profesional (CO-03)",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Perfil profesional" } },
      },
      patch: {
        tags: ["Perfil profesional"],
        summary: "Editar mi perfil profesional (CO-03)",
        security: [{ bearerAuth: [] }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/ActualizarPerfilProfesional" } } } },
        responses: { "200": { description: "Perfil profesional actualizado" } },
      },
    },
    "/profesionales/me/servicios": {
      put: {
        tags: ["Perfil profesional"],
        summary: "Reemplazar servicios ofrecidos (CO-03)",
        security: [{ bearerAuth: [] }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/ServiciosProfesional" } } } },
        responses: { "200": { description: "Servicios actualizados" } },
      },
    },
    "/profesionales/me/matricula": {
      post: {
        tags: ["Perfil profesional"],
        summary: "Cargar matrícula o certificación (CO-03)",
        security: [{ bearerAuth: [] }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Matricula" } } } },
        responses: { "201": { description: "Matrícula cargada, queda pendiente de revisión" } },
      },
    },
    "/catalogo/profesionales": {
      get: {
        tags: ["Catálogo"],
        summary: "Buscar y filtrar prestadores (CO-04)",
        parameters: [
          { name: "servicio", in: "query", schema: { type: "string" } },
          { name: "zona", in: "query", schema: { type: "string" } },
          { name: "soloDisponibles", in: "query", schema: { type: "string", enum: ["true", "false"] } },
          { name: "ordenarPor", in: "query", schema: { type: "string", enum: ["calificacion", "precio", "distancia"] } },
          { name: "lat", in: "query", description: "Latitud del cliente, requerida para ordenar por distancia", schema: { type: "number" } },
          { name: "lng", in: "query", description: "Longitud del cliente, requerida para ordenar por distancia", schema: { type: "number" } },
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
        ],
        responses: { "200": { description: "Listado paginado de prestadores" } },
      },
    },
    "/catalogo/profesionales/{id}": {
      get: {
        tags: ["Catálogo"],
        summary: "Ficha pública del prestador (CO-04)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Ficha pública del prestador" }, "404": { description: "No encontrado" } },
      },
    },
  },
};
