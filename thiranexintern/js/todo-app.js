/**
 * To-Do List — state-driven CRUD with localStorage persistence
 * Uses delegated event listeners on the task list container.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "thiranex-todo-state";

  var state = {
    tasks: [],
    filter: "all",
    editingId: null,
  };

  var elements = {};

  function init() {
    elements.app = document.getElementById("todo-app");
    if (!elements.app) return;

    elements.form = document.getElementById("todo-form");
    elements.input = document.getElementById("todo-input");
    elements.list = document.getElementById("todo-list");
    elements.empty = document.getElementById("todo-empty");
    elements.filters = document.getElementById("todo-filters");
    elements.stats = document.getElementById("todo-stats");
    elements.clearCompleted = document.getElementById("todo-clear-completed");
    elements.liveRegion = document.getElementById("todo-live-region");

    loadState();
    bindEvents();
    render();
  }

  function loadState() {
    try {
      var saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      var parsed = JSON.parse(saved);
      if (Array.isArray(parsed.tasks)) {
        state.tasks = parsed.tasks;
      }
      if (parsed.filter === "all" || parsed.filter === "active" || parsed.filter === "completed") {
        state.filter = parsed.filter;
      }
    } catch (error) {
      state.tasks = [];
      state.filter = "all";
    }
  }

  function saveState() {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        tasks: state.tasks,
        filter: state.filter,
      })
    );
  }

  function generateId() {
    return "task-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9);
  }

  function announce(message) {
    if (elements.liveRegion) {
      elements.liveRegion.textContent = message;
    }
  }

  /* --- CRUD --- */

  function createTask(text) {
    var trimmed = text.trim();
    if (!trimmed) return false;

    state.tasks.unshift({
      id: generateId(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    });

    saveState();
    announce("Task added: " + trimmed);
    return true;
  }

  function readTasks() {
    return state.tasks.slice();
  }

  function updateTask(id, updates) {
    var index = findTaskIndex(id);
    if (index === -1) return false;

    if (typeof updates.text === "string") {
      var trimmed = updates.text.trim();
      if (!trimmed) return false;
      state.tasks[index].text = trimmed;
    }

    if (typeof updates.completed === "boolean") {
      state.tasks[index].completed = updates.completed;
    }

    saveState();
    return true;
  }

  function deleteTask(id) {
    var index = findTaskIndex(id);
    if (index === -1) return false;

    var removed = state.tasks[index].text;
    state.tasks.splice(index, 1);

    if (state.editingId === id) {
      state.editingId = null;
    }

    saveState();
    announce("Task deleted: " + removed);
    return true;
  }

  function findTaskIndex(id) {
    for (var i = 0; i < state.tasks.length; i++) {
      if (state.tasks[i].id === id) return i;
    }
    return -1;
  }

  function getFilteredTasks() {
    if (state.filter === "active") {
      return state.tasks.filter(function (task) {
        return !task.completed;
      });
    }
    if (state.filter === "completed") {
      return state.tasks.filter(function (task) {
        return task.completed;
      });
    }
    return state.tasks;
  }

  function setFilter(filter) {
    state.filter = filter;
    state.editingId = null;
    saveState();
    render();
    announce("Showing " + filter + " tasks");
  }

  function clearCompletedTasks() {
    var count = state.tasks.filter(function (t) {
      return t.completed;
    }).length;

    if (count === 0) return;

    state.tasks = state.tasks.filter(function (task) {
      return !task.completed;
    });

    saveState();
    render();
    announce(count + " completed task" + (count === 1 ? "" : "s") + " cleared");
  }

  /* --- Rendering --- */

  function render() {
    renderFilters();
    renderList();
    renderStats();
  }

  function renderFilters() {
    if (!elements.filters) return;

    var buttons = elements.filters.querySelectorAll("[data-filter]");
    buttons.forEach(function (button) {
      var isActive = button.getAttribute("data-filter") === state.filter;
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
      button.classList.toggle("todo-filter--active", isActive);
    });
  }

  function renderList() {
    if (!elements.list) return;

    var filtered = getFilteredTasks();

    elements.list.innerHTML = "";

    if (filtered.length === 0) {
      elements.empty.hidden = false;
      elements.list.setAttribute("aria-hidden", "true");
      return;
    }

    elements.empty.hidden = true;
    elements.list.removeAttribute("aria-hidden");

    filtered.forEach(function (task) {
      elements.list.appendChild(createTaskElement(task));
    });
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
    checkbox.setAttribute("aria-label", "Mark \"" + task.text + "\" as " + (task.completed ? "incomplete" : "complete"));

    var label = document.createElement("label");
    label.className = "todo-item__label";
    label.setAttribute("for", "todo-check-" + task.id);
    label.textContent = "Toggle completion for " + task.text;

    if (state.editingId === task.id) {
      var editInput = document.createElement("input");
      editInput.type = "text";
      editInput.className = "todo-item__edit-input form__input";
      editInput.value = task.text;
      editInput.setAttribute("aria-label", "Edit task");
      editInput.setAttribute("data-action", "edit-input");
      editInput.maxLength = 200;
      li.appendChild(checkbox);
      li.appendChild(label);
      li.appendChild(editInput);
    } else {
      var textSpan = document.createElement("span");
      textSpan.className = "todo-item__text";
      textSpan.textContent = task.text;

      li.appendChild(checkbox);
      li.appendChild(label);
      li.appendChild(textSpan);
    }

    var actions = document.createElement("div");
    actions.className = "todo-item__actions";

    if (state.editingId === task.id) {
      var saveBtn = document.createElement("button");
      saveBtn.type = "button";
      saveBtn.className = "todo-item__btn todo-item__btn--save";
      saveBtn.setAttribute("data-action", "save");
      saveBtn.textContent = "Save";

      var cancelBtn = document.createElement("button");
      cancelBtn.type = "button";
      cancelBtn.className = "todo-item__btn todo-item__btn--cancel";
      cancelBtn.setAttribute("data-action", "cancel-edit");
      cancelBtn.textContent = "Cancel";

      actions.appendChild(saveBtn);
      actions.appendChild(cancelBtn);
    } else {
      var editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "todo-item__btn todo-item__btn--edit";
      editBtn.setAttribute("data-action", "edit");
      editBtn.setAttribute("aria-label", "Edit task: " + task.text);
      editBtn.textContent = "Edit";

      var deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "todo-item__btn todo-item__btn--delete";
      deleteBtn.setAttribute("data-action", "delete");
      deleteBtn.setAttribute("aria-label", "Delete task: " + task.text);
      deleteBtn.textContent = "Delete";

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
    }

    li.appendChild(actions);
    return li;
  }

  function renderStats() {
    if (!elements.stats || !elements.clearCompleted) return;

    var total = state.tasks.length;
    var active = state.tasks.filter(function (t) {
      return !t.completed;
    }).length;
    var completed = total - active;

    elements.stats.textContent =
      active + " active, " + completed + " completed, " + total + " total";

    elements.clearCompleted.disabled = completed === 0;
    elements.clearCompleted.hidden = completed === 0;
  }

  /* --- Event Handling (delegated) --- */

  function bindEvents() {
    elements.form.addEventListener("submit", handleFormSubmit);
    elements.filters.addEventListener("click", handleFilterClick);
    elements.list.addEventListener("click", handleListClick);
    elements.list.addEventListener("change", handleListChange);
    elements.list.addEventListener("keydown", handleListKeydown);
    elements.clearCompleted.addEventListener("click", clearCompletedTasks);
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    var text = elements.input.value;

    if (createTask(text)) {
      elements.input.value = "";
      render();
      elements.input.focus();
    }
  }

  function handleFilterClick(event) {
    var button = event.target.closest("[data-filter]");
    if (!button || !elements.filters.contains(button)) return;

    setFilter(button.getAttribute("data-filter"));
  }

  function handleListChange(event) {
    if (event.target.type !== "checkbox") return;

    var item = event.target.closest(".todo-item");
    if (!item) return;

    var id = item.getAttribute("data-id");
    var task = state.tasks.find(function (t) {
      return t.id === id;
    });

    updateTask(id, { completed: event.target.checked });
    render();
    announce(
      (event.target.checked ? "Completed" : "Reopened") + ": " + (task ? task.text : "task")
    );
  }

  function handleListClick(event) {
    var actionEl = event.target.closest("[data-action]");
    if (!actionEl) return;

    var item = actionEl.closest(".todo-item");
    if (!item) return;

    var id = item.getAttribute("data-id");
    var action = actionEl.getAttribute("data-action");

    if (action === "delete") {
      deleteTask(id);
      render();
      return;
    }

    if (action === "edit") {
      state.editingId = id;
      render();
      var input = elements.list.querySelector('[data-id="' + id + '"] [data-action="edit-input"]');
      if (input) {
        input.focus();
        input.select();
      }
      return;
    }

    if (action === "save") {
      saveEdit(id, item);
      return;
    }

    if (action === "cancel-edit") {
      state.editingId = null;
      render();
      announce("Edit cancelled");
    }
  }

  function handleListKeydown(event) {
    if (event.target.getAttribute("data-action") !== "edit-input") return;

    if (event.key === "Enter") {
      event.preventDefault();
      var item = event.target.closest(".todo-item");
      if (item) saveEdit(item.getAttribute("data-id"), item);
    }

    if (event.key === "Escape") {
      state.editingId = null;
      render();
      announce("Edit cancelled");
    }
  }

  function saveEdit(id, item) {
    var input = item.querySelector('[data-action="edit-input"]');
    if (!input) return;

    var task = state.tasks.find(function (t) {
      return t.id === id;
    });

    if (updateTask(id, { text: input.value })) {
      state.editingId = null;
      render();
      announce("Task updated: " + input.value.trim());
    } else if (task) {
      announce("Task text cannot be empty");
      input.focus();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
