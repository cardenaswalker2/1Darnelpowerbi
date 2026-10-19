# Panel de Preguntas Pendientes para la Empresa

> **Proyecto:** Power BI Quality Operations  
> **Propósito:** Cuestionario técnico y operacional estructurado para resolver incertidumbres críticas antes de modificar el PBIX oficial.

---

## Cuestionario Crítico de Negocio y Tecnología

### Bloque A: Fuentes y Accesos
1. **¿Dónde están ubicadas las fuentes oficiales que alimentan el PBIX hoy?**
   * *Por qué importa:* Determina el conector a utilizar (SharePoint Folder, SharePoint List, Local).
   * *Impacto:* Bloquea la Fase 1 y 2.
   * *A quién preguntar:* Al analista actual del informe o administrador de TI.

2. **¿Los datos son archivos Excel almacenados en SharePoint o son Listas nativas de SharePoint?**
   * *Por qué importa:* Usar el conector incorrecto genera errores inmediatos de conexión.
   * *Impacto:* Bloquea la configuración en Power Query.

3. **¿Tengo permisos asignados para leer la carpeta/lista de SharePoint y para publicar en el Workspace de Power BI Service?**
   * *Por qué importa:* Define si el entregable final se queda en archivo local `.pbix` o se publica en la nube.
   * *A quién preguntar:* Al propietario del sitio de SharePoint y administrador de Power BI.

---

### Bloque B: Reglas de Negocio e Indicadores
4. **¿Cuáles son las columnas nuevas identificadas en color verde y qué significa cada una?**
   * *Por qué importa:* Garantiza que los campos requeridos se integren al modelo con el tipo de dato correcto.
   * *Impacto:* Bloquea el cálculo de los nuevos reportes.

5. **¿Qué campo o combinación de campos identifica de forma única una Entrega?**
   * *Por qué importa:* Evita duplicar o triplicar conteos de entregas en transferencias con múltiples productos.
   * *Impacto:* Crítico para evitar cifras infladas en la Página 2 y 3.

6. **¿Cómo se define una "Llegada" o "Viaje" de un vehículo?**
   * *Por qué importa:* Un vehículo (placa) puede realizar 15 llegadas en el mes. No son conceptos intercambiables.
   * *Opciones a consultar:* ¿Es la combinación de `Placa + Fecha`? ¿Existe un `Nro_Manifiesto` o `ID_Viaje`?

7. **¿Cuál es el denominador oficial para calcular el % de Faltantes y % de Sobrantes?**
   * *Por qué importa:* Un porcentaje sin base matemática clara carece de validez gerencial.
   * *Opciones a consultar:* ¿Total unidades despachadas? ¿Total unidades recibidas? ¿Total pedidos?

8. **¿Bajo qué criterio debe ordenarse el Top 5 de Vehículos con novedades?**
   * *Por qué importa:* Puede ordenarse por cantidad de registros de novedades, por volumen de unidades físicas dañadas/faltantes, o por porcentaje de viajes fallidos.

---

### Bloque C: Procesos y Automatización
9. **¿Cuál es el procedimiento autorizado para actualizar los datos hoy en día?**
   * *Por qué importa:* El PDF menciona que copian y pegan filas entre hojas de cálculo. Hay que entender qué hojas se tocan antes de proponer automatizaciones.

10. **¿Está autorizado el uso de Power Automate o flujos de trabajo en la cuenta corporativa?**
    * *Por qué importa:* Si la empresa no tiene licencias o restringe flujos en la nube, la automatización debe resolverse en Power Query y plantillas estandarizadas.
