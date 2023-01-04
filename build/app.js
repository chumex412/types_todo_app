var todoForm = document.querySelector(".add-todo-form");
var todoListElem = document.querySelector('.todo-list');
document.addEventListener("DOMContentLoaded", function () {
    togglerMode();
});
function togglerMode() {
}
function renderTodoList(list) {
    var output = list.map(function (item) {
        return "\n      <li class=\"todo-item\">\n        <input type=\"checkbox\" checked=".concat(item.completed, " name=\"").concat(item.name, "\" />\n        <p>").concat(item.name, "</p>\n        <button data-id=\"").concat(item.id, "\" class=\"delete-todo-btn\">&#10006;</button>\n      </li>\n    ");
    });
    todoListElem.innerHTML = output.join("");
}
//# sourceMappingURL=app.js.map