# Power BI Quality Operations — Guía de Trabajo

Centro de operaciones web interactivo y documentación técnica para el diagnóstico, actualización y validación del dashboard de Gestión de Calidad (Power BI, SharePoint Online y Microsoft 365).

---

## 1. Cómo Abrir y Utilizar la Guía en su Computador

Esta aplicación ha sido diseñada con **HTML5, CSS3 y JavaScript vanilla** puro. No requiere Node.js, npm, servidores locales, bases de datos ni conexión a Internet para funcionar.

1. Navegue en el Explorador de Windows a la carpeta:
   `c:\Users\USUARIO\Music\CASA\1DarnelPowerbi\guia-powerbi-calidad\`
2. Haga doble clic en el archivo:
   [index.html](file:///c:/Users/USUARIO/Music/CASA/1DarnelPowerbi/guia-powerbi-calidad/index.html)
3. La aplicación se abrirá en su navegador predeterminado (Microsoft Edge, Google Chrome, etc.) incluso en modo sin conexión (`file:///...`).

---

## 2. Estructura de la Solución

```text
guia-powerbi-calidad/
├── index.html                   # Interfaz de usuario interactiva y centro de operaciones
├── styles.css                   # Sistema de diseño Clean Modern Executive (paleta petróleo)
├── app.js                       # Lógica de cálculo real, persistencia localStorage y utilidades
├── README.md                    # Manual de uso y especificaciones del sistema
└── docs/
    ├── GUIA_OPERATIVA.md          # Protocolo de seguridad y primera jornada
    ├── CHECKLIST_PRIMERA_JORNADA.md # Checklist de 10 tareas clave para el primer día
    ├── MATRIZ_DE_REQUERIMIENTOS.md  # Mapeo de requerimientos, certeza y dependencias
    ├── DICCIONARIO_DE_INDICADORES.md # Fórmulas DAX, numeradores, denominadores y reglas
    ├── GUIA_SHAREPOINT.md         # Diagnóstico de almacenamiento M365 y conectores
    ├── GUIA_POWER_QUERY_DAX.md    # Anexar vs Combinar, tipado M y modelo en estrella
    ├── GUIA_FILTROS.md            # Sincronización de segmentadores entre páginas 1, 2 y 3
    ├── PLAN_DE_PRUEBAS.md         # Matriz de 10 pruebas unitarias y de integración
    ├── PREGUNTAS_PENDIENTES.md    # Cuestionario crítico para líderes de Calidad y TI
    └── FUENTES_OFICIALES.md       # Procedimiento para inspeccionar orígenes en el PBIX
```

---

## 3. Características y Funcionalidades Interactivas

* **Modo Primera Jornada:** Guía paso a paso desde el momento en que se sienta frente al computador.
* **Cálculo de Progreso Real:** La barra de avance y métricas no son números simulados; se derivan de las tareas, fases, pruebas y checklists que efectivamente marque.
* **Persistencia Local Segura:** El progreso, respuestas y notas se almacenan automáticamente en el `localStorage` del navegador.
* **Exportación e Importación JSON:** Botón en el encabezado para descargar un respaldo de sus notas o transferir el avance a otro equipo.
* **Selector Dinámico de Fuentes SharePoint:** Guías dedicadas para Carpeta de SharePoint (Excel), Lista de SharePoint y archivos locales.
* **Inventario Dinámico de Columnas:** Herramienta interactiva para registrar, catalogar y buscar columnas reales (especialmente las nuevas en verde).
* **Buscador en Tiempo Real:** Localice rápidamente términos de DAX, Power Query o problemas comunes.
* **Modo Impresión:** Estilos optimizados para exportar a PDF o imprimir mediante `Ctrl + P`.

---

## 4. Seguridad y Privacidad

* La herramienta no solicita contraseñas corporativas ni tokens de acceso.
* No envía solicitudes HTTP hacia servidores externos ni expone información interna de la empresa.
