# Tablero de ocupacion v3 modular

Estado: fuente modular en desarrollo local. No es todavia el demo principal de revision.

Para revisar una version que abre por doble clic y conserva la experiencia de v2, usar:

- `../tablero-seguimiento-ocupacion-v3-demo.html`

Esta carpeta modular no reemplaza a:

- `../tablero-seguimiento-ocupacion.html`
- `../tablero-seguimiento-ocupacion-v2.html`
- `../tablero-seguimiento-ocupacion-v3-demo.html`

## Objetivo

Separar el tablero en modulos independientes antes de seguir creciendo el HTML monolitico.

La prioridad de esta version no es copiar todas las pantallas de v2, sino fijar una arquitectura limpia:

- contratos de datos para archivos de ocupacion, inventario, presupuesto y Revenue;
- servicios de lectura y validacion de archivos;
- reglas de negocio separadas de la interfaz;
- vistas independientes para dashboard general, hoteles, parques y carga de datos.

## Como abrir esta fuente modular

Por usar modulos ES (`type="module"`), algunos navegadores bloquean `file://`. Para probar localmente:

```bash
cd /Users/mellolfbo/Documents/Claude/Projects/Comfenalco\ IA/05-tablero-ocupacion/v3-modular
python3 -m http.server 8055
```

Luego abrir:

```text
http://localhost:8055/
```

Tambien se puede usar el lanzador:

```text
../abrir-v3-modular.command
```

## Contratos S1

La version modular prioriza archivos `.csv` o `.json` normalizados.

Plantillas disponibles:

- `templates/ocupacion-inventario-diario.csv`
- `templates/presupuesto-ejecucion.csv`
- `templates/reglas-revenue.csv`

Contratos implementados:

- `occupancyInventory`: una fila por sede, tipo de unidad y fecha. Controla inventario total, unidades ocupadas, unidades libres, porcentaje de ocupacion, fuente y fecha de corte.
- `budgetExecution`: una fila por sede y periodo. Controla presupuesto, ejecutado, cumplimiento y confiabilidad del dato.
- `revenueRules`: una fila por sede, tipo de unidad, plan de venta y tramo. Conserva la regla de Revenue que traduce ocupacion en accion.

Los `.xlsx` quedan como formato esperado de negocio, pero requieren una libreria de lectura o una conversion previa a CSV/JSON para que el demo siga sin dependencias externas.

## Limites actuales

- No hay backend.
- No hay recuperacion real de contrasena por correo.
- No reemplaza Power BI ni Zeus.
- No migra todavia todos los datos embebidos de v2.
- No usa el parser de texto pegado del PDF como flujo principal.
- No construye todavia las pestanas completas por hotel/parque; S1 solo deja lista la base de datos para esos sprints.
