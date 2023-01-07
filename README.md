# Frontend Mentor - Todo app solution

This is a solution to the [Todo app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW) to help improve my coding skills.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users are be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Add new todos to the list
- Mark todos as complete
- Delete todos from the list
- Filter by all/active/complete todos
- Clear all completed todos
- Toggle light and dark mode
- Drag and drop to reorder items on the list

### Screenshot

![Desktop light mode](https://res.cloudinary.com/da8vqkdmt/image/upload/v1673103148/Screen_Shot_2023-01-07_at_15.46.00_1_ydkxxs.png)
![Desktop dark mode](https://res.cloudinary.com/da8vqkdmt/image/upload/v1673103147/Screen_Shot_2023-01-07_at_15.46.11_1_ojeyph.png)
![Mobile dark mode](https://res.cloudinary.com/da8vqkdmt/image/upload/c_scale,w_375/v1673103146/Screen_Shot_2023-01-07_at_15.46.32_1_i9wgug.png)

### Links

- Solution URL: [https://www.frontendmentor.io/solutions/todo-app-DzAk8-45fL](https://www.frontendmentor.io/solutions/todo-app-DzAk8-45fL)
- Live Site URL: [https://chumex412.github.io/types_todo_app/](https://chumex412.github.io/types_todo_app/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- TypeScript

### What I learned

It was my first time using TypeScript. I learned how to use unions, type alias and typescript DOM interfaces to acheive a few functionalities. TypeScript is an awesome tool, as it requires you to explicitly define the data types and interfaces when assigning a value to a variables or parameter. These helps other developers understand how your code works.

```ts
  type EventType = 'dragstart' | 'dragenter' | 'dragleave' | 'dragover' | 'drop' | 'dragend';

  eventTypeArr.forEach(eventType => {
    todoListElem.addEventListener(eventType, function (evt: DragEvent): void {}
  }
```

I also learned how to create responsive images with the picture element and also dynamically render different images within the picture element based on the mode.

```html
  <picture>
    <source media="(max-width: 599px)" data-dark="bg-mobile-dark.jpg" data-light="bg-mobile-light.jpg" srcset="./src/ images/bg-mobile-light.jpg" height="200px">
    <source data-dark="bg-desktop-dark.jpg" data-light="bg-desktop-light.jpg" media="(min-width: 600px)" srcset="./src/ images/bg-desktop-light.jpg" height="300px">
    <img src="./src/images/bg-mobile-light.jpg" alt="">
  </picture>
```

I also learned how to implement a drag and drop to shuffle the todo items. It was fun.  

### Useful resources

- [Essential guide to JavaScript drag and drop](https://www.javascripttutorial.net/web-apis/javascript-drag-and-drop/#:~:text=Introduction%20to%20JavaScript%20Drag%20and%20Drop%20API&text=To%20drag%20an%20image%2C%20you,you%20would%20drag%20an%20image.), [How to create drag and drop with JavaScript](https://www.digitalocean.com/community/tutorials/js-drag-and-drop-vanilla-js) - These helped me understand how to use the drag and drop API.
- [Stackoverflow solution](https://stackoverflow.com/questions/61208954/typescript-equivalent-of-array-from) - This helped me understand that without configuring the typescriptConfig properly, you can't use the latest JavaScript methods and syntax.

### Author

- Frontend Mentor - [@kodenavigator](https://www.frontendmentor.io/profile/chumex412)
- LinkedIn - [chukwuemeka Ofili](https://www.linkedin.com/in/chukwuemeka-ofili-7589a2156/)