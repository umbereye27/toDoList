
let todoArray = [];
let sortDirection = 'asc';
let filterType = 'all';

async function fetchTodos() {
    try {
        const storedTodos = localStorage.getItem('todos');
            const response = await fetch('https://jsonplaceholder.typicode.com/todos');
            const todos = await response.json();
            
            const limitedTodos = todos.slice(0, 4);
            console.log( limitedTodos)
            todoArray = limitedTodos.map(todo => ({
                id: todo.id,
                title: todo.title,
                completed: todo.completed,
                dueDate: new Date()
            }));
            
            saveTodos();
        displayTodos();
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todoArray));
}
function formatDate(date) {
    return date.toLocaleDateString();
}
function displayTodos() {
    sortTodos();
    const filteredTodos = filterTodos();
    
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    
    filteredTodos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        todoItem.innerHTML = `
            <span class="todo-text">${todo.title}</span>
            <span class="todo-date">${formatDate(todo.dueDate)}</span>
            
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

// Function to show the task modal for adding a new task
function showAddTaskModal() {
    const modal = document.getElementById('task-modal');
    const modalTitle = document.getElementById('modal-title');
    const taskInput = document.getElementById('task-input');
    const dateInput = document.getElementById('date-input');
    const saveBtn = document.getElementById('save-task-btn');
    
    modalTitle.textContent = 'Add New Task';
    taskInput.value = '';
    
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10);
    dateInput.value = formattedDate;
    
    saveBtn.onclick = saveNewTask;
    
    modal.style.display = 'block';
}

// Function to save a new task from the modal
function saveNewTask() {
    const taskInput = document.getElementById('task-input');
    const dateInput = document.getElementById('date-input');
    const todoText = taskInput.value.trim();
    const dueDate = new Date(dateInput.value);
    
    if (todoText) {
        const newTodo = {
            id: Date.now(),
            title: todoText,
            completed: false,
            dueDate: dueDate
        };
        
        todoArray.unshift(newTodo);
        saveTodos();
        displayTodos();

        document.getElementById('task-modal').style.display = 'none';
        
        const successMessage = document.getElementById('success-message');
        successMessage.textContent = "Todo item Created Successfully.";
        setTimeout(() => {
            successMessage.textContent = "";
        }, 3000);
    }
}
function toggleComplete(id) {
    const todo = todoArray.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        displayTodos();
    }
}

// Function to show the edit modal for a todo
function editTodo(id) {
    const todo = todoArray.find(t => t.id === id);
    if (!todo) return;
    
    const modal = document.getElementById('task-modal');
    const modalTitle = document.getElementById('modal-title');
    const taskInput = document.getElementById('task-input');
    const dateInput = document.getElementById('date-input');
    const saveBtn = document.getElementById('save-task-btn');
    
    modalTitle.textContent = 'Edit Task';
    taskInput.value = todo.title;
    const year = todo.dueDate.getFullYear();
    const month = String(todo.dueDate.getMonth() + 1).padStart(2, '0');
    const day = String(todo.dueDate.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
    saveBtn.onclick = () => saveEditedTask(id);
    
    modal.style.display = 'block';
}

// Function to save an edited task
function saveEditedTask(id) {
    const todo = todoArray.find(t => t.id === id);
    const taskInput = document.getElementById('task-input');
    const dateInput = document.getElementById('date-input');
    
    if (todo && taskInput.value.trim()) {
        todo.title = taskInput.value.trim();
        todo.dueDate = new Date(dateInput.value);
        
        saveTodos();
        displayTodos();
        
        document.getElementById('task-modal').style.display = 'none';
        
        const successMessage = document.getElementById('success-message');
        successMessage.textContent = "Todo item Updated Successfully.";
        setTimeout(() => {
            successMessage.textContent = "";
        }, 3000);
    }
}

// Function to delete a todo
function deleteTodo(id) {
    todoArray = todoArray.filter(t => t.id !== id);
    saveTodos();
    displayTodos();
}

function closeModal() {
    document.getElementById('task-modal').style.display = 'none';
}

// Function to sort todos
function sortTodos() {
    todoArray.sort((a, b) => {
        if (sortDirection === 'asc') {
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else {
            return new Date(b.dueDate) - new Date(a.dueDate);
        }
    });
}

// Function to filter todos
function filterTodos() {
    let filteredTodos = [...todoArray];
    
    if (filterType === 'active') {
        filteredTodos = todoArray.filter(todo => !todo.completed);
    } else if (filterType === 'completed') {
        filteredTodos = todoArray.filter(todo => todo.completed);
    }
    
    return filteredTodos;
}

document.addEventListener('DOMContentLoaded', () => {
    const addTodoBtn = document.getElementById('add-todo');
    const sortAscBtn = document.getElementById('sort-asc');
    const sortDescBtn = document.getElementById('sort-desc');
    const filterAllBtn = document.getElementById('filter-all');
    const filterActiveBtn = document.getElementById('filter-active');
    const filterCompletedBtn = document.getElementById('filter-completed');
    const closeModalBtn = document.getElementById('close-modal');
    
    if (addTodoBtn) {
        addTodoBtn.addEventListener('click', showAddTaskModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('task-modal');
        if (event.target === modal) {
            closeModal();
        }
    });
    
    if (sortAscBtn && sortDescBtn) {
        sortAscBtn.addEventListener('click', () => {
            sortDirection = 'asc';
            sortAscBtn.classList.add('active');
            sortDescBtn.classList.remove('active');
            displayTodos();
        });
        
        sortDescBtn.addEventListener('click', () => {
            sortDirection = 'desc';
            sortDescBtn.classList.add('active');
            sortAscBtn.classList.remove('active');
            displayTodos();
        });
    }
    
    // Add event listeners for filtering buttons if they exist
    if (filterAllBtn && filterActiveBtn && filterCompletedBtn) {
        filterAllBtn.addEventListener('click', () => {
            filterType = 'all';
            filterAllBtn.classList.add('active');
            filterActiveBtn.classList.remove('active');
            filterCompletedBtn.classList.remove('active');
            displayTodos();
        });
        
        filterActiveBtn.addEventListener('click', () => {
            filterType = 'active';
            filterActiveBtn.classList.add('active');
            filterAllBtn.classList.remove('active');
            filterCompletedBtn.classList.remove('active');
            displayTodos();
        });
        
        filterCompletedBtn.addEventListener('click', () => {
            filterType = 'completed';
            filterCompletedBtn.classList.add('active');
            filterAllBtn.classList.remove('active');
            filterActiveBtn.classList.remove('active');
            displayTodos();
        });
    }
    
    fetchTodos();
});