


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
    if (option) {
      this.rootEle = document.createElement('div');
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
  filter = 'all';
  keyword = '';

  constructor() {
    super();
    this.rootEle = document.getElementById('xp-app');
    this.todoService = new TodoService();
    this.title = new Title({ class: 'xp-title' });
    this.todoInput = new TodoInput({ class: 'xp-input' });
    this.todoFilter = new TodoFilter({ class: 'xp-filter' });
    this.todoList = new TodoList({ class: 'xp-todo-list', data: this.todoService.todos });
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
    this.todoInput.output.reg('onaddtodo', (todo) => {
      this.todoService.addTodo(todo);
    });

    this.todoInput.output.reg('onsearch', (keyword) => {
      this.keyword = keyword;
      this.refreshList();
    });

    this.todoFilter.output.reg('onclickfilter', (filterType) => {
      this.filter = filterType;
      this.refreshList();
    });

    this.todoService.emitter.reg('onnewdata', (data) => {
      this.refreshList();
    });

    this.todoList.output.reg('onremoveitem', (id) => {
      this.todoService.remove(id);
    });

    this.refreshList();
  }

  refreshList() {
    let todos = [...this.todoService.todos];
    if (this.filter !== 'all') {
      todos = todos.filter(t => t.status === this.filter);
    }
    if (this.keyword) {
      const kw = this.keyword.toLowerCase();
      todos = todos.filter(t => t.title.toLowerCase().includes(kw));
    }
    this.todoList.setData(todos, true);
  }
}

class Title extends BaseViewComponent {
  data = 'Xp Todo';
  constructor(option) {
    super(option);
    this.rootEle.innerText = this.data;
  }
}

class TodoInput extends BaseViewComponent {
  inputEle = document.createElement('input');
  addBtn = document.createElement('button');
  searchBtn = document.createElement('button');
  output = new Emitter();

  constructor(option) {
    super(option);
    this.initView();
  }

  initView() {
    this.inputEle.placeholder = 'Enter todo or search...';
    this.addBtn.innerText = 'Add';
    this.searchBtn.innerText = 'Search';
    this.rootEle.appendChild(this.inputEle);
    this.rootEle.appendChild(this.addBtn);
    this.rootEle.appendChild(this.searchBtn);
    this.addBtn.onclick = () => {
      const value = this.inputEle.value.trim();
      if (!value) return;
      const todo = {
        id: Math.random().toString(36).slice(2),
        title: value,
        status: 'pending',
        completed: false
      };
      this.output.emit('onaddtodo', todo);
      this.inputEle.value = '';
    };
    this.searchBtn.onclick = () => {
      this.output.emit('onsearch', this.inputEle.value.trim());
    };
  }
}

class TodoFilter extends BaseViewComponent {
  data = ['all', 'pending', 'completed', 'removed'];
  output = new Emitter();
  constructor(option) {
    super(option);
    this.render();
  }

  render() {
    this.data.forEach(item => {
      const btn = document.createElement('button');
      btn.innerText = item;
      btn.onclick = () => this.output.emit('onclickfilter', item);
      this.rootEle.appendChild(btn);
    });
  }
}

class TodoList extends BaseViewComponent {
  data = [];
  output = new Emitter();
  constructor(option) {
    super(option);
    const { data } = option;
    this.setData(data, true);
  }

  setData(newData, doRefresh) {
    this.data = [...newData];
    if (doRefresh) this.refresh();
  }

  refresh() {
    this.rootEle.innerHTML = '';
    this.data.forEach(todo => {
      const todoItem = new TodoItem({
        class: 'xp-todo-item',
        data: todo
      });
      todoItem.output.reg('onremoveitem', (id) => this.output.emit('onremoveitem', id));
      this.rootEle.appendChild(todoItem.rootEle);
    });
  }
}

class TodoItem extends BaseViewComponent {
  titleEle = null;
  description = null;
  delBtn = null;
  output  = new Emitter();
  constructor(option) {
    super(option);
    this.data = option.data;
    this.rootEle.innerHTML = this.renderTemplate(this.data);

    this.delBtn = this.rootEle.querySelector('[data-ele="removeBtn"]');
    this.delBtn.onclick = () => {
      this.output.emit('onremoveitem', this.data.id);
    };
  }

  // __ has, -- is
  renderTemplate(data) {
    return `
      <div>
        <div class="xp-todoitem__title">${data.title}</div>
        <div class="xp-todoitem__status">${data.status}</div>
      </div>
      <div data-ele="removeBtn" class="xp-todoitem__remove-btn">Remove</div>
  `;
  }
}

class TodoService {
  todos = [];
  emitter = new Emitter();
  constructor() {
    this.todos = [
      { id: 'we23', title: 'Todo 1', status: 'pending', completed: false },
      { id: 'sd34', title: 'Todo 2', status: 'completed', completed: true },
      { id: 'ab89', title: 'Todo 3', status: 'pending', completed: false },
    ];
  }
  addTodo(todo) {
    this.todos.push(todo);
    this.emitter.emit('onnewdata', this.todos);
  }
  remove(id) {
    this.todos = this.todos.map(t => {
      if (t.id === id) t.status = 'removed';
      return t;
    });
    this.emitter.emit('onnewdata', this.todos);
  }
  complete(id) {
    this.todos = this.todos.map(t => {
      if (t.id === id) {
        t.completed = true;
        t.status = 'completed';
      }
      return t;
    });
    this.emitter.emit('onnewdata', this.todos);
  }
}

const app = new App();
