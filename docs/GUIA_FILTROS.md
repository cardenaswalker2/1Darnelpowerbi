# Guía de Sincronización de Filtros y Segmentadores

> **Proyecto:** Power BI Quality Operations  
> **Propósito:** Diagnosticar, corregir y configurar la sincronización de segmentadores entre las tres páginas del dashboard de Gestión de Calidad.

---

## 1. Diagnóstico: ¿Por qué fallan los filtros entre páginas?

Existen tres causas raíz cuando un filtro funciona en una página pero no en otra:

1. **Falta de Sincronización en el Panel de Sincronización:** El segmentador está creado en la Página 1, pero no se ha vinculado para que envíe su estado a la Página 2 y 3.
2. **Columnas de Origen Diferentes:** La Página 1 filtra por `BaseNacional[Placa]` y la Página 2 usa una gráfica basada en `BaseCartagena[Placa]`. Si ambas tablas no están unidas por una tabla dimensión de Placas (`d_Vehiculo[Placa]`), el filtro no se propagará.
3. **Interacciones Desactivadas:** En la pestaña *Formato* > *Editar interacciones*, el icono "Ninguno" está marcado para ciertos visuales.

---

## 2. Paso a Paso para Sincronizar Segmentadores

Referencia Oficial: [Segmentadores en Power BI y sincronización entre páginas](https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-slicers)

### Procedimiento:
1. En Power BI Desktop, abra la **Página 1**.
2. Vaya a la cinta de opciones superior > pestaña **Ver** > active la casilla **Sincronizar segmentadores**.
3. Se abrirá un panel lateral a la derecha con una cuadrícula de todas las páginas del informe.
4. Seleccione el segmentador que desea sincronizar (ej. `Segmentador de Placa` o `Segmentador de Fechas`).
5. En el panel observará dos columnas de casillas para cada página:
   * **Columna con icono de Flechas Giratorias (Sincronizar):** Marca las páginas que deben compartir el mismo valor seleccionado.
   * **Columna con icono de Ojo (Visibilidad):** Marca si el control visual debe ser visible en esa página o si debe operar de forma oculta en segundo plano.
6. **Configuración Recomendada:**
   * **Placa:** Sincronizar en Páginas 1, 2 y 3. Visible en Páginas 2 y 3 (o en las 3 si el usuario lo requiere).
   * **Rango de Fechas / Mes:** Sincronizar en Páginas 1, 2 y 3. Visible en las tres páginas.
   * **Operación / Centro:** Sincronizar en Páginas 1, 2 y 3.
   * **Filtros específicos de detalle (ej. Tipo de Novedad):** Sincronizar solo si el usuario no desea comparar tipos distintos en simultáneo.

---

## 3. Matriz de Comportamiento Esperado de Filtros

| Segmentador / Filtro | Página 1 (Faltantes/Sobrantes) | Página 2 (Vehículos vs Novedades) | Página 3 (Detalle y Top 5) | Justificación de Negocio |
| :--- | :---: | :---: | :---: | :--- |
| **Fecha / Período** | Sincronizado | Sincronizado | Sincronizado | El análisis gerencial debe corresponder siempre a la misma ventana de tiempo. |
| **Operación (Nacional / Regional)** | Sincronizado | Sincronizado | Sincronizado | Permite aislar el comportamiento de una planta o ver el consolidado general. |
| **Placa de Vehículo** | Opcional | Sincronizado | Sincronizado | Al filtrar una placa en la Pág 2, la Pág 3 debe mostrar automáticamente su historial completo. |
| **Tipo de Novedad** | Local | No Aplica / Desacoplado | Local | En Pág 1 se comparan Faltantes vs Sobrantes; en Pág 2 se evalúa afectación global del camión. |

---

## 4. Verificación de Interacciones entre Visuales

1. Seleccione el segmentador en la página.
2. Vaya a **Formato** > **Editar interacciones**.
3. Verifique que sobre las tarjetas, gráficos de barras y tablas aparezca activo el icono de **Filtrar** (embudo) y no el icono de **Ninguno** (círculo tachado).
