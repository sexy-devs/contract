GUION PRESENTACION - MIS PARTES (INTRO + HU-03)

===================================================
PARTE 1 - INTRO DEL SISTEMA (camara)
===================================================

Hola, buenas. Les voy a contar de que se trata Contract.

La idea nace de un problema cotidiano: cuando alguien necesita un plomero, un electricista, un gasista, hoy lo resuelve preguntando a conocidos, buscando en redes, o tocando puertas.
No hay forma facil de saber si esa persona esta matriculada, si tiene experiencia real, ni de comparar opciones. Y del otro lado, los profesionales independientes, sobre todo los que recien arrancan, tampoco tienen un canal organizado para conseguir clientes.

Contract conecta esas dos puntas: por un lado el cliente que necesita un servicio de mantenimiento, por otro el prestador que lo ofrece. Un usuario puede operar como uno, como el otro, o como ambos.

Sobre las tecnologias: para el backend elegimos Bun como runtime, porque es mucho mas rapido que Node tanto para correr como para instalar dependencias. Encima usamos Express para la API, Drizzle como ORM contra PostgreSQL (tipado fuerte y control directo sobre las consultas), Zod para validar todo lo que entra por la API, y JWT para autenticacion y sesiones. Para las imagenes de perfil y los documentos de matricula usamos Cloudinary, asi no manejamos almacenamiento de archivos nosotros mismos. Del lado del frontend usamos React con Vite, por la agilidad en el desarrollo, y Tailwind para los estilos, para no escribir CSS a mano archivo por archivo. En resumen, un stack moderno y liviano que nos permitio movernos rapido entre los tres sin pisarnos.

Antes de entrar a la demo les cuento rapido como trabajamos en equipo. Organizamos todo el desarrollo con Jira: armamos los sprints, las historias de usuario y las tareas tecnicas desglosadas ahi,
para repartirnos el trabajo y hacer seguimiento de avance. Y del lado del codigo, usamos GitHub con ramas por feature, vamos mergeando a develop a medida que cada parte queda lista, y de ahi a main. Esto nos permitio laburar en paralelo sin pisarnos el trabajo.

En total fueron 3 semanas de desarrollo: la primera la usamos para disenar la arquitectura, elegir las tecnologias y dejar armada la base de datos, y las otras dos semanas fueron de desarrollo a full.

Para este sprint nos enfocamos en 4 historias de usuario: registro, inicio de sesion, gestion del perfil y busqueda de prestadores. Mis companeros van a mostrar el registro y el login, se las dejo a ellos.

(opcional, mostrar 10 segundos de pantalla: iniciar-sesion o el catalogo ya poblado, solo para que se vea que la app anda)

Ahora les paso la posta.

===================================================
PARTE 2 - HU-03: GESTION DEL PERFIL PERSONAL (camara)
===================================================

La historia que me toca es la HU-03, y dice asi: como usuario registrado, quiero gestionar mi informacion personal para mantener actualizados mis datos dentro de Contract.

Esto no es un simple formulario de editar nombre y apellido. El perfil cumple un rol distinto segun el tipo de usuario, y por eso vale la pena pararse un segundo a explicarlo antes de entrar a la demo.

Para un cliente, el perfil es basicamente su identidad dentro del sistema: quien es, como lo contactan, y donde esta ubicado. Esa ubicacion no es un dato de relleno, despues la usa el sistema para que los prestadores sepan si le pueden llegar a cubrir la zona, y para que el buscador filtre bien.

Para un prestador el perfil es mucho mas grande, porque ahi se juega literalmente conseguir o no conseguir clientes. Es su carta de presentacion: ahi carga su descripcion y anios de experiencia, su zona y radio de cobertura, su disponibilidad horaria, la documentacion que acredita que es un profesional matriculado (lo que le da la insignia de verificado), y los servicios concretos que ofrece con su precio. Practicamente todo lo que un cliente va a ver de el cuando entra a su ficha en el catalogo sale de esta misma pantalla de perfil. Si un prestador no completa bien su perfil, directamente no se lo puede encontrar bien en una busqueda, o aparece sin informacion, sin precio, sin disponibilidad.

Por esa diferencia de peso entre uno y otro, el perfil de cliente y el de prestador no comparten la misma pantalla: tienen secciones distintas, validaciones distintas, y los datos ademas se guardan en tablas distintas por detras, porque un cliente y un prestador son entidades distintas en nuestra base de datos aunque los dos sean "usuarios".

Una aclaracion mas antes de entrar a la demo: la ubicacion, en todo el sistema y no solo en el perfil, no se carga como texto libre. Sale de un catalogo real de provincias y localidades, en cascada: primero elegis la provincia, y recien ahi se habilitan las localidades de esa provincia. Lo decidimos asi para no tener direcciones sueltas, mal escritas o inventadas, y porque esa misma ubicacion es la que despues usa el buscador de prestadores para filtrar resultados por zona, entonces si estuviera como texto libre ese filtro no funcionaria bien. Y el feedback de guardado es siempre el mismo en toda la app, para que sea consistente: un toast con una barra de progreso que se cierra solo, y la validacion es en el momento, si falta un campo obligatorio directamente no te deja guardar.

Dicho esto, se los muestro a los dos para que se note bien la diferencia.

--- PANTALLA: CLIENTE ---

1. Login con la cuenta cliente, entrar a Mi perfil (desde el dropdown del avatar arriba a la derecha).
2. Mostrar la seccion Informacion personal: foto (click en Cambiar foto, explicar que sube directo sin pasos extra), nombre y apellido.
3. Informacion de contacto: email de solo lectura (no se puede editar, por diseno, porque es lo que usa para loguearse) y telefono editable.
4. Domicilio: mostrar que es Provincia - Localidad en cascada, no texto libre. Explicar de nuevo, rapido: elegimos esto para no tener direcciones sueltas sin validar, todo sale de un catalogo real.
5. Tocar Guardar cambios, mostrar el toast de confirmacion con la barra de progreso que se cierra sola.
6. Mencionar rapido: todo esto valida en el momento, si falta un campo obligatorio no te deja guardar.

--- PANTALLA: PRESTADOR ---

Ahora el mismo perfil, pero con una cuenta de prestador, aca cambia bastante porque, como les decia, un prestador tiene mucha mas informacion que mantener, por eso esta separado en pestanas en vez de ser todo una sola pantalla larga.

1. Logout, login con cuenta prestador, entrar a Mi perfil.
2. Mostrar que ahora es por pestanas: Datos personales, Informacion profesional, Cobertura y disponibilidad, Matricula/Documentacion, Servicios ofrecidos.
3. Informacion profesional: descripcion mas anios de experiencia. Esto es lo primero que lee un cliente cuando entra a la ficha publica de un prestador.
4. Cobertura y disponibilidad: Provincia/Localidad de nuevo, radio de cobertura en km, disponibilidad horaria. Esto es lo que define si el prestador le puede llegar a cubrir la zona y el horario a un cliente puntual.
5. Matricula/Documentacion: subir un archivo (imagen o PDF), mostrar que queda en estado Pendiente esperando aprobacion, con vista previa del documento. Esto es lo que mas adelante le da la insignia de verificado que se ve en el catalogo.
6. Servicios ofrecidos: agregar un servicio del catalogo con su monto, guardar. Estos son exactamente los que despues aparecen listados en su ficha publica con el precio que el cargo aca.

Cierre: y con esto termino mi parte. Le paso el microfono a mi companero que les muestra como se buscan y filtran estos prestadores desde el catalogo.
