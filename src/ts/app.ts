// use strict;

// Type declarations

type Primitives = string | number | boolean | null

type TodoObject = {
  id: string
  name: string
  completed: boolean
}

// DOM selectors
const todoForm = document.querySelector(".add-todo-form") as HTMLFormElement;
const todoListElem = document.querySelector('.todo-list') as HTMLElement;

document.addEventListener("DOMContentLoaded", function(): void {
  togglerMode()
})

function togglerMode(): void {

}

function renderTodoList(list: TodoObject[]): void {
  const output: string[] = list.map((item: TodoObject) => {

    return `
      <li class="todo-item">
        <input type="checkbox" checked=${item.completed} name="${item.name}" />
        <p>${item.name}</p>
        <button data-id="${item.id}" class="delete-todo-btn">&#10006;</button>
      </li>
    `
  })

  todoListElem.innerHTML = output.join("");

}