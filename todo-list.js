const todoList=[{
  name:'paracetamol',
  dueDate:'2023-06-4'}]; 
renderTodoList();
  function renderTodoList(){
  let todoHTML='';
    for(let i=0;i<todoList.length;i++){
      const todoObject= todoList[i];
      const name=todoObject.name;
      const dueDate= todoObject.dueDate;
      const html=`
        <div>${name}</div>
        <div>${dueDate}</div>
        <button onclick="todoList.splice(${i},1);
        renderTodoList();">Delete</button>
        `;
        todoHTML+=html;
    }
    document.querySelector('.js-todo-list').innerHTML=todoHTML;
  }

function addTodo(){
  const inputElement=document.querySelector('.js-name-input')
  const name=inputElement.value;
  const dateInputElement= document.querySelector('.js-due-date-input');
  const dueDate= dateInputElement.value;
  todoList.push({
    name: name,
    dueDate: dueDate});
  inputElement.value='';
  renderTodoList();
}
