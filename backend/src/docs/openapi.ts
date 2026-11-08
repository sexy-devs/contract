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
      ActualizarUsuarioAdmin: {
        type: "object",
        required: ["nombre", "apellido", "email", "telefono", "rol"],
        properties: {
          nombre: { type: "string" },
          apellido: { type: "string" },
          email: { type: "string", format: "email" },
          telefono: { type: "string" },
          rol: { type: "string", enum: ["cliente", "profesional", "admin"] },
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
        responses: {
          "200": { description: "Login exitoso" },
          "401": { description: "Credenciales inválidas o cuenta inhabilitada" },
        },
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
    "/admin/usuarios": {
      get: {
        tags: ["Administración de usuarios"],
        summary: "Listar usuarios con búsqueda y filtro por rol (HU-05)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "search", in: "query", schema: { type: "string", maxLength: 100 } },
          { name: "rol", in: "query", schema: { type: "string", enum: ["cliente", "profesional", "admin"] } },
        ],
        responses: {
          "200": { description: "Listado de usuarios" },
          "403": { description: "Acceso exclusivo para administradores" },
        },
      },
    },
    "/admin/usuarios/{id}": {
      patch: {
        tags: ["Administración de usuarios"],
        summary: "Editar datos y rol de un usuario (HU-05, HU-07)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/ActualizarUsuarioAdmin" } } } },
        responses: {
          "200": { description: "Usuario actualizado" },
          "400": { description: "Campos incompletos o datos inválidos" },
          "403": { description: "Acceso exclusivo para administradores" },
          "404": { description: "Usuario no encontrado" },
          "409": { description: "Email en uso o último administrador" },
        },
      },
      delete: {
        tags: ["Administración de usuarios"],
        summary: "Dar de baja lógica a un usuario (HU-08)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }],
        responses: {
          "200": { description: "Usuario dado de baja o ya inactivo" },
          "400": { description: "Identificador inválido" },
          "403": { description: "Acceso exclusivo para administradores" },
          "404": { description: "Usuario no encontrado" },
          "409": { description: "Autobaja o baja del último administrador activo no permitida" },
        },
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
    "/catalogo/servicios": {
      get: {
        tags: ["Catálogo"],
        summary: "Listar servicios disponibles",
        responses: { "200": { description: "Listado de servicios" } },
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
