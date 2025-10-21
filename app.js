/*
  app component
  title component
  filter component
  list component
*/

class BaseViewComponent {
  rootEle = null;
  constructor(option) {
    
    if(option) {
      this.rootEle = document.createElement('div');
      console.log(this.rootEle, '--------');
      this.rootEle.className = option.class;
    }
    
  }
}
class App extends BaseViewComponent {
  title = null;
  todoFilter = null;
  todoList = null;
  TodoService = null;
  constructor() {
    super();
    this.rootEle = document.getElementById('xp-app');
    this.title = new Title({ class:'xp-title' });
    this.todoFilter = new TodoFilter({ class:'xp-filter' });
    this.todoList = new TodoList({ class:'xp-todo-list' });
    this.TodoService = new TodoService();

    this.initApp();
  }

  initApp() {
    this.rootEle.appendChild(this.title.rootEle);
    this.rootEle.appendChild(this.todoFilter.rootEle);
    this.rootEle.appendChild(this.todoList.rootEle);
  }
}
class Title extends BaseViewComponent {
  data = 'Xp Todo';
  constructor(option) {
    super(option);
    this.rootEle.innerText = this.data;
  }
}

class TodoFilter  extends BaseViewComponent {
  data = ['all', 'pending', 'completed', 'removed'];
  constructor(option) {
    super(option);
    this.render();
  }
  render() {
    this.data.forEach(status => {
      const btn = document.createElement('button');
      btn.innerText = status;
      this.rootEle.appendChild(btn);
    });
  }
}

class TodoList extends BaseViewComponent { 
  
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

const app = new App();
console.log(app);

