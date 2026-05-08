const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const count = document.querySelector('#todo-count');
const emptyState = document.querySelector('#empty-state');
const clearCompletedButton = document.querySelector('#clear-completed');

let todos = loadTodos();

function loadTodos() {
  const savedTodos = localStorage.getItem('todos');
  return savedTodos ? JSON.parse(savedTodos) : [];
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function createTodo(text) {
  return {
    id: crypto.randomUUID(),
    text,
    completed: false,
  };
}

function addTodo(text) {
  todos.push(createTodo(text));
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) => (
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  ));
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function clearCompletedTodos() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
}

function renderTodos() {
  list.innerHTML = '';

  todos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = `todo-item${todo.completed ? ' completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `Mark ${todo.text} as ${todo.completed ? 'incomplete' : 'complete'}`);
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete ${todo.text}`);
    deleteButton.addEventListener('click', () => deleteTodo(todo.id));

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  const remainingCount = todos.filter((todo) => !todo.completed).length;
  count.textContent = `${remainingCount} ${remainingCount === 1 ? 'task' : 'tasks'} remaining`;
  emptyState.hidden = todos.length > 0;
  clearCompletedButton.disabled = !todos.some((todo) => todo.completed);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) {
    return;
  }

  addTodo(text);
  input.value = '';
  input.focus();
});

clearCompletedButton.addEventListener('click', clearCompletedTodos);

renderTodos();
