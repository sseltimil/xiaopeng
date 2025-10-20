/*
  app component
  title component
  filter component
  list component
*/

class BaseViewComponent {
  rootEle = null;
}
class App extends BaseViewComponent {
  title = null;
  todoFilter = null;
  todoList = null;
  TodoService = null;
  constructor() {
    this.title = new Title();
    this.todoFilter = new TodoFilter();
    this.todoList = new TodoList();
    this.TodoService = new TodoService();
  }
}
class Title extends BaseViewComponent {
}

class TodoFilter  extends BaseViewComponent {
  
}

class TodoList extends BaseViewComponent { {
  
}

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



