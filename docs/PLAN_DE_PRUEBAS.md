# Plan de Pruebas Unitarias y de Integración

> **Proyecto:** Power BI Quality Operations  
> **Propósito:** Protocolo formal de validación de cálculos, visuales, filtros y actualización de datos antes del pase a producción.

---

## Matriz de Casos de Prueba

| Código | Objeto de Prueba | Preparación / Prerrequisito | Procedimiento Paso a Paso | Resultado Esperado | Criterio de Aceptación |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TEST-01** | Carga y Disponibilidad de Fuentes | Copia de trabajo del PBIX abierta. | En Power Query, hacer clic en "Actualizar vista previa" en todas las consultas. | Todas las consultas cargan sin errores amarillos o rojos de origen. | 0 errores de conexión o formato de origen. |
| **TEST-02** | Detección de Columnas Nuevas | Archivos de origen con columnas verdes identificadas. | Comprobar en la lista de campos de Power BI que las columnas nuevas aparecen con su tipo correcto. | Campos visibles, nombres funcionales legibles y tipado adecuado (número, fecha, texto). | Todas las columnas verdes disponibles para visuales. |
| **TEST-03** | Cálculo de Faltantes y Sobrantes | Datos de un mes cerrado (ej. Julio) en Excel. | En Excel, filtrar `Tipo = "Faltante"` y sumar unidades. Comparar con la tarjeta de la Página 1 de Power BI. | La suma de la tarjeta de Power BI coincide exactamente con la suma en Excel. | Diferencia = 0 unidades (100% conciliado). |
| **TEST-04** | Denominador de Porcentajes | Definición oficial de negocio acordada. | Evaluar el resultado de `% Faltantes` frente a cálculo manual `Unidades Faltantes / Denominador`. | El porcentaje es coherente (ej. entre 0.05% y 2.5%, no más del 100% ni infinito). | División manejada con `DIVIDE()`, sin errores `NaN`. |
| **TEST-05** | Distinción Vehículos vs Viajes | Placa conocida con más de 1 llegada en el mes. | Filtrar por esa placa. Comprobar `Vehículos que llegaron` (debe ser 1) y `Llegadas / Viajes` (debe ser > 1). | El modelo no confunde camiones únicos con eventos de llegada. | Conteo único de placa = 1; viajes = total real. |
| **TEST-06** | Integridad del Top 5 de Vehículos | Datos de novedades con múltiples vehículos. | Ordenar la tabla de la Página 3 por `Ranking Vehículo`. Validar manualmente los 5 primeros lugares. | Muestra los 5 camiones de mayor impacto según el criterio acordado. | Lista de 5 filas sin duplicación de placa ni empates anómalos. |
| **TEST-07** | Detalle Multirregistro de Placa | Elegir una placa con 5 pedidos y 3 novedades. | Seleccionar la placa en el segmentador de la Página 3. | La tabla de detalle muestra las 5 transferencias/entregas y sus estados específicos. | Visualización tabular completa sin pérdida de registros. |
| **TEST-08** | Sincronización de Segmentadores | Filtro de Fecha y Operación en Página 1. | Seleccionar "Julio" y "Cartagena" en Página 1. Navegar a Páginas 2 y 3. | Las Páginas 2 y 3 reflejan automáticamente el filtro de "Julio" y "Cartagena". | Contexto de filtro compartido y visuales actualizados. |
| **TEST-09** | Incorporación de Nuevos Datos | Agregar 1 fila de prueba en la base de datos de origen. | Guardar origen y presionar "Actualizar" en Power BI Desktop. | La fila aparece reflejada en la tabla de detalle y suma en los KPIs. | Proceso de actualización incremental funcional. |
| **TEST-10** | Conciliación Global con Liderazgo | Reporte completo generado. | Sesión de revisión con el Coordinador de Calidad comparando cifras oficiales. | Aprobación formal de las cifras calculadas en las 3 páginas. | Visto bueno formal de aceptación técnica y de negocio. |
