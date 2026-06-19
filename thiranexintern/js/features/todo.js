/** To-Do feature — mountable CRUD module for SPA routes */
export function initTodoApp() {
  var STORAGE_KEY = "thiranex-todo-state";
  var state = { tasks: [], filter: "all", editingId: null };
  var elements = {};

  elements.form = document.getElementById("todo-form");
  elements.input = document.getElementById("todo-input");
  elements.list = document.getElementById("todo-list");
  elements.empty = document.getElementById("todo-empty");
  elements.filters = document.getElementById("todo-filters");
  elements.stats = document.getElementById("todo-stats");
  elements.clearCompleted = document.getElementById("todo-clear-completed");
  elements.liveRegion = document.getElementById("todo-live-region");

  if (!elements.form) return function () {};

  function loadState() {
    try {
      var saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      var parsed = JSON.parse(saved);
      if (Array.isArray(parsed.tasks)) state.tasks = parsed.tasks;
      if (["all", "active", "completed"].indexOf(parsed.filter) !== -1) state.filter = parsed.filter;
    } catch (e) {
      state.tasks = [];
      state.filter = "all";
    }
  }

  function saveState() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks: state.tasks, filter: state.filter }));
  }

  function generateId() {
    return "task-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9);
  }

  function announce(msg) {
    if (elements.liveRegion) elements.liveRegion.textContent = msg;
  }

  function findTaskIndex(id) {
    for (var i = 0; i < state.tasks.length; i++) if (state.tasks[i].id === id) return i;
    return -1;
  }

  function getFilteredTasks() {
    if (state.filter === "active") return state.tasks.filter(function (t) { return !t.completed; });
    if (state.filter === "completed") return state.tasks.filter(function (t) { return t.completed; });
    return state.tasks;
  }

  function createTask(text) {
    var trimmed = text.trim();
    if (!trimmed) return false;
    state.tasks.unshift({ id: generateId(), text: trimmed, completed: false, createdAt: Date.now() });
    saveState();
    announce("Task added: " + trimmed);
    return true;
  }

  function updateTask(id, updates) {
    var index = findTaskIndex(id);
    if (index === -1) return false;
    if (typeof updates.text === "string") {
      var t = updates.text.trim();
      if (!t) return false;
      state.tasks[index].text = t;
    }
    if (typeof updates.completed === "boolean") state.tasks[index].completed = updates.completed;
    saveState();
    return true;
  }

  function deleteTask(id) {
    var index = findTaskIndex(id);
    if (index === -1) return false;
    announce("Task deleted: " + state.tasks[index].text);
    state.tasks.splice(index, 1);
    if (state.editingId === id) state.editingId = null;
    saveState();
    return true;
  }

  function render() {
    elements.filters.querySelectorAll("[data-filter]").forEach(function (btn) {
      var active = btn.getAttribute("data-filter") === state.filter;
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      btn.classList.toggle("todo-filter--active", active);
    });

    var filtered = getFilteredTasks();
    elements.list.innerHTML = "";
    if (filtered.length === 0) {
      elements.empty.hidden = false;
      elements.list.setAttribute("aria-hidden", "true");
    } else {
      elements.empty.hidden = true;
      elements.list.removeAttribute("aria-hidden");
      filtered.forEach(function (task) { elements.list.appendChild(createTaskElement(task)); });
    }

    var active = state.tasks.filter(function (t) { return !t.completed; }).length;
    var completed = state.tasks.length - active;
    elements.stats.textContent = active + " active, " + completed + " completed, " + state.tasks.length + " total";
    elements.clearCompleted.disabled = completed === 0;
    elements.clearCompleted.hidden = completed === 0;
  }

  function createTaskElement(task) {
    var li = document.createElement("li");
    li.className = "todo-item" + (task.completed ? " todo-item--completed" : "");
    li.setAttribute("data-id", task.id);
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-item__checkbox";
    checkbox.id = "todo-check-" + task.id;
    checkbox.checked = task.completed;
    li.appendChild(checkbox);
    if (state.editingId === task.id) {
      var editInput = document.createElement("input");
      editInput.type = "text";
      editInput.className = "todo-item__edit-input form__input";
      editInput.value = task.text;
      editInput.setAttribute("data-action", "edit-input");
      li.appendChild(editInput);
    } else {
      var span = document.createElement("span");
      span.className = "todo-item__text";
      span.textContent = task.text;
      li.appendChild(span);
    }
    var actions = document.createElement("div");
    actions.className = "todo-item__actions";
    if (state.editingId === task.id) {
      actions.innerHTML = '<button type="button" class="todo-item__btn" data-action="save">Save</button><button type="button" class="todo-item__btn" data-action="cancel-edit">Cancel</button>';
    } else {
      actions.innerHTML = '<button type="button" class="todo-item__btn todo-item__btn--edit" data-action="edit">Edit</button><button type="button" class="todo-item__btn todo-item__btn--delete" data-action="delete">Delete</button>';
    }
    li.appendChild(actions);
    return li;
  }

  function onSubmit(e) {
    e.preventDefault();
    if (createTask(elements.input.value)) { elements.input.value = ""; render(); elements.input.focus(); }
  }
  function onFilterClick(e) {
    var btn = e.target.closest("[data-filter]");
    if (!btn) return;
    state.filter = btn.getAttribute("data-filter");
    state.editingId = null;
    saveState();
    render();
  }
  function onListChange(e) {
    if (e.target.type !== "checkbox") return;
    var item = e.target.closest(".todo-item");
    if (!item) return;
    updateTask(item.getAttribute("data-id"), { completed: e.target.checked });
    render();
  }
  function onListClick(e) {
    var actionEl = e.target.closest("[data-action]");
    if (!actionEl) return;
    var item = actionEl.closest(".todo-item");
    if (!item) return;
    var id = item.getAttribute("data-id");
    var action = actionEl.getAttribute("data-action");
    if (action === "delete") { deleteTask(id); render(); return; }
    if (action === "edit") { state.editingId = id; render(); return; }
    if (action === "cancel-edit") { state.editingId = null; render(); return; }
    if (action === "save") {
      var input = item.querySelector("[data-action='edit-input']");
      if (input && updateTask(id, { text: input.value })) { state.editingId = null; render(); }
    }
  }
  function onClear() {
    state.tasks = state.tasks.filter(function (t) { return !t.completed; });
    saveState();
    render();
  }

  elements.form.addEventListener("submit", onSubmit);
  elements.filters.addEventListener("click", onFilterClick);
  elements.list.addEventListener("click", onListClick);
  elements.list.addEventListener("change", onListChange);
  elements.clearCompleted.addEventListener("click", onClear);
  loadState();
  render();

  return function cleanup() {
    elements.form.removeEventListener("submit", onSubmit);
    elements.filters.removeEventListener("click", onFilterClick);
    elements.list.removeEventListener("click", onListClick);
    elements.list.removeEventListener("change", onListChange);
    elements.clearCompleted.removeEventListener("click", onClear);
  };
}
