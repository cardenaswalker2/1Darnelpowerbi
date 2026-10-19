# Protocolo de Operación y Primera Jornada

> **Proyecto:** Power BI Quality Operations  
> **Propósito:** Procedimientos paso a paso para ejecutar el diagnóstico inicial sin alterar el entorno productivo.

---

## 1. El Mandamiento de Oro: "Antes de Tocar el Informe"

Antes de abrir y editar cualquier archivo en el entorno corporativo:
1. **Verificar permisos y accesos:** No intente forzar accesos; solicite a los canales autorizados.
2. **Crear una copia de trabajo versionada:**  
   * Nombre sugerido: `Dashboard_Gestion_Calidad_TRABAJO_YYYYMMDD_v1.0.pbix`.
   * **Nunca** trabajar directamente sobre el archivo productivo en la red o sobreescribir el informe publicado en Power BI Service.
3. **No alterar los orígenes de datos compartidos:** Si las bases son libros Excel en una carpeta compartida, cree una copia de prueba de los libros si necesita hacer pruebas destructivas de columnas.

---

## 2. Flujo de Trabajo en 7 Pasos Clave

1. **Paso 1: Comprender el Objetivo:**
   * El objetivo es renovar el dashboard de Gestión de Calidad para monitorear faltantes, sobrantes, vehículos vs novedades y detalle de transferencias, reduciendo reprocesos manuales.
2. **Paso 2: Confirmar Accesos:**
   * Power BI Desktop instalado.
   * Acceso de lectura al PBIX original.
   * Acceso a la ubicación de los datos (SharePoint o carpetas compartidas).
3. **Paso 3: Proteger el Trabajo Existente:**
   * Generar la copia local de respaldo y documentar el tamaño y fecha del PBIX original.
4. **Paso 4: Localizar las Fuentes de Datos:**
   * Ejecutar la inspección de "Configuración del origen de datos" en Power BI.
5. **Paso 5: Revisar las Páginas Existentes:**
   * Registrar visuales, segmentadores y filtros actuales de las Páginas 1, 2 y 3.
6. **Paso 6: Inventariar las Columnas Nuevas (Verdes):**
   * Cotejar el archivo Excel o lista de SharePoint para identificar los campos rotulados en verde y su significado.
7. **Paso 7: Documentar Hallazgos y Preguntas:**
   * Llenar el formulario de diagnóstico en la aplicación web para consolidar el estado de partida.
