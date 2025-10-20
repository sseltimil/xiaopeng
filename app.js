class TodoService{
  todos = null;
  constructor(){
    this.todos = [
      {
        id: 'we23',
        title: 'Todo 1',
        status: 'pending',
        completed: false
      },
      {
        id: 'sd34',
        title: 'Todo 2',
        status: 'pending',
        completed: false
      }
    ];
  }

  addTodo(todo){
    this.todos.push(todo);
  }

  remove(id){
    this.todos = this.todos.map(t => {
      if(t.id === id){
        t.status = 'removed';
      }
      return t;
    });
  }

  complete(id) {
    this.todos = this.todos.map(t => {
      if(t.id === id){
        t.completed = true;
        t.status = 'completed';
      }
      return t;
    });
  }
}

todoService = new TodoService();
const todoList = document.querySelector('.xp-todo-list');

todoService.todos.forEach(t => {
  const todoItem = document.createElement('div');
  todoItem.innerHTML = t.title;
  todoList.appendChild(todoItem)
});


