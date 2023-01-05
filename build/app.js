var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var todoList = [];
document.addEventListener("DOMContentLoaded", function () {
    var mainWrapper = document.querySelector('.todo-main-wrapper');
    var todoForm = document.querySelector(".add-todo-form");
    var todoListElem = document.querySelector('.todo-list');
    var clearCompletedBtn = document.querySelector('.clear-completed');
    var modeToggleBtn = document.querySelector('.mode-toggler');
    todoForm.addEventListener('submit', addTodo);
    clearCompletedBtn.addEventListener('click', clearCompleted);
    todoListElem.addEventListener('click', function (e) {
        var target = e.target;
        if (target.classList.contains("delete-todo-btn")) {
            var id = target.dataset.id;
            deleteTodoItem(id);
        }
    });
    modeToggleBtn.addEventListener('click', togglerMode);
    mainWrapper.addEventListener('click', function (e) {
        var target = e.target;
        if (target.classList.contains('filter-btn')) {
            var name_1 = target.dataset.name;
            filterTodo(name_1);
        }
    });
});
function togglerMode() {
}
function addTodo(e) {
    e.preventDefault();
    var todoName = document.querySelector('#todo-form-input');
    var todoChecked = document.querySelector('#todo-form-check');
    var todoItem = {
        id: generateRandomId(),
        name: todoName.value,
        completed: todoChecked.checked
    };
    todoList.push(todoItem);
    renderTodoList(todoList);
}
function renderTodoList(list) {
    var output = list.map(function (item) {
        return "\n      <li class=\"todo-item\">\n        <input type=\"checkbox\" ".concat(item.completed ? 'checked' : null, " name=\"").concat(item.name, "\" data-id=\"").concat(item.id, "\" />\n        <p style=\"text-decoration: ").concat(item.completed ? "line-through" : "none", ";\">").concat(item.name, "</p>\n        <button data-id=\"").concat(item.id, "\" class=\"delete-todo-btn\">&#10006;</button>\n      </li>\n    ");
    });
    var todoListElem = document.querySelector('.todo-list');
    todoListElem.innerHTML = output.join("");
    itemsLeftWatch(list);
    var todoItemCheckboxes = document.querySelectorAll('.todo-item input[type="checkbox"]');
    todoItemCheckboxes.forEach(function (todoItem) {
        todoItem.addEventListener('change', function (e) {
            var target = e.target;
            var todoItemText = target.nextElementSibling;
            var id = target.dataset.id;
            var checked = target.checked;
            if (checked) {
                todoItemText.style.textDecoration = 'line-through';
            }
            else {
                todoItemText.style.textDecoration = 'none';
            }
            todoList = todoList.map(function (item) {
                if (item.id === id) {
                    return __assign(__assign({}, item), { completed: checked });
                }
                return item;
            });
            itemsLeftWatch(todoList);
        });
    });
}
function deleteTodoItem(id) {
    todoList = todoList.filter(function (item) { return item.id !== id; });
    renderTodoList(todoList);
}
function clearCompleted() {
    todoList = todoList.filter(function (item) { return !item.completed; });
    renderTodoList(todoList);
}
function filterTodo(filter) {
    var newTodoList = todoList.filter(function (item) {
        if (filter === 'Active') {
            return !item.completed;
        }
        else if (filter === 'Completed') {
            return item.completed;
        }
        else {
            return item;
        }
    });
    renderTodoList(newTodoList);
}
function itemsLeftWatch(list) {
    var remainingTaskElem = document.querySelector('.todo-bottom > p');
    var count = list.filter(function (item) { return !item.completed; }).length;
    var remainingTaskText = "\n    ".concat(count === 0 ? 'No tasks left or added' : count === 1 ? count + " item left" : count + " items left", "\n  ");
    remainingTaskElem.innerHTML = remainingTaskText;
}
function generateRandomId() {
    return Date.now().toString(20) + Math.random().toString(20).substring(2);
}
//# sourceMappingURL=app.js.map