INSERT INTO "servicios" ("nombre")
SELECT seed.nombre
FROM (
  VALUES
    ('Carpintería'),
    ('Electricidad'),
    ('Pintura'),
    ('Plomería')
) AS seed(nombre)
WHERE NOT EXISTS (
  SELECT 1
  FROM "servicios"
  WHERE "servicios"."nombre" = seed.nombre
);
