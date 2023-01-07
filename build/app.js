let todoList = [];
document.addEventListener("DOMContentLoaded", function () {
    const mainWrapper = document.querySelector('.todo-main-wrapper');
    const todoForm = document.querySelector(".add-todo-form");
    const todoListElem = document.querySelector('.todo-list');
    const clearCompletedBtn = document.querySelector('.clear-completed');
    const modeToggleBtn = document.querySelector('.mode-toggler');
    let dragSrcElem;
    const eventTypeArr = ['dragstart', 'dragenter', 'dragleave', 'dragover', 'drop', 'dragend'];
    todoForm.addEventListener('submit', addTodo);
    clearCompletedBtn.addEventListener('click', clearCompleted);
    todoListElem.addEventListener('click', function (e) {
        const target = e.target;
        if (target.classList.contains("delete-todo-btn")) {
            const id = target.dataset.id;
            deleteTodoItem(id);
        }
    });
    modeToggleBtn.addEventListener('click', toggleMode);
    mainWrapper.addEventListener('click', function (e) {
        const target = e.target;
        if (target.classList.contains('filter-btn')) {
            const name = target.dataset.name;
            filterTodo(target, name);
        }
    });
    eventTypeArr.forEach(eventType => {
        todoListElem.addEventListener(eventType, function (evt) {
            const target = evt.target;
            const li = target.closest('.todo-item');
            if (!li)
                return;
            if (!todoListElem.contains(li))
                return;
            if (eventType === 'dragstart') {
                dragSrcElem = li;
                evt.dataTransfer.effectAllowed = 'move';
                evt.dataTransfer.setData('text/plain', li.id);
                setTimeout(() => {
                    li.classList.add('dragstart');
                }, 0);
            }
            if (eventType === 'dragenter' || eventType === 'dragover') {
                evt.preventDefault();
                if (dragSrcElem.id !== li.id) {
                    li.classList.add('dragover');
                }
            }
            if (eventType === 'dragleave') {
                if (li.classList.contains('dragover')) {
                    li.classList.remove('dragover');
                }
            }
            if (eventType === 'drop') {
                handleDrop(evt, dragSrcElem, li);
            }
            if (eventType === 'dragend') {
                dragSrcElem.classList.remove('dragstart');
            }
        });
    });
});
const imitateDOMSwap = function (srcElem, target) {
    const todoItems = document.querySelector('.todo-list').children;
    const newTodoItemArr = Array.from(todoItems);
    const srcIndex = newTodoItemArr.indexOf(srcElem);
    const targetIndex = newTodoItemArr.indexOf(target);
    const srcOriginObj = todoList.find((_, index) => index === srcIndex);
    const targetOriginObj = todoList.find((_, index) => index === targetIndex);
    todoList.splice(targetIndex, 1, srcOriginObj);
    todoList.splice(srcIndex, 1, targetOriginObj);
};
function handleDrop(evt, srcElem, liElem) {
    evt.stopPropagation();
    srcElem.classList.remove('dragstart');
    if (srcElem === liElem) {
        return;
    }
    liElem.classList.remove('dragover');
    const id = evt.dataTransfer.getData('text/plain');
    const draggableElem = document.getElementById(id);
    const dropTargetContent = liElem.innerHTML;
    liElem.innerHTML = draggableElem.innerHTML;
    draggableElem.innerHTML = dropTargetContent;
    draggableElem.id = liElem.id;
    liElem.id = id;
    imitateDOMSwap(draggableElem, liElem);
}
const changeImgPath = (nodes, currentMode) => {
    nodes.forEach((element) => {
        const elemSrcSet = getRelativePath(element, 'srcset');
        const mediaAttrVal = element.getAttribute('media');
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
const toggleDarkAndLightMode = (toggler, current) => {
    const modeDiv = document.querySelector('#mode');
    const headerBgs = document.querySelectorAll('.header-bg > picture > source');
    const slicedPath = getRelativePath(toggler.firstElementChild, 'src');
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
    const target = e.currentTarget;
    const modeDiv = document.querySelector('#mode');
    if (modeDiv.classList.contains('light-mode')) {
        toggleDarkAndLightMode(target, 'light');
    }
    else {
        toggleDarkAndLightMode(target, 'dark');
    }
}
function addTodo(e) {
    e.preventDefault();
    const todoName = document.querySelector('#todo-form-input');
    const todoChecked = document.querySelector('#todo-form-check');
    if (!todoName.value) {
        return;
    }
    const todoItem = {
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
    const output = list.map((item) => {
        return `
      <li id="item-${item.id}" class="todo-item" draggable="true">
        <input 
          type="checkbox" ${item.completed ? 'checked' : ""} 
          value="${item.name}" 
          name="task" 
          data-id="${item.id}" 
        />
        <p class="${item.completed ? "checked" : ""}">${item.name}</p>
        <button data-id="${item.id}" class="delete-todo-btn">&#10006;</button>
      </li>
    `;
    });
    const todoListElem = document.querySelector('.todo-list');
    todoListElem.innerHTML = output.join("");
    if (todoList.length) {
        itemsLeftWatch(list);
    }
    handleTaskComplete();
}
function deleteTodoItem(id) {
    todoList = todoList.filter((item) => item.id !== id);
    renderTodoList(todoList);
}
function clearCompleted() {
    const completedTodo = todoList.filter(item => item.completed);
    todoList = todoList.filter((item) => !item.completed);
    if (completedTodo.length) {
        renderTodoList(todoList);
    }
}
function filterTodo(target, filter) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach((btn) => {
        btn.classList.remove('active');
    });
    target.classList.add('active');
    const newTodoList = todoList.filter(item => {
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
    let todoItemCheckboxes = document.querySelectorAll('.todo-item input[type="checkbox"]');
    todoItemCheckboxes.forEach((checkInput) => {
        checkInput.addEventListener('change', function (e) {
            const target = e.target;
            const todoItemText = target.nextElementSibling;
            const id = target.dataset.id;
            const checked = target.checked;
            if (checked) {
                target.setAttribute('checked', "");
            }
            else {
                target.removeAttribute('checked');
            }
            showChecked(todoItemText, checked);
            todoList = todoList.map(item => {
                if (item.id === id) {
                    return Object.assign(Object.assign({}, item), { completed: checked });
                }
                return item;
            });
            itemsLeftWatch(todoList);
        });
    });
}
function showChecked(elem, checked) {
    if (checked) {
        elem.classList.add('checked');
    }
    else {
        elem.classList.remove('checked');
    }
}
function itemsLeftWatch(list) {
    const remainingTaskElem = document.querySelector('.todo-bottom > p');
    const count = list.filter(item => !item.completed).length;
    const remainingTaskText = `
    ${count === 0 ? 'No items' : count === 1 ? count + " item left" : count + " items left"}
  `;
    remainingTaskElem.innerHTML = remainingTaskText;
}
function generateRandomId() {
    return Date.now().toString(20) + Math.random().toString(20).substring(2);
}
function getRelativePath(selector, attribute) {
    const originalPath = selector.getAttribute(attribute);
    return originalPath.slice(0, originalPath.lastIndexOf('/') + 1);
}
//# sourceMappingURL=app.js.map