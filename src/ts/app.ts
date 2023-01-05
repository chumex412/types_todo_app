// use strict;

// Type declarations

type Primitives = string | number | boolean | null;

type TodoObject = {
  id: string
  name: string
  completed: boolean
}

type TodoArray = TodoObject[];

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
  
  modeToggleBtn.addEventListener('click', togglerMode)
  mainWrapper.addEventListener('click', function(e: Event): void {
    const target = <HTMLButtonElement> e.target;

    if(target.classList.contains('filter-btn')) {
      const name: string = target.dataset.name;

      filterTodo(name)
    }
  })
})

function togglerMode(): void {

}

function addTodo(e: Event): void {
  e.preventDefault()

  const todoName = document.querySelector('#todo-form-input') as HTMLInputElement;
  const todoChecked = document.querySelector('#todo-form-check') as HTMLInputElement;

  const todoItem: TodoObject = {
    id: generateRandomId(),
    name: todoName.value,
    completed: todoChecked.checked
  }
  
  todoList.push(todoItem)

  renderTodoList(todoList)
}

function renderTodoList(list: TodoArray): void {
  const output: string[] = list.map((item: TodoObject) => {

    return `
      <li class="todo-item">
        <input type="checkbox" ${item.completed ? 'checked': null} name="${item.name}" data-id="${item.id}" />
        <p style="text-decoration: ${item.completed ? "line-through" : "none"};">${item.name}</p>
        <button data-id="${item.id}" class="delete-todo-btn">&#10006;</button>
      </li>
    `
  })

  const todoListElem = document.querySelector('.todo-list') as HTMLElement;

  todoListElem.innerHTML = output.join("");

  itemsLeftWatch(list)

  let todoItemCheckboxes = <NodeList> document.querySelectorAll('.todo-item input[type="checkbox"]')

  todoItemCheckboxes.forEach((todoItem) => {
    todoItem.addEventListener('change', function(e: Event): void {
      const target = <HTMLInputElement> e.target;
      const todoItemText = <HTMLParagraphElement> target.nextElementSibling;

      const id: string = target.dataset.id;

      const checked: boolean = target.checked

      if(checked) {
        todoItemText.style.textDecoration = 'line-through';
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

function deleteTodoItem(id: string): void {
  todoList = todoList.filter((item) => item.id !== id)  

  renderTodoList(todoList)
}

function clearCompleted(): void {
  todoList = todoList.filter((item) => !item.completed)  

  renderTodoList(todoList)
}

function filterTodo(filter: string): void {
  const newTodoList: TodoArray = todoList.filter(item => {
    if(filter === 'Active') {
      return !item.completed
    } else if (filter === 'Completed') {
      return item.completed
    } else {
      return item
    }
  })

  renderTodoList(newTodoList)
}

function itemsLeftWatch(list: TodoArray): void {
  const remainingTaskElem = <HTMLParagraphElement> document.querySelector('.todo-bottom > p');

  const count: number = list.filter(item => !item.completed).length;

  const remainingTaskText: string = `
    ${count === 0 ? 'No tasks left or added' : count === 1 ? count + " item left" : count + " items left"}
  `
  remainingTaskElem.innerHTML = remainingTaskText;
}

function generateRandomId (): string {
  return Date.now().toString(20) + Math.random().toString(20).substring(2);
}