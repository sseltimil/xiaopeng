/*
  app component
  title component
  filter component
  list component
*/


class Emitter{
  on = {};
  reg(event, fn) {
    if(!this.on[event]) {
      this.on[event] = [];
    }
    this.on[event].push(fn);
  }

  emit(event, data) {
    if(this.on[event]) {
      this.on[event].forEach(fn => fn(data));
    }
  }
}

class BaseViewComponent{
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
    this.initEvent();
  }

  initApp() {
    this.rootEle.appendChild(this.title.rootEle);

    console.log(this.todoFilter);
    this.rootEle.appendChild(this.todoFilter.rootEle);
    this.rootEle.appendChild(this.todoList.rootEle);
  }

  initEvent() {
    this.todoFilter.output.reg('onclickfilter', (data) => {
      console.log(data);
    });
  }
}
class Title extends BaseViewComponent {
  data = 'Xp Todo';
}

class TodoFilter  extends BaseViewComponent {
  data = ['all', 'pending', 'completed', 'removed'];
  output = new Emitter()
  constructor(option) {
    super(option);

    this.data.forEach(item => {
      let button = document.createElement('button');
      button.innerText = item;
      this.rootEle.appendChild(button);
      // button.addEventListener('click', () => {
      //   console.log(item);
      //   // this.output.emit('clickfilter', item);
      // });

      button.onclick = (event) => {
        this.output.emit('onclickfilter', item);
      }
    })
  }

}

class TodoItem extends BaseViewComponent {
  data = null;
  constructor(data) {
    super();
    this.data = data;
    this.rootEle = document.createElement('li');
    this.rootEle.innerText = this.data.title;
  }
}

class TodoList extends BaseViewComponent { 
  output = new Emitter();
  constructor(option) {
    super(option);
    this.TodoService = new TodoService();
    this.refresh();
  }

  refresh() {
    this.rootEle.innerHTML = '';
    this.TodoService.todos.forEach(todo => {
      let todoItem = new TodoItem(todo);
      this.rootEle.appendChild(todoItem.rootEle);
    });
  }
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

