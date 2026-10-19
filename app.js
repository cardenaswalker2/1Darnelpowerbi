/**
 * POWER BI QUALITY OPERATIONS — GUÍA DE TRABAJO
 * Lógica de estado local, persistencia localStorage, buscador, exportación e interactividad
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'PBI_QUALITY_OPS_STATE_v1';

  // Estado Inicial por Defecto
  const defaultState = {
    currentSection: 'inicio',
    lastVisited: 'inicio',
    tasks: {
      // Modo Primera Jornada
      'pj_step_1': false,
      'pj_step_2': false,
      'pj_step_3': false,
      'pj_step_4': false,
      'pj_step_5': false,
      'pj_step_6': false,
      'pj_step_7': false,
      // Fases del Proyecto
      'phase_1': 'pendiente',
      'phase_2': 'pendiente',
      'phase_3': 'pendiente',
      'phase_4': 'pendiente',
      'phase_5': 'pendiente',
      'phase_6': 'pendiente',
      'phase_7': 'pendiente',
      'phase_8': 'pendiente',
      'phase_9': 'pendiente',
      'phase_10': 'pendiente',
      'phase_11': 'pendiente',
      'phase_12': 'pendiente',
      // Pruebas
      'test_01': 'pendiente',
      'test_02': 'pendiente',
      'test_03': 'pendiente',
      'test_04': 'pendiente',
      'test_05': 'pendiente',
      'test_06': 'pendiente',
      'test_07': 'pendiente',
      'test_08': 'pendiente',
      'test_09': 'pendiente',
      'test_10': 'pendiente',
      // Checklist Final
      'chk_sources': false,
      'chk_columns': false,
      'chk_dax': false,
      'chk_page1': false,
      'chk_page2': false,
      'chk_page3': false,
      'chk_slicers': false,
      'chk_tests': false,
      'chk_docs': false
    },
    diagnostic: {
      pbixName: '',
      workingCopyPath: '',
      existingPages: '',
      lastRefreshDate: '',
      identifiedSource: '',
      sourceType: 'sharepoint_folder',
      loadedTables: '',
      powerQueryQueries: '',
      keyColumns: '',
      modelRelationships: '',
      existingMeasures: '',
      refreshErrors: '',
      securityLimitations: '',
      pendingQuestionsNotes: ''
    },
    questionsAnswers: {
      'q1': { text: '', status: 'pendiente' },
      'q2': { text: '', status: 'pendiente' },
      'q3': { text: '', status: 'pendiente' },
      'q4': { text: '', status: 'pendiente' },
      'q5': { text: '', status: 'pendiente' },
      'q6': { text: '', status: 'pendiente' },
      'q7': { text: '', status: 'pendiente' },
      'q8': { text: '', status: 'pendiente' },
      'q9': { text: '', status: 'pendiente' },
      'q10': { text: '', status: 'pendiente' }
    },
    inventoryList: [
      {
        id: 'demo-1',
        table: 'd_Vehiculo (Ejemplo Demo)',
        source: 'Excel / SharePoint',
        sheet: 'Maestro_Vehiculos',
        column: 'Placa_Vehiculo',
        type: 'Texto',
        description: 'Placa del vehículo en mayúsculas (Ej. ABC123)',
        isId: 'Sí (Clave Primaria)',
        nulls: 'No',
        duplicates: 'No permitidos',
        currentUse: 'Segmentador de placas',
        plannedUse: 'Dimensión de camiones en estrella',
        status: 'Validado',
        notes: 'Registro demostrativo de ejemplo'
      }
    ],
    selectedSourceGuide: 'sharepoint_folder'
  };

  // Cargar estado de localStorage o inicializar
  let appState = loadState();

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Object.assign({}, defaultState, parsed);
      }
    } catch (e) {
      console.error('Error cargando estado desde localStorage', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
      updateGlobalProgress();
    } catch (e) {
      console.error('Error guardando estado en localStorage', e);
    }
  }

  // Notificación Toast
  function showToast(message) {
    const toast = document.getElementById('notificationToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Navegación entre Secciones
  function navigateTo(sectionId) {
    const sections = document.querySelectorAll('.view-section');
    sections.forEach(s => s.classList.remove('active'));

    const target = document.getElementById(sectionId);
    if (target) {
      target.classList.add('active');
      appState.currentSection = sectionId;
      appState.lastVisited = sectionId;
      saveState();

      // Actualizar enlaces activos en sidebar
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.section === sectionId);
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Si está en pantalla pequeña, cerrar sidebar y backdrop
      const sidebar = document.querySelector('.sidebar');
      const backdrop = document.getElementById('sidebarBackdrop');
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
      }
      if (backdrop) {
        backdrop.classList.remove('active');
      }
    }
  }

  // Cálculo de Progreso Real (No Simulado)
  function updateGlobalProgress() {
    // Tareas medibles:
    // 7 pasos jornada (pj_step_1 a 7)
    // 12 fases (completadas cuentan 1, en curso 0.5)
    // 10 pruebas (completada cuenta 1)
    // 9 checklist final
    // Total ponderado de actividades
    let totalPoints = 7 + 12 + 10 + 9;
    let earnedPoints = 0;

    // Pasos jornada
    for (let i = 1; i <= 7; i++) {
      if (appState.tasks['pj_step_' + i]) earnedPoints += 1;
    }

    // Fases
    for (let i = 1; i <= 12; i++) {
      const status = appState.tasks['phase_' + i];
      if (status === 'completada') earnedPoints += 1;
      else if (status === 'en-curso') earnedPoints += 0.5;
    }

    // Pruebas
    for (let i = 1; i <= 10; i++) {
      const pad = i < 10 ? '0' + i : i;
      const status = appState.tasks['test_' + pad];
      if (status === 'completada') earnedPoints += 1;
      else if (status === 'en-curso') earnedPoints += 0.5;
    }

    // Checklist
    const chkKeys = ['chk_sources', 'chk_columns', 'chk_dax', 'chk_page1', 'chk_page2', 'chk_page3', 'chk_slicers', 'chk_tests', 'chk_docs'];
    chkKeys.forEach(k => {
      if (appState.tasks[k]) earnedPoints += 1;
    });

    const percent = Math.min(100, Math.round((earnedPoints / totalPoints) * 100));

    // Actualizar elementos DOM
    const percentEls = document.querySelectorAll('.kpi-progress-percent');
    percentEls.forEach(el => el.textContent = percent + '%');

    const fillBars = document.querySelectorAll('.mini-progress-fill, .progress-bar-fill');
    fillBars.forEach(bar => bar.style.width = percent + '%');

    // Conteo de tareas completadas / pendientes / bloqueadas
    let completedCount = 0;
    let blockedCount = 0;
    let pendingCount = 0;

    Object.values(appState.tasks).forEach(v => {
      if (v === true || v === 'completada') completedCount++;
      else if (v === 'bloqueada') blockedCount++;
      else pendingCount++;
    });

    const compEl = document.getElementById('statCompletedTasks');
    if (compEl) compEl.textContent = completedCount;

    const blockEl = document.getElementById('statBlockedTasks');
    if (blockEl) blockEl.textContent = blockedCount;

    const pendEl = document.getElementById('statPendingTasks');
    if (pendEl) pendEl.textContent = pendingCount;
  }

  // Inicialización de Eventos y Formularios
  function initListeners() {
    // Navegación Sidebar
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const sec = link.dataset.section;
        if (sec) navigateTo(sec);
      });
    });

    // Botones de acción rápida
    const startDayBtn = document.getElementById('btnStartDay');
    if (startDayBtn) {
      startDayBtn.addEventListener('click', () => navigateTo('primera-jornada'));
    }

    const viewPhasesBtn = document.getElementById('btnViewPhases');
    if (viewPhasesBtn) {
      viewPhasesBtn.addEventListener('click', () => navigateTo('fases'));
    }

    const viewDiagBtn = document.getElementById('btnViewDiag');
    if (viewDiagBtn) {
      viewDiagBtn.addEventListener('click', () => navigateTo('diagnostico'));
    }

    const viewQuestionsBtn = document.getElementById('btnViewQuestions');
    if (viewQuestionsBtn) {
      viewQuestionsBtn.addEventListener('click', () => navigateTo('preguntas'));
    }

    // Botón Menú Móvil y Backdrop
    const menuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');

    function toggleMobileMenu(open) {
      if (!sidebar) return;
      const isOpen = open !== undefined ? open : !sidebar.classList.contains('mobile-open');
      sidebar.classList.toggle('mobile-open', isOpen);
      if (backdrop) {
        backdrop.classList.toggle('active', isOpen);
      }
    }

    if (menuBtn) {
      menuBtn.addEventListener('click', () => toggleMobileMenu());
    }

    if (backdrop) {
      backdrop.addEventListener('click', () => toggleMobileMenu(false));
    }

    // Buscador Global
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        handleGlobalSearch(query);
      });
    }

    // Casillas de Verificación (Checkboxes)
    document.querySelectorAll('input[type="checkbox"][data-task]').forEach(chk => {
      const taskId = chk.dataset.task;
      chk.checked = !!appState.tasks[taskId];
      chk.addEventListener('change', (e) => {
        appState.tasks[taskId] = e.target.checked;
        const parentCard = chk.closest('.step-card');
        if (parentCard) {
          parentCard.classList.toggle('completed', e.target.checked);
        }
        saveState();
        showToast('Progreso actualizado');
      });
      // Marcar visual inicial
      const parentCard = chk.closest('.step-card');
      if (parentCard && chk.checked) {
        parentCard.classList.add('completed');
      }
    });

    // Selectores de Estado de Fases
    document.querySelectorAll('select[data-phase]').forEach(sel => {
      const phaseId = sel.dataset.phase;
      if (appState.tasks[phaseId]) sel.value = appState.tasks[phaseId];
      sel.addEventListener('change', (e) => {
        appState.tasks[phaseId] = e.target.value;
        const badge = document.getElementById('badge_' + phaseId);
        if (badge) {
          badge.className = 'phase-status-badge status-' + e.target.value;
          badge.textContent = e.target.options[e.target.selectedIndex].text;
        }
        saveState();
        showToast('Fase actualizada');
      });
      // Inicializar badge
      const badge = document.getElementById('badge_' + phaseId);
      if (badge) {
        badge.className = 'phase-status-badge status-' + sel.value;
        badge.textContent = sel.options[sel.selectedIndex].text;
      }
    });

    // Selectores de Pruebas
    document.querySelectorAll('select[data-test]').forEach(sel => {
      const testId = sel.dataset.test;
      if (appState.tasks[testId]) sel.value = appState.tasks[testId];
      sel.addEventListener('change', (e) => {
        appState.tasks[testId] = e.target.value;
        saveState();
        showToast('Estado de prueba actualizado');
      });
    });

    // Formulario de Diagnóstico
    const diagForm = document.getElementById('diagnosticForm');
    if (diagForm) {
      // Cargar valores iniciales
      Object.keys(appState.diagnostic).forEach(key => {
        const input = diagForm.elements[key];
        if (input) input.value = appState.diagnostic[key] || '';
      });

      // Auto-guardar en input
      diagForm.addEventListener('input', (e) => {
        const name = e.target.name;
        if (name && appState.diagnostic.hasOwnProperty(name)) {
          appState.diagnostic[name] = e.target.value;
          saveState();
        }
      });
    }

    // Acordeones (Expandir/Contraer)
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        if (item) {
          item.classList.toggle('open');
        }
      });
    });

    // Selector de Fuentes de SharePoint
    document.querySelectorAll('.source-card-option').forEach(card => {
      card.addEventListener('click', () => {
        const sourceId = card.dataset.source;
        setSourceGuide(sourceId);
      });
    });

    // Preguntas para la Empresa
    document.querySelectorAll('textarea[data-question]').forEach(txt => {
      const qId = txt.dataset.question;
      if (appState.questionsAnswers[qId]) {
        txt.value = appState.questionsAnswers[qId].text || '';
      }
      txt.addEventListener('input', (e) => {
        if (!appState.questionsAnswers[qId]) appState.questionsAnswers[qId] = { text: '', status: 'pendiente' };
        appState.questionsAnswers[qId].text = e.target.value;
        saveState();
      });
    });

    document.querySelectorAll('select[data-qstatus]').forEach(sel => {
      const qId = sel.dataset.qstatus;
      if (appState.questionsAnswers[qId]) {
        sel.value = appState.questionsAnswers[qId].status || 'pendiente';
      }
      sel.addEventListener('change', (e) => {
        if (!appState.questionsAnswers[qId]) appState.questionsAnswers[qId] = { text: '', status: 'pendiente' };
        appState.questionsAnswers[qId].status = e.target.value;
        saveState();
        showToast('Pregunta actualizada');
      });
    });

    // Inventario de Columnas (Formulario y Tabla)
    const inventoryForm = document.getElementById('inventoryForm');
    if (inventoryForm) {
      inventoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newRecord = {
          id: 'inv-' + Date.now(),
          table: inventoryForm.elements['inv_table'].value.trim(),
          source: inventoryForm.elements['inv_source'].value.trim(),
          sheet: inventoryForm.elements['inv_sheet'].value.trim(),
          column: inventoryForm.elements['inv_column'].value.trim(),
          type: inventoryForm.elements['inv_type'].value,
          description: inventoryForm.elements['inv_desc'].value.trim(),
          isId: inventoryForm.elements['inv_is_id'].value,
          nulls: inventoryForm.elements['inv_nulls'].value,
          duplicates: inventoryForm.elements['inv_duplicates'].value,
          currentUse: inventoryForm.elements['inv_current_use'].value.trim(),
          plannedUse: inventoryForm.elements['inv_planned_use'].value.trim(),
          status: inventoryForm.elements['inv_status'].value,
          notes: inventoryForm.elements['inv_notes'].value.trim()
        };

        if (!newRecord.table || !newRecord.column) {
          alert('Por favor ingrese al menos el nombre de la tabla y de la columna.');
          return;
        }

        appState.inventoryList.push(newRecord);
        saveState();
        renderInventoryTable();
        inventoryForm.reset();
        showToast('Registro de inventario añadido con éxito');
      });
    }

    // Buscador de Inventario
    const invSearch = document.getElementById('invSearchInput');
    if (invSearch) {
      invSearch.addEventListener('input', () => renderInventoryTable());
    }

    // Buscador de Solución de Problemas
    const troubSearch = document.getElementById('troubleSearchInput');
    if (troubSearch) {
      troubSearch.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        document.querySelectorAll('.trouble-card').forEach(card => {
          const text = card.textContent.toLowerCase();
          card.style.display = text.includes(term) ? 'block' : 'none';
        });
      });
    }

    // Exportar Datos a JSON
    const exportBtn = document.getElementById('btnExportJson');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportUserData);
    }

    // Importar Datos JSON
    const importInput = document.getElementById('importJsonInput');
    if (importInput) {
      importInput.addEventListener('change', importUserData);
    }

    // Restablecer Progreso
    const resetBtn = document.getElementById('btnResetProgress');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetAllProgress);
    }

    // Imprimir
    const printBtn = document.getElementById('btnPrintGuide');
    if (printBtn) {
      printBtn.addEventListener('click', () => window.print());
    }
  }

  // Selección de Conexión SharePoint
  function setSourceGuide(sourceId) {
    appState.selectedSourceGuide = sourceId;
    saveState();

    document.querySelectorAll('.source-card-option').forEach(card => {
      card.classList.toggle('selected', card.dataset.source === sourceId);
    });

    document.querySelectorAll('.source-instruction-block').forEach(block => {
      block.style.display = block.id === 'guide_' + sourceId ? 'block' : 'none';
    });
  }

  // Renderizar Tabla de Inventario
  function renderInventoryTable() {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;

    const searchTerm = (document.getElementById('invSearchInput')?.value || '').toLowerCase().trim();

    const filtered = appState.inventoryList.filter(item => {
      return (
        item.table.toLowerCase().includes(searchTerm) ||
        item.column.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.status.toLowerCase().includes(searchTerm)
      );
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:2rem; color:var(--text-muted);">No se encontraron registros de inventario coincidentes.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(item => `
      <tr>
        <td><strong>${escapeHtml(item.table)}</strong><br><small style="color:var(--text-muted);">${escapeHtml(item.source)} / ${escapeHtml(item.sheet)}</small></td>
        <td><code>${escapeHtml(item.column)}</code></td>
        <td><span class="nav-badge">${escapeHtml(item.type)}</span></td>
        <td>${escapeHtml(item.description)}</td>
        <td><small>ID: <b>${escapeHtml(item.isId)}</b> | Nulos: <b>${escapeHtml(item.nulls)}</b></small></td>
        <td>${escapeHtml(item.plannedUse)}</td>
        <td><span class="phase-status-badge ${item.status === 'Validado' ? 'status-completada' : 'status-en-curso'}">${escapeHtml(item.status)}</span></td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="window.removeInventoryItem('${item.id}')">Eliminar</button>
        </td>
      </tr>
    `).join('');
  }

  window.removeInventoryItem = function (id) {
    if (confirm('¿Desea eliminar este registro del inventario?')) {
      appState.inventoryList = appState.inventoryList.filter(x => x.id !== id);
      saveState();
      renderInventoryTable();
      showToast('Registro eliminado');
    }
  };

  // Buscador Global
  function handleGlobalSearch(term) {
    const resultsContainer = document.getElementById('searchResultsDropdown');
    if (!resultsContainer) return;

    if (!term || term.length < 2) {
      resultsContainer.style.display = 'none';
      resultsContainer.innerHTML = '';
      return;
    }

    // Índice de búsqueda
    const searchIndex = [
      { title: 'Modo Primera Jornada (Paso a Paso)', section: 'primera-jornada', desc: 'Qué hacer al sentarse frente al computador, copias y accesos' },
      { title: 'Conexión a SharePoint Online', section: 'sharepoint', desc: 'Conectar Excel o Listas de SharePoint sin errores' },
      { title: 'Diagnóstico del Archivo PBIX', section: 'diagnostico', desc: 'Revisar fuentes, tablas, consultas y relaciones existentes' },
      { title: 'Inventario de Tablas y Columnas Verdes', section: 'inventario', desc: 'Catalogar nuevos campos y detectar duplicados' },
      { title: 'Plan de Ejecución en 12 Fases', section: 'fases', desc: 'Itinerario completo con dependencias y criterios de aceptación' },
      { title: 'Guía de Power Query y Transformación M', section: 'powerquery', desc: 'Anexar vs Combinar, tipos de datos, limpieza de placas' },
      { title: 'Modelado y Medidas DAX', section: 'modelado-dax', desc: 'Medidas de faltantes, sobrantes, vehículos vs novedades y Top 5' },
      { title: 'Diseño de Páginas 1, 2 y 3', section: 'paginas', desc: 'Actualizar visuales sin romper las gráficas existentes' },
      { title: 'Reparación de Filtros y Segmentadores', section: 'filtros', desc: 'Sincronizar segmentadores entre las 3 páginas del dashboard' },
      { title: 'Automatización del Flujo de Datos', section: 'automatizacion', desc: 'Reducir tareas de copiar y pegar en la base de novedades' },
      { title: 'Preguntas para la Empresa', section: 'preguntas', desc: 'Cuestionario para despejar dudas con el líder de Calidad y TI' },
      { title: 'Plan de Pruebas Unitarias', section: 'pruebas', desc: '10 pruebas manuales de validación de cálculos y filtros' },
      { title: 'Solución de Problemas Frecuentes', section: 'problemas', desc: 'Filtros rotos, errores de SharePoint, fechas como texto' },
      { title: 'Checklist Final de Entrega', section: 'checklist', desc: 'Lista de verificación integral antes de publicar' }
    ];

    const matches = searchIndex.filter(item => {
      return item.title.toLowerCase().includes(term) || item.desc.toLowerCase().includes(term);
    });

    if (matches.length > 0) {
      resultsContainer.innerHTML = matches.map(m => `
        <div class="search-result-item" onclick="window.navigateFromSearch('${m.section}')" style="padding:0.75rem 1rem; border-bottom:1px solid var(--border-subtle); cursor:pointer;">
          <strong style="color:var(--petroleum-primary); font-size:0.9rem;">${escapeHtml(m.title)}</strong>
          <div style="font-size:0.78rem; color:var(--text-muted);">${escapeHtml(m.desc)}</div>
        </div>
      `).join('');
      resultsContainer.style.display = 'block';
    } else {
      resultsContainer.innerHTML = `<div style="padding:1rem; font-size:0.85rem; color:var(--text-muted); text-align:center;">No se encontraron resultados para "${escapeHtml(term)}"</div>`;
      resultsContainer.style.display = 'block';
    }
  }

  window.navigateFromSearch = function (sectionId) {
    const resultsContainer = document.getElementById('searchResultsDropdown');
    if (resultsContainer) resultsContainer.style.display = 'none';
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) searchInput.value = '';
    navigateTo(sectionId);
  };

  // Exportar progreso a JSON
  function exportUserData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `PowerBI_Quality_Progress_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Archivo JSON de respaldo descargado');
  }

  // Importar progreso desde JSON
  function importUserData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const imported = JSON.parse(event.target.result);
        if (confirm('¿Desea restaurar su progreso y notas desde este archivo JSON? Se sobrescribirá el estado actual en el navegador.')) {
          appState = Object.assign({}, defaultState, imported);
          saveState();
          location.reload();
        }
      } catch (err) {
        alert('El archivo seleccionado no es un JSON válido de la guía.');
      }
    };
    reader.readAsText(file);
  }

  // Restablecer progreso
  function resetAllProgress() {
    if (confirm('¿Está seguro de que desea restablecer todo el progreso y las notas guardadas? Esta acción no se puede deshacer.')) {
      localStorage.removeItem(STORAGE_KEY);
      appState = JSON.parse(JSON.stringify(defaultState));
      saveState();
      location.reload();
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Arranque de la Aplicación
  window.addEventListener('DOMContentLoaded', () => {
    initListeners();
    renderInventoryTable();
    setSourceGuide(appState.selectedSourceGuide || 'sharepoint_folder');
    updateGlobalProgress();

    // Restaurar última sección o inicio
    const startSection = appState.currentSection || 'inicio';
    navigateTo(startSection);
  });

})();
