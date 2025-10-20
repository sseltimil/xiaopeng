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

  // getTodos() {
  //   re
  // }
}

todoService = new TodoService();
console.log(todoService.todos);

todoService.addTodo({
  id: '56ty',
  title: 'Todo 3',
  status: 'pending',
  completed: false
});

console.log(todoService.todos);
todoService.remove('we23');
console.log(todoService.todos);
todoService.complete('sd34');

console.log(todoService.todos);