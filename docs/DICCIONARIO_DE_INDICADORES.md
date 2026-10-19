# Diccionario de Indicadores y Fórmulas DAX

> **Proyecto:** Power BI Quality Operations  
> **Propósito:** Especificación formal de métricas, numeradores, denominadores, dependencias de contexto y plantillas DAX de reemplazo seguro.

---

## 1. Mapa de Entidades e Indicadores Base

Antes de escribir fórmulas DAX complejas, es obligatorio comprender qué representa el conteo:

| Entidad | Función DAX Recomendada | Significado Técnico | Advertencia / Posible Error |
| :--- | :--- | :--- | :--- |
| **Total Vehículos Únicos** | `DISTINCTCOUNT(Tabla[Placa])` | Cantidad de camiones diferentes que operaron en el período. | **No** representa la cantidad de viajes. Un camión que vino 10 veces suma 1. |
| **Total Llegadas / Viajes** | `DISTINCTCOUNT(Tabla[ID_Viaje])` | Total de eventos de llegada a planta/cedis. | Requiere que exista un ID único de viaje o columna combinada `[Placa] & "-" & [Fecha]`. |
| **Total Transferencias** | `DISTINCTCOUNT(Tabla[Transferencia])` | Total de documentos o números de traslado. | Si una transferencia tiene 50 filas de productos, `DISTINCTCOUNT` cuenta 1. |
| **Total Pedidos** | `DISTINCTCOUNT(Tabla[Numero_Pedido])` | Total de órdenes de pedido gestionadas. | Un pedido puede estar dividido en varias entregas parciales. |
| **Total Entregas** | `DISTINCTCOUNT(Tabla[ID_Entrega])` | Total de remisiones o entregas físicas. | Si no existe `ID_Entrega`, indagar cómo el negocio distingue una entrega de otra. |
| **Total Registros de Novedades** | `COUNTROWS(Tabla_Novedades)` | Cantidad de filas de incidencias registradas. | Si se usa sobre la tabla de viajes, inflará artificialmente las cifras de transporte. |

---

## 2. Indicadores de la Página 1: Faltantes y Sobrantes

### [KPI-01] Cantidad Total de Faltantes
* **Propósito:** Sumar las unidades físicas reportadas como faltantes en las descargas.
* **Dependencia:** Requiere la columna de cantidad (ej. `[Cantidad_Faltante]` o `[Cantidad]` con filtro `[Tipo_Novedad] = "Faltante"`).
```dax
Total Faltantes = 
// PLANTILLA: Sustituir 'f_Novedades' y los nombres de campo por los de su modelo real
CALCULATE(
    SUM(f_Novedades[Cantidad_Unidades]),
    KEEPFILTERS(f_Novedades[Tipo_Novedad] = "Faltante")
)
```

### [KPI-02] Cantidad Total de Sobrantes
* **Propósito:** Sumar las unidades físicas reportadas como sobrantes.
```dax
Total Sobrantes = 
CALCULATE(
    SUM(f_Novedades[Cantidad_Unidades]),
    KEEPFILTERS(f_Novedades[Tipo_Novedad] = "Sobrante")
)
```

### [KPI-03] Porcentaje de Faltantes
* **Numerador:** `[Total Faltantes]` (unidades).
* **Denominador:** Debe definirse con el negocio. Opciones: `Total Unidades Despachadas` o `Total Unidades Programadas`.
* **Cuidado:** Si no hay unidades despachadas en la tabla de novedades, el denominador debe venir de una tabla de hechos de despachos vinculada.
```dax
% Faltantes = 
DIVIDE(
    [Total Faltantes],
    [Total Unidades Despachadas], // Sustituir por la medida de denominador oficial
    BLANK() // Evita división por cero y devuelve blanco elegante
)
```

### [KPI-04] Porcentaje de Sobrantes
```dax
% Sobrantes = 
DIVIDE(
    [Total Sobrantes],
    [Total Unidades Despachadas],
    BLANK()
)
```

---

## 3. Indicadores de la Página 2: Vehículos vs Novedades

### [KPI-05] Total Vehículos que Llegaron
```dax
Vehiculos que Llegaron = 
DISTINCTCOUNT(f_Llegadas[Placa_Vehiculo])
```

### [KPI-06] Vehículos con Novedad
* **Propósito:** Contar cuántos vehículos distintos tuvieron al menos un registro de novedad en el período.
```dax
Vehiculos con Novedad = 
CALCULATE(
    DISTINCTCOUNT(f_Novedades[Placa_Vehiculo]),
    USERELATIONSHIP(f_Novedades[Placa_Vehiculo], d_Vehiculo[Placa_Vehiculo]) // Si aplica relación inactiva
)
```

### [KPI-07] Porcentaje de Vehículos Afectados
```dax
% Vehiculos Afectados = 
DIVIDE(
    [Vehiculos con Novedad],
    [Vehiculos que Llegaron],
    0
)
```

### [KPI-08] Total Viajes con Novedad (Alternativa más precisa operacionalmente)
```dax
Viajes con Novedad = 
DISTINCTCOUNT(f_Novedades[ID_Viaje])
```

```dax
% Viajes con Novedad = 
DIVIDE(
    [Viajes con Novedad],
    [Total Viajes Realizados],
    0
)
```

---

## 4. Indicadores de la Página 3: Detalle y Ranking Top 5

### [KPI-09] Frecuencia de Novedades por Vehículo
```dax
Novedades por Vehiculo = 
COUNTROWS(f_Novedades)
```

### [KPI-10] Ranking de Vehículos (Top 5 dinámico)
```dax
Ranking Vehiculo Novedades = 
IF(
    NOT(ISBLANK([Novedades por Vehiculo])),
    RANKX(
        ALLSELECTED(d_Vehiculo[Placa_Vehiculo]),
        [Novedades por Vehiculo],
        ,
        DESC,
        Dense
    )
)
```

* **Criterio de Ordenación del Top 5:**
  * **Opción A:** Por número de novedades registradas (`[Novedades por Vehiculo]`).
  * **Opción B:** Por volumen de unidades afectadas (`[Total Faltantes] + [Total Averias]`).
  * **Opción C:** Por cantidad de viajes con afectación (`[Viajes con Novedad]`).
  * *Acción obligatoria:* Acordar con el líder de Gestión de Calidad cuál de estos 3 criterios rige el tablero.
