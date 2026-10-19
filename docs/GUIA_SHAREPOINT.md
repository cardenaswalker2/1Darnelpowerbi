# Guía Operativa de Conexión a SharePoint Online y Excel

> **Proyecto:** Power BI Quality Operations  
> **Propósito:** Diagnosticar la estructura real de almacenamiento en Microsoft 365, elegir el conector idóneo y prevenir fallos de autenticación.

---

## 1. Regla de Oro: ¿Qué tipo de fuente tienes realmente?

En proyectos empresariales con Microsoft 365 suele haber confusión terminológica. Antes de configurar un conector, identifica la realidad física de los datos:

| Escenario Real | Descripción Física | Conector Correcto en Power BI Desktop |
| :--- | :--- | :--- |
| **Escenario A: Archivos Excel en SharePoint** | Archivos `.xlsx` guardados en una Biblioteca de Documentos o sincronizados con OneDrive empresarial. | **Carpeta de SharePoint** (`SharePoint Folder`) o Conector Web con URL directa del archivo. |
| **Escenario B: Lista de SharePoint Online** | Tablas nativas tipo lista de SharePoint (`/Lists/NombreLista`), con columnas y formularios web propios. | **Lista de SharePoint Online** (`SharePoint Online List` v2.0). |
| **Escenario C: Archivos Locales o Red SMB** | Archivos guardados en disco `C:`, `D:` o rutas `\\servidor\carpeta`. | **Excel** local (`Excel Workbook`). |

> [!CAUTION]
> **Error Muy Frecuente:** Intentar conectar un archivo Excel usando el conector de *Lista de SharePoint Online*. Esto provocará el error de que la lista no existe o no se encuentran tablas. Si es un archivo Excel, debe usarse el conector de Carpeta de SharePoint o Web.

---

## 2. Anatomía de la URL de SharePoint

Para no cometer errores de autenticación, es fundamental extraer únicamente la **URL raíz del sitio**:

* **URL en el navegador al abrir el sitio o carpeta:**
  `https://tuempresa.sharepoint.com/sites/GestionCalidad/Documentos%20Compartidos/General/BasesDatos/`
* **URL que se debe ingresar en Power BI:**
  `https://tuempresa.sharepoint.com/sites/GestionCalidad`

### Pasos para limpiar la URL:
1. Copia la dirección completa desde la barra de direcciones del navegador.
2. Elimina todo lo que esté después del nombre del sitio (después de `/sites/NombreDelSitio` o `/teams/NombreDelEquipo`).
3. No incluyas `/Shared Documents`, ni nombres de archivos `.xlsx`, ni parámetros con `?` o `#`.

---

## 3. Conexión a Archivos Excel en SharePoint (Paso a Paso)

### Método Recomendado: Conector Carpeta de SharePoint
1. En Power BI Desktop, clic en **Inicio** > **Obtener datos** > **Más...**
2. Selecciona **SharePoint** > **Carpeta de SharePoint** > Clic en **Conectar**.
3. Pega la URL raíz del sitio (ej. `https://tuempresa.sharepoint.com/sites/Operaciones`).
4. **Autenticación:** En la ventana emergente, selecciona **Cuenta Microsoft** (o Cuenta Organizacional) > Clic en **Iniciar sesión** con tu correo corporativo > Clic en **Conectar**.
5. Clic en **Transformar datos** (¡nunca en Combinar directamente!).
6. En Power Query, filtra la columna `Folder Path` para apuntar a la subcarpeta específica donde están las bases.
7. Filtra la columna `Name` para seleccionar el archivo exacto (ej. `Base_Nacional_Novedades.xlsx`).
8. Clic en el botón binario `[Binary]` de la columna `Content` para expandir el libro de Excel.
9. Selecciona la hoja o tabla estructurada adecuada.

---

## 4. Conexión a Listas de SharePoint Online (Paso a Paso)

1. En Power BI Desktop, clic en **Inicio** > **Obtener datos** > **SharePoint Online List**.
2. Ingresa la URL del sitio de SharePoint.
3. En la versión de la API, selecciona **2.0** (Recomendada por Microsoft por mayor rendimiento y mejor tipado de columnas).
4. En autenticación, elige **Cuenta Microsoft** e inicia sesión corporativa.
5. Marca la casilla de la lista requerida (ej. `NovedadesCalidad`).
6. Clic en **Transformar datos** para inspeccionar las columnas en Power Query.

---

## 5. Solución de Problemas de Autenticación y Permisos

* **Error: "No se pudo autenticar con las credenciales proporcionadas":**
  1. Ve a **Archivo** > **Opciones y configuración** > **Configuración del origen de datos**.
  2. Busca la URL del sitio de SharePoint.
  3. Clic en **Borrar permisos** o **Editar permisos**.
  4. Vuelve a autenticarte asegurándote de elegir **Cuenta Microsoft** (no Windows, no Anónimo).
* **Error 403 Forbidden / Acceso Denegado:**
  * Solicita al propietario del sitio o al administrador de TI permisos mínimos de **Lectura** en la biblioteca o lista correspondiente.
* **Documentación Oficial Vigente:**
  * [Conectar a Lista de SharePoint Online en Power BI Desktop](https://learn.microsoft.com/es-es/power-bi/connect-data/desktop-sharepoint-online-list)
