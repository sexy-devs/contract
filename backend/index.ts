import { app } from "./src/app";
import { env } from "./src/config/env";

app.listen(env.port, () => {
  console.log(`Servidor escuchando en http://localhost:${env.port}`);
  console.log(`Swagger disponible en http://localhost:${env.port}/docs`);
});
