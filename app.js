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
  todoInput = null;
  todoService = null;
  constructor() {
    super();
    this.rootEle = document.getElementById('xp-app');
    this.todoService = new TodoService();
    this.title = new Title({ class:'xp-title' });
    this.todoFilter = new TodoFilter({ class:'xp-filter' });
    this.todoList = new TodoList({ class:'xp-todo-list', data: this.todoService.todos });
    this.todoInput = new TodoInput({ class:'xp-todo-input' });

    this.initApp();
    this.initEvent();
  }

  initApp() {
    this.rootEle.appendChild(this.title.rootEle);
    this.rootEle.appendChild(this.todoInput.rootEle);
    this.rootEle.appendChild(this.todoFilter.rootEle);
    this.rootEle.appendChild(this.todoList.rootEle);
  }

  initEvent() {
    this.todoFilter.output.reg('onclickfilter', (data) => {
      console.log(data);
    });
    this.todoInput.output.reg('onaddtodo', (data) => {
      this.todoService.addTodo(data);
    });
    this.todoService.emitter.reg('onnewdata', (data) => {
      this.todoList.setData(data, true);
    })
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

class TodoInput extends BaseViewComponent {
  rootEle = document.createElement('div');
  inputEle = document.createElement('input');
  addBtn = document.createElement('button');
  output = new Emitter();

  constructor(option) {
    super(option);

    this.initView();
    
  }

  initView() {
    this.addBtn.innerText = '+';
    this.rootEle.appendChild(this.inputEle);
    this.rootEle.appendChild(this.addBtn);

    this.addBtn.onclick = () => {
      let todo = {
        id: Math.random().toString(32),
        title: this.inputEle.value,
        status: 'pending',
        completed: false
      };
      this.output.emit('onaddtodo', {...todo});
      this.inputEle.value = '';
    }
  }
}

class TodoList extends BaseViewComponent { 
  data = null; //todos data
  output = new Emitter();
  constructor(option) {
    super(option);
    const { data } = option;
    this.setData(data, true);
  }
  setData(newData, doRefresh) {
    this.data = [ ...newData ];
    console.log(this.data);
    if(doRefresh) {
      this.refresh();
    }
  }


  refresh() {
    this.rootEle.innerHTML = '';
    this.data.forEach(todo => {
      let todoItem = new TodoItem(todo);
      this.rootEle.appendChild(todoItem.rootEle);
    });
  }
}

class TodoService{
  todos = null;
  emitter = new Emitter();
  
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
    this.emitter.emit('onnewdata', this.todos);
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

 