import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "@hono/zod-openapi";

extendZodWithOpenApi(z);

const uuidExample = "550e8400-e29b-41d4-a716-446655440000";

const ErrorResponse = z
  .object({
    exito: z.literal(false),
    error: z.string().openapi({ description: "Mensaje legible del error", example: "El campo 'apodo' es requerido" }),
    codigo: z.string().optional().openapi({ description: "Codigo maquina del error", example: "VALIDATION_ERROR" })
  })
  .openapi("ErrorResponse");

const HealthResponse = z
  .object({
    exito: z.literal(true),
    datos: z.object({
      estado: z.string().openapi({ description: "Estado del servidor", example: "healthy" }),
      entorno: z.string().openapi({ description: "Entorno de ejecucion", example: "development" })
    })
  })
  .openapi("HealthResponse");

const RootResponse = z
  .object({
    exito: z.literal(true),
    datos: z.object({
      nombre: z.string().openapi({ description: "Nombre de la API", example: "Semillas" }),
      version: z.string().openapi({ description: "Version semantica", example: "0.1.0" })
    })
  })
  .openapi("RootResponse");

const GuestAuthBody = z.object({
  apodo: z.string().min(1).max(50).openapi({ description: "Apodo publico del usuario", example: "Aventurero123" }),
  grupo_edad_id: z.string().uuid().optional().openapi({ description: "ID del grupo etario", example: uuidExample }),
  url_avatar: z.string().url().optional().openapi({ description: "URL del avatar por defecto", example: "https://api.semillas.app/avatars/default.png" })
}).openapi("GuestAuthBody");

const AuthInfo = z.object({
  tipo: z.literal("invitado"),
  encabezado: z.string().openapi({ description: "Nombre del header para autenticar", example: "x-guest-user-id" }),
  valor: z.string().openapi({ description: "Valor del header (ID del usuario)", example: uuidExample })
});

const GuestAuthResponse = z.object({
  exito: z.literal(true),
  datos: z.object({
    usuario: z.object({
      id: z.string().uuid().openapi({ description: "ID del usuario", example: uuidExample }),
      rol: z.string().openapi({ description: "Rol del usuario", example: "invitado" }),
      proveedor: z.string().openapi({ description: "Proveedor de autenticacion", example: "invitado" }),
      nombre_visible: z.string().openapi({ description: "Nombre visible", example: "Aventurero123" }),
      correo: z.string().nullable().openapi({ description: "Correo electronico", example: null })
    }),
    perfil: z.object({
      id: z.string().uuid().openapi({ description: "ID del perfil", example: uuidExample }),
      usuario_id: z.string().uuid().openapi({ description: "ID del usuario dueno del perfil", example: uuidExample }),
      apodo: z.string().openapi({ description: "Apodo", example: "Aventurero123" }),
      grupo_edad_id: z.string().uuid().nullable().openapi({ description: "ID del grupo etario", example: null }),
      url_avatar: z.string().nullable().openapi({ description: "URL del avatar", example: null }),
      clave_avatar: z.string().nullable().openapi({ description: "Clave del avatar", example: null }),
      prefiere_audio: z.boolean().openapi({ description: "Prefiere audio", example: true }),
      tamano_texto_preferido: z.string().openapi({ description: "Tamano de texto preferido", example: "medium" })
    }),
    autenticacion: AuthInfo
  })
}).openapi("GuestAuthResponse");

const SendaSchema = z.object({
  id: z.string().uuid().openapi({ description: "ID unico de la senda", example: uuidExample }),
  codigo: z.string().openapi({ description: "Codigo identificador", example: "PADRE" }),
  nombre: z.string().openapi({ description: "Nombre de la senda", example: "Padre" }),
  descripcion: z.string().nullable().openapi({ description: "Descripcion", example: "Senda del Padre Celestial" }),
  color_hex: z.string().openapi({ description: "Color representativo en hex", example: "#3D8BD4" }),
  nombre_icono: z.string().nullable().openapi({ description: "Nombre del icono asociado", example: "heart" }),
  orden: z.number().openapi({ description: "Orden de visualizacion", example: 1 })
}).openapi("Senda");

const GrupoEdadSchema = z.object({
  codigo: z.string().openapi({ description: "Codigo del grupo", example: "SEMILLAS" }),
  nombre: z.string().openapi({ description: "Nombre del grupo", example: "Semillas 5-8" }),
  edad_minima: z.number().openapi({ description: "Edad minima", example: 5 }),
  edad_maxima: z.number().openapi({ description: "Edad maxima", example: 8 }),
  descripcion: z.string().nullable().openapi({ description: "Descripcion del grupo", example: "Ninos de 5 a 8 anos" }),
  orden: z.number().openapi({ description: "Orden de visualizacion", example: 1 })
}).openapi("GrupoEdad");

const TemaResumido = z.object({
  id: z.string().uuid().openapi({ description: "ID del tema", example: uuidExample }),
  senda_id: z.string().uuid().openapi({ description: "ID de la senda", example: uuidExample }),
  titulo: z.string().openapi({ description: "Titulo del tema", example: "La Creacion" }),
  slug: z.string().openapi({ description: "Slug URL-friendly", example: "la-creacion" }),
  objetivo: z.string().openapi({ description: "Objetivo de aprendizaje", example: "Que el nino entienda que Dios creo todo" }),
  resumen: z.string().nullable().openapi({ description: "Resumen breve", example: "Dios creo el mundo en 7 dias" }),
  portada_recurso_id: z.string().uuid().nullable().openapi({ description: "Recurso de portada", example: null }),
  estado: z.string().openapi({ description: "Estado del tema", example: "publicado" }),
  version_biblica_id: z.string().uuid().nullable().openapi({ description: "Version biblica", example: null }),
  minutos_estimados: z.number().openapi({ description: "Duracion estimada en minutos", example: 15 }),
  xp_recompensa: z.number().openapi({ description: "XP que otorga al completarlo", example: 50 }),
  version_contenido: z.number().openapi({ description: "Version del contenido", example: 1 }),
  publicado_en: z.string().datetime().nullable().openapi({ description: "Fecha de publicacion", example: null })
}).openapi("TemaResumido");

const RecursoMultimediaSchema = z.object({
  id: z.string().uuid().openapi({ description: "ID del recurso multimedia", example: uuidExample }),
  tipo: z.string().openapi({ description: "Tipo del recurso", example: "imagen" }),
  url_publica: z.string().url().openapi({ description: "URL publica", example: "https://cdn.ejemplo.com/portada.png" }),
  texto_alternativo: z.string().nullable().openapi({ description: "Texto alternativo", example: "Portada del tema" }),
  titulo: z.string().nullable().openapi({ description: "Titulo del recurso", example: "Portada" }),
  tipo_mime: z.string().nullable().openapi({ description: "Tipo MIME", example: "image/png" }),
  tamano_bytes: z.number().nullable().openapi({ description: "Tamano en bytes", example: 102400 }),
  duracion_seg: z.number().nullable().openapi({ description: "Duracion en segundos", example: null }),
  ancho_px: z.number().nullable().openapi({ description: "Ancho en pixeles", example: 1280 }),
  alto_px: z.number().nullable().openapi({ description: "Alto en pixeles", example: 720 })
}).openapi("RecursoMultimedia");

const VersiculoClaveSchema = z.object({
  id: z.string().uuid().openapi({ description: "ID del versiculo clave", example: uuidExample }),
  tema_id: z.string().uuid().openapi({ description: "ID del tema", example: uuidExample }),
  texto: z.string().openapi({ description: "Texto del versiculo", example: "En el principio creo Dios los cielos y la tierra." }),
  libro_id: z.number().openapi({ description: "ID del libro biblico", example: 1 }),
  capitulo: z.number().openapi({ description: "Numero de capitulo", example: 1 }),
  versiculo: z.number().openapi({ description: "Numero de versiculo", example: 1 })
}).openapi("VersiculoClave");

const ReferenciaBiblicaSchema = z.object({
  id: z.string().uuid().openapi({ description: "ID de la referencia biblica", example: uuidExample }),
  tema_id: z.string().uuid().openapi({ description: "ID del tema", example: uuidExample }),
  libro_id: z.number().openapi({ description: "ID del libro biblico", example: 1 }),
  capitulo: z.number().openapi({ description: "Numero de capitulo", example: 1 }),
  versiculo_inicio: z.number().openapi({ description: "Versiculo inicial", example: 1 }),
  versiculo_fin: z.number().openapi({ description: "Versiculo final", example: 3 }),
  principal: z.boolean().openapi({ description: "Indica si es la referencia principal", example: true })
}).openapi("ReferenciaBiblica");

const TemaDetallado = TemaResumido.extend({
  senda: SendaSchema.nullable(),
  portada_recurso: RecursoMultimediaSchema.nullable(),
  versiculo_clave: VersiculoClaveSchema.nullable(),
  referencia_biblica: ReferenciaBiblicaSchema.nullable()
}).openapi("TemaDetallado");

const ProgresoTema = z.object({
  usuario_id: z.string().uuid(),
  tema_id: z.string().uuid(),
  estado: z.string().openapi({ description: "Estado del progreso", example: "en_progreso" }),
  porcentaje: z.number().openapi({ description: "Porcentaje de avance 0-100", example: 50 }),
  iniciado_en: z.string().datetime().nullable(),
  completado_en: z.string().datetime().nullable(),
  ultimo_paso_id: z.string().uuid().nullable(),
  actualizado_en: z.string().datetime()
}).openapi("ProgresoTema");

const ProgresoActividad = z.object({
  usuario_id: z.string().uuid(),
  actividad_id: z.string().uuid(),
  intentos: z.number().openapi({ description: "Numero de intentos", example: 2 }),
  mejor_puntaje: z.number().openapi({ description: "Mejor puntaje obtenido", example: 100 }),
  completado: z.boolean(), completado_en: z.string().datetime().nullable(),
  actualizado_en: z.string().datetime()
}).openapi("ProgresoActividad");

const ProgressEventBody = z.object({
  evento_id_cliente: z.string().uuid().openapi({ description: "ID unico del evento (idempotencia)", example: uuidExample }),
  tipo_evento: z.enum(["tema_iniciado","tema_completado","bloque_iniciado","bloque_completado","actividad_iniciada","actividad_respondida","actividad_completada","recompensa_reclamada","tema_descargado","marcador_sincronizacion"])
    .openapi({ description: "Tipo de evento de progreso", example: "actividad_respondida" }),
  tema_id: z.string().uuid().optional(),
  paso_id: z.string().uuid().optional(),
  actividad_id: z.string().uuid().optional(),
  correcta: z.boolean().optional(),
  puntaje: z.number().min(0).max(100).optional(),
  xp_otorgada: z.number().int().min(0).optional().default(0).openapi({ example: 15 }),
  datos: z.object({}).passthrough().optional(),
  ocurrido_en_cliente: z.string().datetime().optional().openapi({ example: "2026-01-01T00:00:00.000Z" }),
  dispositivo_id: z.string().optional()
}).openapi("ProgressEventBody");

const ProgressEventCreatedResponse = z.object({
  exito: z.literal(true),
  datos: z.object({
    duplicado: z.literal(false),
    evento: z.unknown()
  })
});

const ProgressEventDuplicateResponse = z.object({
  exito: z.literal(true),
  datos: z.object({
    duplicado: z.literal(true),
    mensaje: z.string()
  })
});

const TipoActividadSchema = z
  .object({
    id: z.string().uuid().openapi({ description: "ID del tipo de actividad", example: uuidExample }),
    codigo: z.string().openapi({ description: "Codigo del tipo de actividad", example: "QUIZ" }),
    nombre: z.string().openapi({ description: "Nombre del tipo de actividad", example: "Quiz" }),
    descripcion: z.string().nullable().openapi({ description: "Descripcion del tipo de actividad", example: "Pregunta de seleccion multiple" }),
    es_juego: z.boolean().openapi({ description: "Indica si es un juego", example: true }),
    activo: z.boolean().openapi({ description: "Indica si esta activo", example: true }),
    creado_en: z.string().datetime().openapi({ description: "Fecha de creacion", example: "2026-01-01T00:00:00.000Z" })
  })
  .openapi("TipoActividad");

const TipoActividadCatalogoSchema = z
  .object({
    codigo: z.string().openapi({ description: "Codigo del tipo de actividad", example: "QUIZ" }),
    nombre: z.string().openapi({ description: "Nombre del tipo de actividad", example: "Quiz" }),
    descripcion: z.string().nullable().openapi({ description: "Descripcion del tipo de actividad", example: "Pregunta de seleccion multiple" }),
    es_juego: z.boolean().openapi({ description: "Indica si es un juego", example: true })
  })
  .openapi("TipoActividadCatalogo");

const ContenidoPasoCrecerSchema = z
  .object({
    id: z.string().uuid().openapi({ description: "ID del contenido CRECER", example: uuidExample }),
    grupo_edad_id: z.string().uuid().openapi({ description: "ID del grupo etario", example: uuidExample }),
    titulo: z.string().openapi({ description: "Titulo del contenido", example: "Conectar" }),
    cuerpo: z.string().openapi({ description: "Cuerpo del contenido", example: "Conecta con la historia biblica" }),
    instruccion_corta: z.string().nullable().openapi({ description: "Instruccion corta", example: "Mira y escucha" })
  })
  .openapi("ContenidoPasoCrecer");

const OpcionActividadSchema = z.object({
  id: z.string().uuid(), actividad_id: z.string().uuid(),
  texto: z.string().openapi({ example: "Dios" }),
  correcta: z.boolean().openapi({ description: "Si es la respuesta correcta", example: true }),
  orden: z.number(), etiqueta: z.string().nullable().openapi({ example: "A" }),
  retroalimentacion: z.string().nullable().openapi({ example: "Correcto!" })
}).openapi("OpcionActividad");

const ActividadSchema = z.object({
  id: z.string().uuid(), tema_id: z.string().uuid(), paso_id: z.string().uuid().nullable(),
  tipo_actividad_id: z.string().uuid(), grupo_edad_id: z.string().uuid(),
  titulo: z.string().openapi({ example: "Quien creo el mundo?" }),
  consigna: z.string().openapi({ example: "Selecciona la respuesta correcta" }),
  orden: z.number(), xp_recompensa: z.number().openapi({ example: 15 }),
  dificultad: z.string().openapi({ example: "facil" }),
  limite_tiempo_seg: z.number().nullable().openapi({ example: 30 }),
  obligatorio: z.boolean(), retroalimentacion: z.string().nullable(),
  configuracion: z.object({}).passthrough(),
  creado_en: z.string().datetime(), actualizado_en: z.string().datetime(),
  tipo_actividad: TipoActividadSchema.nullable(),
  opciones: z.array(OpcionActividadSchema)
}).openapi("Actividad");

const PasoCrecerCatalogoSchema = z
  .object({
    codigo: z.string().openapi({ description: "Codigo del paso CRECER", example: "CONECTAR" }),
    nombre: z.string().openapi({ description: "Nombre del paso CRECER", example: "Conectar" }),
    descripcion: z.string().nullable().openapi({ description: "Descripcion del paso CRECER", example: "Conecta con la historia biblica" }),
    orden: z.number().openapi({ description: "Orden de visualizacion", example: 1 }),
    color_hex: z.string().nullable().openapi({ description: "Color representativo", example: "#3D8BD4" })
  })
  .openapi("PasoCrecerCatalogo");

const PasoTemaCrecerSchema = z
  .object({
    id: z.string().uuid().openapi({ description: "ID del paso del tema", example: uuidExample }),
    tema_id: z.string().uuid().openapi({ description: "ID del tema", example: uuidExample }),
    orden: z.number().openapi({ description: "Orden del paso", example: 1 }),
    tipo_paso: z
      .object({
        id: z.string().uuid().openapi({ description: "ID del tipo de paso", example: uuidExample }),
        codigo: z.string().openapi({ description: "Codigo del tipo de paso", example: "CONECTAR" }),
        nombre: z.string().openapi({ description: "Nombre del tipo de paso", example: "Conectar" }),
        orden: z.number().openapi({ description: "Orden del tipo de paso", example: 1 }),
        color_hex: z.string().nullable().openapi({ description: "Color del tipo de paso", example: "#3D8BD4" })
      })
      .nullable(),
    contenidos: z.array(ContenidoPasoCrecerSchema)
  })
  .openapi("PasoTemaCrecer");

const ClubSchema = z.object({
  id: z.string().uuid(), nombre: z.string().openapi({ example: "Exploradores de la Fe" }),
  descripcion: z.string().nullable(), codigo_invitacion: z.string().openapi({ example: "ABC12345" }),
  activo: z.boolean(), creado_por: z.string().uuid(), creado_en: z.string().datetime()
}).openapi("Club");

const NivelUsuario = z.object({
  usuario_id: z.string().uuid().nullable(),
  xp_total: z.number().nullable().openapi({ example: 1500 }),
  numero_nivel: z.number().nullable().openapi({ example: 3 }),
  nombre_nivel: z.string().nullable().openapi({ example: "Explorador" })
}).openapi("NivelUsuario");

const LogroSchema = z.object({
  id: z.string().uuid(), codigo: z.string().openapi({ example: "PRIMER_TEMA" }),
  nombre: z.string(), descripcion: z.string().nullable(),
  codigo_criterio: z.string(), valor_criterio: z.number().nullable(),
  bono_xp: z.number().openapi({ example: 50 }),
  url_icono: z.string().nullable(), activo: z.boolean(), creado_en: z.string().datetime()
}).openapi("Logro");

const LogroUsuario = z.object({
  usuario_id: z.string().uuid(), logro_id: z.string().uuid(),
  ganado_en: z.string().datetime(), logro: LogroSchema.optional()
}).openapi("LogroUsuario");

const UpdateProfileBody = z.object({
  apodo: z.string().min(2).max(40).optional().openapi({ example: "Semillero123" }),
  grupo_edad_id: z.string().uuid().nullable().optional(),
  url_avatar: z.string().url().nullable().optional(),
  prefiere_audio: z.boolean().optional(),
  tamano_texto_preferido: z.enum(["small","medium","large"]).optional().openapi({ example: "medium" })
}).openapi("UpdateProfileBody");

const ProfileResponse = z.object({
  id: z.string().uuid(),
  usuario_id: z.string().uuid(),
  apodo: z.string(),
  url_avatar: z.string().nullable(),
  clave_avatar: z.string().nullable(),
  grupo_edad_id: z.string().uuid().nullable(),
  prefiere_audio: z.boolean(),
  tamano_texto_preferido: z.string(),
  creado_en: z.string().datetime(),
  actualizado_en: z.string().datetime()
}).openapi("ProfileResponse");

const registry = new OpenAPIRegistry();
registry.register("ErrorResponse", ErrorResponse);
registry.register("HealthResponse", HealthResponse);
registry.register("RootResponse", RootResponse);
registry.register("GuestAuthBody", GuestAuthBody);
registry.register("GuestAuthResponse", GuestAuthResponse);
registry.register("Senda", SendaSchema);
registry.register("GrupoEdad", GrupoEdadSchema);
registry.register("TemaResumido", TemaResumido);
registry.register("TemaDetallado", TemaDetallado);
registry.register("RecursoMultimedia", RecursoMultimediaSchema);
registry.register("VersiculoClave", VersiculoClaveSchema);
registry.register("ReferenciaBiblica", ReferenciaBiblicaSchema);
registry.register("TipoActividad", TipoActividadSchema);
registry.register("TipoActividadCatalogo", TipoActividadCatalogoSchema);
registry.register("ContenidoPasoCrecer", ContenidoPasoCrecerSchema);
registry.register("PasoCrecerCatalogo", PasoCrecerCatalogoSchema);
registry.register("PasoTemaCrecer", PasoTemaCrecerSchema);
registry.register("Actividad", ActividadSchema);
registry.register("ProgresoTema", ProgresoTema);
registry.register("ProgresoActividad", ProgresoActividad);
registry.register("ProgressEventBody", ProgressEventBody);
registry.register("Club", ClubSchema);
registry.register("NivelUsuario", NivelUsuario);
registry.register("LogroUsuario", LogroUsuario);
registry.register("Logro", LogroSchema);
registry.register("UpdateProfileBody", UpdateProfileBody);
registry.register("ProfileResponse", ProfileResponse);

registry.registerPath({ method: "get", path: "/", operationId: "getRoot", tags: ["system"], summary: "Raiz de la API",
  description: "Endpoint principal de Semillas", responses: { 200: { content: { "application/json": { schema: RootResponse } }, description: "Informacion de la API" } } });

registry.registerPath({ method: "get", path: "/health", operationId: "healthCheck", tags: ["system"], summary: "Health Check",
  description: "Verifica que la API funcione correctamente", responses: { 200: { content: { "application/json": { schema: HealthResponse } }, description: "API saludable" } } });

registry.registerPath({ method: "post", path: "/autenticacion/invitado", operationId: "createGuestUser", tags: ["auth"], summary: "Crear usuario invitado",
  description: "Crea un usuario invitado. Usar el X-Guest-User-Id devuelto para autenticar solicitudes posteriores.",
  request: { body: { content: { "application/json": { schema: GuestAuthBody } }, required: true } },
  responses: { 201: { content: { "application/json": { schema: GuestAuthResponse } }, description: "Usuario invitado creado" }, 400: { content: { "application/json": { schema: ErrorResponse } }, description: "Datos invalidos" } } });

registry.registerPath({ method: "get", path: "/catalogo/grupos-etarios", operationId: "listAgeGroups", tags: ["catalogo"],
  summary: "Grupos etarios", description: "Semillas (5-8), Exploradores (9-12), Embajadores (13-17)",
  responses: { 200: { content: { "application/json": { schema: z.object({ exito: z.literal(true), datos: z.array(GrupoEdadSchema) }) } }, description: "Lista de grupos etarios" } } });

registry.registerPath({ method: "get", path: "/catalogo/tipos-actividad", operationId: "listActivityTypes", tags: ["catalogo"],
  summary: "Tipos de actividad", description: "Quiz, flashcards, completar versiculo, etc.",
  responses: { 200: { content: { "application/json": { schema: z.object({ exito: z.literal(true), datos: z.array(TipoActividadCatalogoSchema) }) } }, description: "Lista de tipos" } } });

registry.registerPath({ method: "get", path: "/catalogo/libros-biblicos", operationId: "listBibleBooks", tags: ["catalogo"],
  summary: "Libros biblicos", description: "Listado completo de libros de la Biblia",
  responses: { 200: { content: { "application/json": { schema: z.object({ exito: z.literal(true), datos: z.array(z.object({ codigo: z.string(), nombre: z.string(), orden: z.number(), testamento_id: z.number() })) }) } }, description: "Lista de libros" } } });

registry.registerPath({ method: "get", path: "/catalogo/pasos-crecer", operationId: "listCrecerSteps", tags: ["catalogo"],
  summary: "Pasos CRECER", description: "Conectar, Relatar, Ensenar, Comprobar, Experimentar, Recompensar",
  responses: { 200: { content: { "application/json": { schema: z.object({ exito: z.literal(true), datos: z.array(PasoCrecerCatalogoSchema) }) } }, description: "Lista de pasos CRECER" } } });

registry.registerPath({ method: "get", path: "/catalogo/versiones-biblicas", operationId: "listBibleVersions", tags: ["catalogo"],
  summary: "Versiones biblicas", description: "NVI, RVR60, PDT, etc.",
  responses: { 200: { content: { "application/json": { schema: z.object({ exito: z.literal(true), datos: z.array(z.object({ codigo: z.string(), nombre: z.string(), dominio_publico: z.boolean() })) }) } }, description: "Lista de versiones" } } });

registry.registerPath({ method: "get", path: "/sendas", operationId: "listSendas", tags: ["sendas"],
  summary: "Listar sendas", description: "Padre (azul), Hijo (ambar) y Espiritu Santo (verde)",
  responses: { 200: { content: { "application/json": { schema: z.object({ exito: z.literal(true), datos: z.array(SendaSchema) }) } }, description: "Lista de sendas" } } });

registry.registerPath({ method: "get", path: "/temas", operationId: "listThemes", tags: ["temas"],
  summary: "Listar temas publicos", description: "Filtrable por senda (?senda_id=uuid)",
  request: { query: z.object({ senda_id: z.string().uuid().optional().openapi({ example: uuidExample }) }) },
  responses: { 200: { content: { "application/json": { schema: z.object({ exito: z.literal(true), datos: z.array(TemaResumido) }) } }, description: "Lista de temas" } } });

registry.registerPath({ method: "get", path: "/temas/{tema_id}", operationId: "getTheme", tags: ["temas"],
  summary: "Obtener tema completo", description: "Incluye senda, portada, versiculo clave y referencia biblica",
  request: { params: z.object({ tema_id: z.string().uuid().openapi({ example: uuidExample }) }) },
  responses: { 200: { content: { "application/json": { schema: z.object({ exito: z.literal(true), datos: TemaDetallado }) } }, description: "Tema encontrado" }, 404: { content: { "application/json": { schema: ErrorResponse } }, description: "Tema no encontrado" } } });

registry.registerPath({ method: "get", path: "/temas/{tema_id}/pasos", operationId: "getThemeSteps", tags: ["temas"],
  summary: "Pasos CRECER de un tema", description: "Filtrar por grupo etario (?grupo_edad_id=uuid)",
  request: { params: z.object({ tema_id: z.string().uuid() }), query: z.object({ grupo_edad_id: z.string().uuid().optional() }) },
  responses: { 200: { content: { "application/json": { schema: z.object({ exito: z.literal(true), datos: z.array(PasoTemaCrecerSchema) }) } }, description: "Pasos CRECER" }, 404: { content: { "application/json": { schema: ErrorResponse } }, description: "No encontrado" } } });

registry.registerPath({ method: "get", path: "/temas/{tema_id}/actividades", operationId: "getThemeActivities", tags: ["temas"],
  summary: "Actividades de un tema", description: "Filtrar por grupo etario (?grupo_edad_id=uuid)",
  request: { params: z.object({ tema_id: z.string().uuid() }), query: z.object({ grupo_edad_id: z.string().uuid().optional() }) },
  responses: { 200: { content: { "application/json": { schema: z.object({ exito: z.literal(true), datos: z.array(ActividadSchema) }) } }, description: "Actividades del tema" }, 404: { content: { "application/json": { schema: ErrorResponse } }, description: "No encontrado" } } });

registry.registerPath({ method: "get", path: "/actividades/{actividad_id}", operationId: "getActivity", tags: ["actividades"],
  summary: "Obtener actividad", description: "Actividad con opciones de respuesta y tipo",
  request: { params: z.object({ actividad_id: z.string().uuid() }) },
  responses: { 200: { content: { "application/json": { schema: z.object({ exito: z.literal(true), datos: ActividadSchema }) } }, description: "Actividad encontrada" }, 404: { content: { "application/json": { schema: ErrorResponse } }, description: "No encontrada" } } });

registry.registerPath({ method: "get", path: "/perfil", operationId: "getMyProfile", tags: ["usuario"],
  summary: "Mi perfil", description: "Perfil completo del usuario autenticado",
  responses: { 200: { content: { "application/json": { schema: z.object({ exito: z.literal(true), datos: z.object({ usuario: z.object({ id: z.string().uuid(), rol: z.string(), proveedor: z.string(), nombre_visible: z.string(), correo: z.string().nullable() }), perfil: ProfileResponse }) }) } }, description: "Perfil del usuario" }, 401: { content: { "application/json": { schema: ErrorResponse } }, description: "No autenticado" } } });

registry.registerPath({ method: "patch", path: "/perfil/actualizar", operationId: "updateMyProfile", tags: ["usuario"],
  summary: "Actualizar perfil", description: "Actualiza apodo, avatar, grupo etario o preferencias",
  request: { body: { content: { "application/json": { schema: UpdateProfileBody } }, required: true } },
  responses: { 200: { content: { "application/json": { schema: z.object({ exito: z.literal(true), datos: ProfileResponse }) } }, description: "Perfil actualizado" }, 400: { content: { "application/json": { schema: ErrorResponse } }, description: "Datos invalidos" } } });

registry.registerPath({ method: "get", path: "/progreso/mi", operationId: "getMyProgress", tags: ["progreso"],
  summary: "Mi progreso", description: "Temas iniciados/completados y progreso de actividades",
  responses: { 200: { content: { "application/json": { schema: z.object({ exito: z.literal(true), datos: z.object({ progresos_tema: z.array(ProgresoTema), progresos_actividad: z.array(ProgresoActividad) }) }) } }, description: "Progreso del usuario" }, 401: { content: { "application/json": { schema: ErrorResponse } }, description: "No autenticado" } } });

registry.registerPath({ method: "post", path: "/progreso/eventos", operationId: "postProgressEvent", tags: ["progreso"],
  summary: "Enviar evento de progreso", description: "Evento idempotente (clientEventId unico). No duplica XP si ya existe.",
  request: { body: { content: { "application/json": { schema: ProgressEventBody } }, required: true } },
  responses: { 201: { content: { "application/json": { schema: ProgressEventCreatedResponse } }, description: "Evento nuevo registrado" }, 200: { content: { "application/json": { schema: ProgressEventDuplicateResponse } }, description: "Evento duplicado (ya procesado)" } } });

registry.registerPath({ method: "get", path: "/clubes", operationId: "listClubs", tags: ["clubes"],
  summary: "Listar clubes", description: "Clubs publicos disponibles",
  responses: { 200: { content: { "application/json": { schema: z.object({ exito: z.literal(true), datos: z.array(ClubSchema) }) } }, description: "Lista de clubs" }, 401: { content: { "application/json": { schema: ErrorResponse } }, description: "No autenticado" } } });

registry.registerPath({ method: "get", path: "/clubes/mios", operationId: "getMyClubs", tags: ["clubes"],
  summary: "Mis clubs", description: "Clubs del usuario autenticado",
  responses: { 200: { content: { "application/json": { schema: z.object({ exito: z.literal(true), datos: z.array(ClubSchema) }) } }, description: "Mis clubs" }, 401: { content: { "application/json": { schema: ErrorResponse } }, description: "No autenticado" } } });

registry.registerPath({ method: "get", path: "/gamificacion/mi", operationId: "getMyGamification", tags: ["gamificacion"],
  summary: "Mi estado de gamificacion", description: "Nivel, XP total, logros e insignias del usuario",
  responses: { 200: { content: { "application/json": { schema: z.object({ exito: z.literal(true), datos: z.object({ nivel: NivelUsuario, logros: z.array(LogroUsuario) }) }) } }, description: "Estado de gamificacion" }, 401: { content: { "application/json": { schema: ErrorResponse } }, description: "No autenticado" } } });

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiSpec = generator.generateDocument({
  openapi: "3.1.0",
  info: {
    title: "Semillas",
    description: "API de Semillas - plataforma de ensenanza biblica para ninos, preadolescentes y adolescentes.",
    version: "0.1.0",
    contact: { name: "Semillas", url: "https://semillas.app" }
  },
  servers: [{ url: "http://localhost:8787", description: "Desarrollo local" }],
  tags: [
    { name: "system", description: "Estado y monitoreo del sistema" },
    { name: "auth", description: "Autenticacion y creacion de usuarios" },
    { name: "temas", description: "Temas biblicos y contenido" },
    { name: "catalogo", description: "Catalogos de referencia (grupos de edad, tipos, etc.)" },
    { name: "sendas", description: "Sendas de aprendizaje: Padre, Hijo y Espiritu Santo" },
    { name: "progreso", description: "Progreso del usuario y eventos" },
    { name: "actividades", description: "Actividades y ejercicios" },
    { name: "usuario", description: "Perfil y datos del usuario" },
    { name: "clubes", description: "Clubes y retos cooperativos" },
    { name: "gamificacion", description: "XP, niveles, insignias y rachas" }
  ]
});
