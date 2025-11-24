// ===== CARRUSEL (HOME) =====
const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-item');
const prevBtn = document.querySelector('.carousel-btn-prev');
const nextBtn = document.querySelector('.carousel-btn-next');

let currentSlide = 0;

function updateCarousel() {
    const offset = -currentSlide * 100;
    if (track) {
        track.style.transform = `translateX(${offset}%)`;
    }
}

if (track && slides.length > 0 && prevBtn && nextBtn) {
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
    });

    // Click en slide con data-link (ej. Proyectos)
    slides.forEach(slide => {
        slide.addEventListener('click', () => {
            const link = slide.getAttribute('data-link');
            if (link) {
                window.location.href = link;
            }
        });
    });
}

// ===== CAMPANA: IR A NOTIFICACIONES =====
const notifIconButtons = document.querySelectorAll('.icon-btn[aria-label="Notificaciones"]');
notifIconButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = 'notifications.html';
    });
});

// ===== CORAZONES (HOME + PROYECTOS) =====
const heartButtons = document.querySelectorAll('.heart-btn');

heartButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('heart-active');

        const projectEl = btn.closest('.project');
        if (projectEl) {
            updateProjectStatus(projectEl);
        }
    });
});

// ===== HOME: EDITAR Y ELIMINAR TAREAS =====
const taskList = document.querySelector('.task-list');

if (taskList) {
    taskList.addEventListener('click', (event) => {
        const editBtn = event.target.closest('.edit-task-btn');
        const deleteBtn = event.target.closest('.delete-task-btn');

        if (editBtn) {
            window.location.href = 'nueva-tarea.html';
            return;
        }

        if (deleteBtn) {
            const taskItem = deleteBtn.closest('.task-item');
            if (!taskItem) return;

            const isDeleted = taskItem.classList.toggle('task-item-deleted');
            deleteBtn.textContent = isDeleted ? '↩' : '🗑️';
        }
    });
}

// ===== NUEVA TAREA: FECHA =====
const dateInput = document.getElementById('dateInput');
const dateToggleBtn = document.getElementById('dateToggleBtn');

if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
}

if (dateToggleBtn && dateInput) {
    dateToggleBtn.addEventListener('click', () => {
        dateInput.classList.toggle('hidden');

        if (!dateInput.classList.contains('hidden')) {
            dateInput.focus();
        }
    });
}

// ===== NUEVA TAREA: PRIORIDAD 1–9 =====
const priorityLabel = document.getElementById('priorityLabel');
const priorityMinus = document.getElementById('priorityMinus');
const priorityPlus = document.getElementById('priorityPlus');

let priorityValue = 5;

function updatePriorityLabel() {
    if (!priorityLabel) return;

    let level;
    if (priorityValue <= 3) {
        level = 'Baja';
    } else if (priorityValue <= 6) {
        level = 'Normal';
    } else {
        level = 'Alta';
    }

    priorityLabel.textContent = `${level} (${priorityValue})`;
}

if (priorityLabel) {
    updatePriorityLabel();
}

if (priorityMinus) {
    priorityMinus.addEventListener('click', () => {
        if (priorityValue > 1) {
            priorityValue--;
            updatePriorityLabel();
        }
    });
}

if (priorityPlus) {
    priorityPlus.addEventListener('click', () => {
        if (priorityValue < 9) {
            priorityValue++;
            updatePriorityLabel();
        }
    });
}

// ===== NUEVA TAREA: botón "Añadir" con from=projects =====
const addTaskBtn = document.getElementById('addTaskBtn');

if (addTaskBtn) {
    addTaskBtn.addEventListener('click', () => {
        const params = new URLSearchParams(window.location.search);
        const from = params.get('from');

        if (from === 'projects') {
            window.location.href = 'tarea-creada.html?from=projects';
        } else {
            window.location.href = 'tarea-creada.html';
        }
    });
}

// ===== TAREA CREADA: botón "Regresar" con contexto =====
const successBackBtn = document.getElementById('successBackBtn');

if (successBackBtn) {
    const params = new URLSearchParams(window.location.search);
    const from = params.get('from');

    successBackBtn.addEventListener('click', () => {
        if (from === 'projects') {
            window.location.href = 'projects.html';
        } else {
            window.location.href = 'home.html';
        }
    });
}

// ======================================================
//      LÓGICA DE PROYECTOS
// ======================================================
const allProjects = document.querySelectorAll('.project');

function updateProjectStatus(projectEl) {
    const badge = projectEl.querySelector('.project-status-badge');
    if (!badge) return;

    if (projectEl.classList.contains('project-deleted')) {
        badge.classList.remove(
            'status-inactive',
            'status-in-progress',
            'status-completed',
            'status-no-tasks',
            'status-deleted'
        );
        badge.classList.add('status-deleted');
        badge.textContent = 'Eliminado';
        return;
    }

    if (projectEl.dataset.forcedCompleted === 'true') {
        badge.classList.remove(
            'status-inactive',
            'status-in-progress',
            'status-no-tasks',
            'status-deleted'
        );
        badge.classList.add('status-completed');
        badge.textContent = 'Completado';
        return;
    }

    const tasks = Array.from(
        projectEl.querySelectorAll('.project-task-item')
    );

    const activeTasks = tasks.filter(
        t => !t.classList.contains('task-item-deleted')
    );

    badge.classList.remove(
        'status-inactive',
        'status-in-progress',
        'status-completed',
        'status-no-tasks',
        'status-deleted'
    );

    if (activeTasks.length === 0) {
        badge.textContent = 'Sin tareas';
        badge.classList.add('status-no-tasks');
        return;
    }

    const hearts = activeTasks.map(t => t.querySelector('.heart-btn'));
    const activeHearts = hearts.filter(h => h && h.classList.contains('heart-active')).length;

    if (activeHearts === 0) {
        badge.textContent = 'Inactivo';
        badge.classList.add('status-inactive');
    } else if (activeHearts < activeTasks.length) {
        badge.textContent = 'En progreso';
        badge.classList.add('status-in-progress');
    } else {
        badge.textContent = 'Completado';
        badge.classList.add('status-completed');
    }
}

if (allProjects.length > 0) {
    allProjects.forEach(updateProjectStatus);

    allProjects.forEach(project => {
        const toggleBtn = project.querySelector('.project-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                project.classList.toggle('project-collapsed');
                toggleBtn.textContent = project.classList.contains('project-collapsed') ? '▲' : '▼';
            });
        }

        const deleteProjectBtn = project.querySelector('.project-delete-btn');
        if (deleteProjectBtn) {
            deleteProjectBtn.addEventListener('click', () => {
                const isDeleted = project.classList.toggle('project-deleted');
                deleteProjectBtn.textContent = isDeleted ? '↩' : '🗑️';
                updateProjectStatus(project);
            });
        }

        const projectTaskList = project.querySelector('.project-task-list');
        if (projectTaskList) {
            projectTaskList.addEventListener('click', (event) => {
                const editBtn = event.target.closest('.edit-task-btn');
                const deleteBtn = event.target.closest('.delete-task-btn');

                if (editBtn) {
                    window.location.href = 'nueva-tarea.html?from=projects';
                    return;
                }

                if (deleteBtn) {
                    const taskItem = deleteBtn.closest('.project-task-item');
                    if (!taskItem) return;

                    const isDeleted = taskItem.classList.toggle('task-item-deleted');
                    deleteBtn.textContent = isDeleted ? '↩' : '🗑️';

                    updateProjectStatus(project);
                }
            });
        }

        const finishBtn = project.querySelector('.project-finish-btn');
        if (finishBtn) {
            finishBtn.addEventListener('click', () => {
                const badge = project.querySelector('.project-status-badge');
                if (!badge) return;

                const forced = project.dataset.forcedCompleted === 'true';

                if (!forced) {
                    project.dataset.forcedCompleted = 'true';
                    badge.classList.remove(
                        'status-inactive',
                        'status-in-progress',
                        'status-no-tasks',
                        'status-deleted'
                    );
                    badge.classList.add('status-completed');
                    badge.textContent = 'Completado';
                } else {
                    project.dataset.forcedCompleted = 'false';
                    updateProjectStatus(project);
                }
            });
        }

        const createTaskBtn = project.querySelector('.project-create-task-btn');
        if (createTaskBtn) {
            createTaskBtn.addEventListener('click', () => {
                window.location.href = 'nueva-tarea.html?from=projects';
            });
        }
    });
}

// ======================================================
//      NOTIFICACIONES
// ======================================================
const notifGroups = document.querySelectorAll('.notif-group');
let notificationsCleared = false;

function updateNotifGroupEmptyState(groupEl) {
    const visibleItems = groupEl.querySelectorAll('.notif-item:not(.notif-item-deleted)');
    if (visibleItems.length === 0) {
        groupEl.classList.add('notif-group-empty');
    } else {
        groupEl.classList.remove('notif-group-empty');
    }
}

if (notifGroups.length > 0) {
    // Toggle de cada grupo
    notifGroups.forEach(groupEl => {
        const toggleBtn = groupEl.querySelector('.notif-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                groupEl.classList.toggle('notif-group-collapsed');
                toggleBtn.textContent = groupEl.classList.contains('notif-group-collapsed') ? '▲' : '▼';
            });
        }

        const notifList = groupEl.querySelector('.notif-list');
        if (notifList) {
            notifList.addEventListener('click', (event) => {
                const itemEl = event.target.closest('.notif-item');
                if (!itemEl) return;

                const repeatBtn = event.target.closest('.notif-repeat-btn');
                const deleteBtn = event.target.closest('.notif-delete-btn');

                // Repetir / restablecer
                if (repeatBtn) {
                    const timeEl = itemEl.querySelector('.notif-time');
                    if (!timeEl) return;

                    if (!timeEl.dataset.originalTime) {
                        timeEl.dataset.originalTime = timeEl.textContent;
                    }

                    const isSnoozed = itemEl.classList.toggle('notif-snoozed');

                    if (isSnoozed) {
                        timeEl.textContent = 'En 1 hora';
                        repeatBtn.textContent = 'Restablecer';
                    } else {
                        timeEl.textContent = timeEl.dataset.originalTime;
                        repeatBtn.textContent = 'Repetir';
                    }
                    return;
                }

                // Borrar / deshacer
                if (deleteBtn) {
                    const isDeleted = itemEl.classList.toggle('notif-item-deleted');
                    deleteBtn.textContent = isDeleted ? '↩' : '🗑️';
                    updateNotifGroupEmptyState(groupEl);
                }
            });
        }

        // Estado inicial por si algún grupo empieza vacío
        updateNotifGroupEmptyState(groupEl);
    });

    // Botón borrar todas
    const clearAllBtn = document.getElementById('clearAllNotifsBtn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            notificationsCleared = !notificationsCleared;

            if (notificationsCleared) {
                // Marcar todos los items como borrados
                notifGroups.forEach(groupEl => {
                    groupEl.querySelectorAll('.notif-item').forEach(itemEl => {
                        itemEl.classList.add('notif-item-deleted');
                        const deleteBtn = itemEl.querySelector('.notif-delete-btn');
                        if (deleteBtn) deleteBtn.textContent = '↩';
                    });
                    groupEl.classList.add('notif-group-empty');
                });
                clearAllBtn.textContent = 'Deshacer borrado';
            } else {
                // Restaurar todos
                notifGroups.forEach(groupEl => {
                    groupEl.querySelectorAll('.notif-item').forEach(itemEl => {
                        itemEl.classList.remove('notif-item-deleted');
                        const deleteBtn = itemEl.querySelector('.notif-delete-btn');
                        if (deleteBtn) deleteBtn.textContent = '🗑️';
                    });
                    groupEl.classList.remove('notif-group-empty');
                });
                clearAllBtn.textContent = 'Borrar todas las notificaciones';
            }
        });
    }
}


// ===== CREAR PROYECTO: PRIORIDAD 1–5 =====
const projectPriorityLabel = document.getElementById('projectPriorityLabel');
const projectPriorityMinus = document.getElementById('projectPriorityMinus');
const projectPriorityPlus = document.getElementById('projectPriorityPlus');

let projectPriorityValue = 1; // inicia en 1

function updateProjectPriorityLabel() {
    if (!projectPriorityLabel) return;
    projectPriorityLabel.textContent = projectPriorityValue.toString();
}

if (projectPriorityLabel) {
    updateProjectPriorityLabel();
}

if (projectPriorityMinus) {
    projectPriorityMinus.addEventListener('click', () => {
        if (projectPriorityValue > 1) {
            projectPriorityValue--;
            updateProjectPriorityLabel();
        }
    });
}

if (projectPriorityPlus) {
    projectPriorityPlus.addEventListener('click', () => {
        if (projectPriorityValue < 5) {
            projectPriorityValue++;
            updateProjectPriorityLabel();
        }
    });
}



// ===== CREAR PROYECTO: TAREAS DINÁMICAS =====
const projectTasksContainer = document.getElementById('projectTasksContainer');
const addProjectTaskBtn = document.getElementById('addProjectTaskBtn');

if (projectTasksContainer && addProjectTaskBtn) {
    function addProjectTaskLine() {
        const line = document.createElement('div');
        line.classList.add('project-task-line');

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Nueva tarea';

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.classList.add('project-task-delete-btn');
        deleteBtn.textContent = '🗑️';

        deleteBtn.addEventListener('click', () => {
            line.remove();
        });

        line.appendChild(input);
        line.appendChild(deleteBtn);
        projectTasksContainer.appendChild(line);
    }

    // Al inicio, dejamos el listado vacío. Si quieres, puedes añadir una línea inicial:
    // addProjectTaskLine();

    addProjectTaskBtn.addEventListener('click', () => {
        addProjectTaskLine();
    });
}
