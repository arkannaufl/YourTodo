document.addEventListener("DOMContentLoaded", () => {
    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("todo-input");
    const todoList = document.getElementById("todo-list");
    const remainingCount = document.getElementById("remaining-count");
    const motivation = document.getElementById("motivation");
    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("close-modal");

    // load tasks from local storage
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];

    // render tasks
    const renderTodos = () => {
        todoList.innerHTML = "";
        savedTodos.forEach((todo, index) => {
            const li = document.createElement("li");
            li.className =
                "flex items-center justify-between font-semibold text-[#4F4F4F] p-3 border border-[#9F9F9F] rounded-2xl";
            if (todo.completed) {
                li.classList.add("text-[#9F9F9F]"); // Change text color for completed todos
            }
            li.innerHTML = `
        <input type="checkbox" class="form-checkbox h-5 w-5 text-[#4F4F4F] ml-2 mr-3 font-semibold" data-index="${index}" ${todo.completed ? "checked" : ""}>
        <span class="flex-grow ${todo.completed ? "line-through" : ""}">${todo.text}</span>
        <button data-index="${index}" class="delete-btn text-[#4F4F4F] p-1 mr-2 font-bold">✖</button>
    `;
            todoList.appendChild(li);
        });
        updateRemainingCount();
    };

    // update remaining todo count
    const updateRemainingCount = () => {
        const remainingTodos = savedTodos.filter(todo => !todo.completed).length;
        remainingCount.textContent = remainingTodos;
    };

    // fetch motivational quote
    const fetchQuote = async () => {
        try {
            const response = await fetch("https://api.quotable.io/random");
            const data = await response.json();
            motivation.textContent = `"${data.content}" - ${data.author}`;
        } catch (error) {
            console.error("Error fetching quote:", error);
        }
    };

    // show warning modal
    const showModal = (message) => {
        modal.querySelector("p").textContent = message;
        modal.classList.remove("hidden");
    };

    // close modal event
    closeModal.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // add task
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newTodoText = todoInput.value.trim();
        if (newTodoText !== "") {
            const newTodo = {
                text: newTodoText,
                completed: false
            };
            savedTodos.push(newTodo);
            localStorage.setItem("todos", JSON.stringify(savedTodos));
            todoInput.value = "";
            renderTodos();
        } else {
            showModal("Please enter a task before adding.");
        }
    });

    // mark task as completed
    todoList.addEventListener("change", (e) => {
        if (e.target.type === "checkbox") {
            const index = e.target.getAttribute("data-index");
            savedTodos[index].completed = e.target.checked;
            localStorage.setItem("todos", JSON.stringify(savedTodos));
            renderTodos();
        }
    });

    // delete task
    todoList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const index = e.target.getAttribute("data-index");
            savedTodos.splice(index, 1);
            localStorage.setItem("todos", JSON.stringify(savedTodos));
            renderTodos();
        }
    });

    // initial render and fetch quote
    renderTodos();
    fetchQuote();
});
