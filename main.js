$(document).ready(function () {
  let editingTodoId = null;

  $("#formTodo").click(function (event) {
      event.preventDefault();
  });

  setInterval(() => {
    const dateAndTime = new Date();
    const date = dateAndTime.toLocaleDateString();
    const time = dateAndTime.toLocaleTimeString();
    $("#time-date h3").text(`${date} - ${time}`);
  }, 1000);

  $("#addTodoButton span").text("add_task");

  // Load todos from localStorage
  const todos = JSON.parse(localStorage.getItem("todos")) || {};
  for (let id in todos) {
    addTodoToDOM(id, todos[id]);
  }
  // console.log(todos)

  function addTodoToDOM(id, value) {
    const todoTask = `<li data-id='${id}' class='rounded-full px-5 py-2 bg-gray-100 text-black w-[60%] md:w-[45%] lg:w-[35%] flex justify-between items-center'> 
      <p class="pr-4">${value}</p>   
      <div id="icons-list" class="flex gap-2 md:gap-5">
        <span class="checkTodo material-symbols-outlined cursor-pointer bg-gray-400 rounded-full p-1 !text-[15px] md:!text-[24px]">check</span>
        <span class="editTodo material-symbols-outlined cursor-pointer bg-amber-400 rounded-full p-1 !text-[15px] md:!text-[24px]">edit</span>
        <span class="deleteTodo material-symbols-outlined cursor-pointer bg-red-500 rounded-full p-1 !text-[15px] md:!text-[24px]">delete</span> 
      </div>
    </li>`;
    $("#allTodos").prepend(todoTask);
  }

  function setTodosToLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  let todoValue = "";

  $("#addTodoButton").click(function () {
    todoValue = $("#todoText").val().trim();

    if(todoValue === ""){
      alert("Oops! The input is empty.");
      return;
    }

    if($("#addTodoButton span").text() === "published_with_changes" && editingTodoId) {
      todos[editingTodoId] = todoValue;
      $(`li[data-id='${editingTodoId}']`).find("p").text(todoValue);
      setTodosToLocalStorage(); // update localStorage
      editingTodoId = null;
      $("#addTodoButton span").text("add_task");
      $("#todoText").val("");
      return;
    } 

    if(Object.values(todos).includes(todoValue)) {
      return alert("Todo already exists!");
    }

    const date = Date.now();
    const todoId = `todo-${date}`;
    todos[todoId] = todoValue;
    addTodoToDOM(todoId, todoValue);
    setTodosToLocalStorage(); // save to localStorage
    $("#todoText").val("");
    return;
  });

  $("#allTodos").on('click', '.deleteTodo, .editTodo, .checkTodo', function(e) {
    const classList = e.target.classList;
    const $p = $(this).closest('li').find('p');
    const todoID = $(this).closest('li').data("id");

    if(classList.contains("checkTodo")){
      $p.toggleClass("line-through");
      $(this).toggleClass("bg-green-500");
      return;
    }
    else if(classList.contains("editTodo")){
      const TodoValue = $p.text();
      $("#todoText").val(TodoValue).focus();
      $("#addTodoButton span").text("published_with_changes");
      editingTodoId = todoID;
      return;
    }
    else if(classList.contains("deleteTodo")){
      if(confirm("Are you sure, you want to delete!!!")) {
        $(this).closest('li').remove();
        delete todos[todoID];
        setTodosToLocalStorage(); // update localStorage
        return;
      }
    }
  });

  $("#clearAllTodos").click(function(){
    if(Object.keys(todos).length > 0){
      if(confirm("Are you sure, you want to delete all todos???")){
        $("#allTodos li").remove();
        for (let key in todos) {
          delete todos[key];
        }
        setTodosToLocalStorage(); // clear localStorage
        return;
      }
    }
    return
  });

});
