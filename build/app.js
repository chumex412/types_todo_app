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
    modeToggleBtn.addEventListener('click', toggleMode);
    mainWrapper.addEventListener('click', function (e) {
        var target = e.target;
        if (target.classList.contains('filter-btn')) {
            var name_1 = target.dataset.name;
            filterTodo(target, name_1);
        }
    });
});
var changeImgPath = function (nodes, currentMode) {
    nodes.forEach(function (element) {
        var elemSrcSet = getRelativePath(element, 'srcset');
        var mediaAttrVal = element.getAttribute('media');
        if (mediaAttrVal === '(max-width: 599px)') {
            if (currentMode === 'light') {
                element.setAttribute('srcset', elemSrcSet + element.dataset.dark);
            }
            else {
                element.setAttribute('srcset', elemSrcSet + element.dataset.light);
            }
        }
        if (mediaAttrVal === '(min-width: 600px)') {
            if (currentMode === 'light') {
                element.setAttribute('srcset', elemSrcSet + element.dataset.dark);
            }
            else {
                element.setAttribute('srcset', elemSrcSet + element.dataset.light);
            }
        }
    });
};
var toggleDarkAndLightMode = function (toggler, current) {
    var modeDiv = document.querySelector('#mode');
    var headerBgs = document.querySelectorAll('.header-bg > picture > source');
    var slicedPath = getRelativePath(toggler.firstElementChild, 'src');
    if (current === 'light') {
        toggler.firstElementChild.setAttribute('src', slicedPath + toggler.dataset.light);
        modeDiv.classList.remove('light-mode');
        modeDiv.classList.add('dark-mode');
        changeImgPath(headerBgs, 'light');
    }
    if (current === 'dark') {
        toggler.firstElementChild.setAttribute('src', slicedPath + toggler.dataset.dark);
        modeDiv.classList.remove('dark-mode');
        modeDiv.classList.add('light-mode');
        changeImgPath(headerBgs, 'dark');
    }
};
function toggleMode(e) {
    var target = e.currentTarget;
    var modeDiv = document.querySelector('#mode');
    if (modeDiv.classList.contains('light-mode')) {
        toggleDarkAndLightMode(target, 'light');
    }
    else {
        toggleDarkAndLightMode(target, 'dark');
    }
}
function addTodo(e) {
    e.preventDefault();
    var todoName = document.querySelector('#todo-form-input');
    var todoChecked = document.querySelector('#todo-form-check');
    if (!todoName.value) {
        return;
    }
    var todoItem = {
        id: generateRandomId(),
        name: todoName.value,
        completed: todoChecked.checked
    };
    todoName.value = "";
    if (todoChecked.checked) {
        todoChecked.checked = false;
    }
    todoList.push(todoItem);
    renderTodoList(todoList);
}
function renderTodoList(list) {
    var output = list.map(function (item) {
        return "\n      <li class=\"todo-item\">\n        <input type=\"checkbox\" ".concat(item.completed ? 'checked' : null, " name=\"").concat(item.name, "\" data-id=\"").concat(item.id, "\" />\n        <p style=\"text-decoration: ").concat(item.completed ? "line-through" : "none", "; color: ").concat(item.completed ? "var(--dark-theme-5)" : "", "\">").concat(item.name, "</p>\n        <button data-id=\"").concat(item.id, "\" class=\"delete-todo-btn\">&#10006;</button>\n      </li>\n    ");
    });
    var todoListElem = document.querySelector('.todo-list');
    todoListElem.innerHTML = output.join("");
    if (todoList.length) {
        itemsLeftWatch(list);
    }
    handleTaskComplete();
}
function deleteTodoItem(id) {
    todoList = todoList.filter(function (item) { return item.id !== id; });
    renderTodoList(todoList);
}
function clearCompleted() {
    var completedTodo = todoList.filter(function (item) { return item.completed; });
    todoList = todoList.filter(function (item) { return !item.completed; });
    if (completedTodo.length) {
        renderTodoList(todoList);
    }
}
function filterTodo(target, filter) {
    var filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(function (btn) {
        btn.classList.remove('active');
    });
    target.classList.add('active');
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
    if (todoList.length) {
        renderTodoList(newTodoList);
    }
}
function handleTaskComplete() {
    var todoItemCheckboxes = document.querySelectorAll('.todo-item input[type="checkbox"]');
    todoItemCheckboxes.forEach(function (todoItem) {
        todoItem.addEventListener('change', function (e) {
            var target = e.target;
            var todoItemText = target.nextElementSibling;
            var id = target.dataset.id;
            var checked = target.checked;
            if (checked) {
                todoItemText.style.textDecoration = 'line-through';
                todoItemText.style.color = 'var(--dark-theme-5)';
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
function itemsLeftWatch(list) {
    var remainingTaskElem = document.querySelector('.todo-bottom > p');
    var count = list.filter(function (item) { return !item.completed; }).length;
    var remainingTaskText = "\n    ".concat(count === 0 ? 'No items' : count === 1 ? count + " item left" : count + " items left", "\n  ");
    remainingTaskElem.innerHTML = remainingTaskText;
}
function generateRandomId() {
    return Date.now().toString(20) + Math.random().toString(20).substring(2);
}
function getRelativePath(selector, attribute) {
    var originalPath = selector.getAttribute(attribute);
    return originalPath.slice(0, originalPath.lastIndexOf('/') + 1);
}
//# sourceMappingURL=app.js.map