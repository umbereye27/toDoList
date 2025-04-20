let todoArray = [];

// Function to fetch todos (only if we don't have any stored)
async function fetchTodos() {
    try {
        // First check if we have todos in localStorage
        const storedTodos = localStorage.getItem('todos');
        
        if (storedTodos) {
            // If we have stored todos, use them
            todoArray = JSON.parse(storedTodos);
            // Convert string dates back to Date objects
            todoArray.forEach(todo => {
                todo.dueDate = new Date(todo.dueDate);
            });
        } else {
            // If no stored todos, fetch from API
            const response = await fetch('https://jsonplaceholder.typicode.com/todos');
            const todos = await response.json();
            
            const limitedTodos = todos.slice(0, 4);
            todoArray = limitedTodos.map(todo => ({
                id: todo.id,
                title: todo.title,
                completed: todo.completed,
                dueDate: new Date()
            }));
            
            // Save to localStorage
            saveTodos();
        }
        
        // Display todos
        displayTodos(todoArray);
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

// Function to save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todoArray));
}

// Function to format date
function formatDate(date) {
    return date.toLocaleDateString({
        month: 'short',
        day: 'numeric'
    });
}

// Function to display todos on the page
function displayTodos(todos) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        todoItem.innerHTML = `
            <span class="todo-text">${todo.title}</span>
            <span class="todo-date">${todo.dueDate.toLocaleString()}</span>
            
            <div class="todo-actions">
                <div class="todo-checkbox">
                    <input type="checkbox" id="todo-${todo.id}" ${todo.completed ? 'checked' : ''}
                        onchange="toggleComplete(${todo.id})">
                    <label for="todo-${todo.id}"></label>
                </div>
                <button class="edit-btn" onclick="editTodo(${todo.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        todoList.appendChild(todoItem);
    });
}

// Function to add a new todo
function addTodo() {
    const newTodoInput = document.getElementById('new-todo');
    const todoText = newTodoInput.value.trim();
    
    if (todoText) {
        const newTodo = {
            id: Date.now(),
            title: todoText,
            completed: false,
            dueDate: new Date()
        };
        
        todoArray.unshift(newTodo);
        saveTodos();
        
        displayTodos(todoArray);
        newTodoInput.value = '';
        
        const successMessage = document.getElementById('success-message');
        successMessage.textContent = "Todo item Created Successfully.";
        setTimeout(() => {
            successMessage.textContent = "";
        }, 3000);
    }
}

// Function to toggle todo completion status
function toggleComplete(id) {
    const todo = todoArray.find(t => t.id === id);
    if (todo) {
        
        todo.completed = !todo.completed;
        saveTodos();
        displayTodos(todoArray);
    }
}


// Function to edit a todo
function editTodo(id) {
    const todo = todoArray.find(t => t.id === id);
    const newTitle = prompt("Edit Todo Title:", todo.title);
    
    if (newTitle) {
        todo.title = newTitle;
        saveTodos();
        displayTodos(todoArray);
    }
}


// Function to delete a todo
function deleteTodo(id) {
    todoArray = todoArray.filter(t => t.id !== id);
    saveTodos();
    displayTodos(todoArray);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-todo').addEventListener('click', addTodo);
    fetchTodos();
  });
  