// use strict;

// Type declarations

type Primitives = string | number | boolean | null;
type TodoObject = {
  id: string
  name: string
  completed: boolean
}
type TodoArray = TodoObject[];
type Mode = 'light' | 'dark';

let todoList: TodoArray = []

document.addEventListener("DOMContentLoaded", function(): void {
  // DOM selectors
  const mainWrapper = document.querySelector('.todo-main-wrapper') as HTMLElement;
  const todoForm = document.querySelector(".add-todo-form") as HTMLFormElement;
  const todoListElem = document.querySelector('.todo-list') as HTMLElement;
  const clearCompletedBtn = document.querySelector('.clear-completed') as HTMLButtonElement;
  const modeToggleBtn = document.querySelector('.mode-toggler') as HTMLButtonElement;
  
  // Events
  todoForm.addEventListener('submit', addTodo)
  clearCompletedBtn.addEventListener('click', clearCompleted)
  todoListElem.addEventListener('click', function(e: Event): void {
    const target = <HTMLElement>e.target;

    if (target.classList.contains("delete-todo-btn")) {
      const id: string = target.dataset.id;

      deleteTodoItem(id)
    }
  })
  
  modeToggleBtn.addEventListener('click', toggleMode)
  mainWrapper.addEventListener('click', function(e: Event): void {
    const target = <HTMLButtonElement> e.target;

    if(target.classList.contains('filter-btn')) {
      const name: string = target.dataset.name;

      filterTodo(target, name)
    }
  })
})

// Toggles light and dark mode

const changeImgPath = (nodes: NodeList, currentMode: Mode): void => {
  
  nodes.forEach((element: HTMLElement) => {
    const elemSrcSet: string = getRelativePath(element, 'srcset');
    const mediaAttrVal: string = element.getAttribute('media');

    if(mediaAttrVal === '(max-width: 599px)') {
      if(currentMode === 'light') {
        element.setAttribute('srcset', elemSrcSet + element.dataset.dark)
      } else {
        element.setAttribute('srcset', elemSrcSet + element.dataset.light)
      }
    }

    if(mediaAttrVal === '(min-width: 600px)') {
      if(currentMode === 'light') {
        element.setAttribute('srcset', elemSrcSet + element.dataset.dark)
      } else {
        element.setAttribute('srcset', elemSrcSet + element.dataset.light)
      }
    }
    
  })
}

const toggleDarkAndLightMode = (toggler: HTMLButtonElement, current: Mode): void => {
  const modeDiv = <HTMLDivElement> document.querySelector('#mode');
  const headerBgs = <NodeList> document.querySelectorAll('.header-bg > picture > source');
  const slicedPath: string = getRelativePath(toggler.firstElementChild, 'src')

  if(current === 'light') {
    toggler.firstElementChild.setAttribute('src', slicedPath + toggler.dataset.light);
    modeDiv.classList.remove('light-mode');
    modeDiv.classList.add('dark-mode');

    changeImgPath(headerBgs, 'light')
  }

  if(current === 'dark') {
    toggler.firstElementChild.setAttribute('src', slicedPath + toggler.dataset.dark);
    modeDiv.classList.remove('dark-mode');
    modeDiv.classList.add('light-mode');

    changeImgPath(headerBgs, 'dark')
  }
}

function toggleMode(e: Event): void {
  const target = <HTMLButtonElement> e.currentTarget;
  const modeDiv = <HTMLDivElement> document.querySelector('#mode')


  if(modeDiv.classList.contains('light-mode')) {
    toggleDarkAndLightMode(target, 'light')
  } else {
    toggleDarkAndLightMode(target, 'dark')
  }
}

// End of mode toggle

function addTodo(e: Event): void {
  e.preventDefault()

  const todoName = document.querySelector('#todo-form-input') as HTMLInputElement;
  const todoChecked = document.querySelector('#todo-form-check') as HTMLInputElement;

  if(!todoName.value) {
    return
  }

  const todoItem: TodoObject = {
    id: generateRandomId(),
    name: todoName.value,
    completed: todoChecked.checked
  }

  todoName.value = "";
  if(todoChecked.checked) {
    todoChecked.checked = false;
  }
  
  todoList.push(todoItem)

  renderTodoList(todoList)
}

function renderTodoList(list: TodoArray): void {
  const output: string[] = list.map((item: TodoObject) => {

    return `
      <li class="todo-item">
        <input type="checkbox" ${item.completed ? 'checked': null} name="${item.name}" data-id="${item.id}" />
        <p style="text-decoration: ${item.completed ? "line-through" : "none"}; color: ${item.completed ? "var(--dark-theme-5)" : ""}">${item.name}</p>
        <button data-id="${item.id}" class="delete-todo-btn">&#10006;</button>
      </li>
    `
  })

  const todoListElem = document.querySelector('.todo-list') as HTMLElement;

  todoListElem.innerHTML = output.join("");

  if(todoList.length) {
    itemsLeftWatch(list)
  }

  handleTaskComplete()
}

function deleteTodoItem(id: string): void {
  todoList = todoList.filter((item) => item.id !== id)  

  renderTodoList(todoList)
}

function clearCompleted(): void {
  const completedTodo: TodoArray = todoList.filter(item => item.completed)
  
  todoList = todoList.filter((item) => !item.completed);

  if(completedTodo.length) {
    renderTodoList(todoList)
  }
}

function filterTodo(target: HTMLButtonElement, filter: string): void {
  const filterBtns = <NodeList> document.querySelectorAll('.filter-btn');

  filterBtns.forEach((btn: HTMLElement) => {
    btn.classList.remove('active')
  })

  target.classList.add('active')

  const newTodoList: TodoArray = todoList.filter(item => {
    if(filter === 'Active') {
      return !item.completed
    } else if (filter === 'Completed') {
      return item.completed
    } else {
      return item
    }
  })

  if(todoList.length) {
    renderTodoList(newTodoList)
  }
}

function handleTaskComplete (): void {
  let todoItemCheckboxes = <NodeList> document.querySelectorAll('.todo-item input[type="checkbox"]');

  todoItemCheckboxes.forEach((todoItem) => {
    todoItem.addEventListener('change', function(e: Event): void {
      const target = <HTMLInputElement> e.target;
      const todoItemText = <HTMLParagraphElement> target.nextElementSibling;

      const id: string = target.dataset.id;
      const checked: boolean = target.checked

      if(checked) {
        todoItemText.style.textDecoration = 'line-through';
        todoItemText.style.color = 'var(--dark-theme-5)';
      } else {
        todoItemText.style.textDecoration = 'none';
      }

      todoList = todoList.map(item => {
        if(item.id === id) {
          return { ...item, completed: checked }
        }
        return item
      })

      itemsLeftWatch(todoList)
    })

  })
}

function itemsLeftWatch(list: TodoArray): void {
  const remainingTaskElem = <HTMLParagraphElement> document.querySelector('.todo-bottom > p');

  const count: number = list.filter(item => !item.completed).length;

  const remainingTaskText: string = `
    ${count === 0 ? 'No items' : count === 1 ? count + " item left" : count + " items left"}
  `
  remainingTaskElem.innerHTML = remainingTaskText;
}

function generateRandomId (): string {
  return Date.now().toString(20) + Math.random().toString(20).substring(2);
}

function getRelativePath(selector: Element | HTMLElement, attribute: string): string {
  const originalPath: string = selector.getAttribute(attribute);
  return originalPath.slice(0, originalPath.lastIndexOf('/') + 1);
}