# Protocolo de Identificación de Fuentes Oficiales

> **Proyecto:** Power BI Quality Operations  
> **Propósito:** Procedimiento paso a paso para inspeccionar el archivo `.pbix` existente y descubrir sin conjeturas qué orígenes de datos consume actualmente.

---

## 1. Cómo Descubrir las Fuentes Actuales desde Power BI Desktop

No suponga dónde están los datos; verifíquelo en 3 clics dentro del archivo original:

### Método 1: Ventana de Configuración de Orígenes de Datos
1. Abra el archivo `.pbix` en Power BI Desktop.
2. En la cinta de opciones superior, pestaña **Inicio**, haga clic en la flecha desplegable de **Transformar datos**.
3. Seleccione **Configuración del origen de datos** (*Data Source Settings*).
4. En la ventana emergente verá la lista exacta de orígenes configurados:
   * Si ve rutas como `C:\Users\...` o `D:\...`: El informe consume **archivos locales**.
   * Si ve rutas con `\\servidor\carpeta`: Consume una **carpeta compartida en red local**.
   * Si ve URLs con `https://...sharepoint.com/...`: Consume **SharePoint Online**.
5. Seleccione el origen y haga clic en **Cambiar origen...** para ver la ruta o URL completa.

### Método 2: Inspección del Paso "Origen" en Power Query
1. Clic en **Transformar datos** para abrir el Editor de Power Query.
2. En el panel izquierdo de **Consultas**, seleccione una consulta principal (ej. `BaseNacional` o `Novedades`).
3. En el panel derecho de **Pasos aplicados**, haga clic en el primer paso llamado **Origen** (*Source*).
4. Observe la barra de fórmulas (`fx`):
   * `SharePoint.Files("https://empresa.sharepoint.com/sites/calidad", [ApiVersion = 15])` -> Carpeta de SharePoint.
   * `SharePoint.Tables("https://empresa.sharepoint.com/sites/calidad", [Implementation="2.0"])` -> Lista de SharePoint Online.
   * `Excel.Workbook(File.Contents("C:\Ruta\archivo.xlsx"), null, true)` -> Archivo Excel local.

---

## 2. Registro de Fuentes Identificadas

Utilice la siguiente tabla de auditoría para documentar el estado real de cada origen:

| Nombre de la Consulta | Tipo de Conector M Detectado | Ruta o URL de Origen Exacta | Modo de Almacenamiento | Fecha / Hora Última Actualización | Responsable de la Carga |
| :--- | :--- | :--- | :--- | :--- | :--- |
| *Ej. Novedades_Nac* | *SharePoint.Files* | *https://.../sites/calidad* | *Importación* | *DD/MM/AAAA HH:MM* | *Operaciones Nacional* |
| *Ej. Regional_Ctg* | *Excel.Workbook* | *C:\Users\...* (Ruta local rota) | *Importación* | *Desconocida* | *Coordinador Cartagena* |

---

## 3. Acciones si una Fuente está "Rota" o Desactualizada

1. **Rutas absolutas de usuario:** Si el origen apunta a `C:\Users\JuanPerez\Desktop\...`, al abrirlo en su computador fallará. Debe parametrizarse la ruta o migrarse el archivo a una ubicación accesible (SharePoint o carpeta de red institucional).
2. **Archivos bloqueados por edición simultánea:** Si el Excel se encuentra en red local y alguien lo tiene abierto en modo exclusivo, la actualización fallará con error de bloqueo I/O.
