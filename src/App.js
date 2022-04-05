import { render } from './view/html-util.js';
import { TodoListView } from './view/TodoListView.js';
import { TodoListModel } from './model/TodoListModel.js';
import { TodoItemModel } from './model/TodoItemModel.js';

export class App {
  constructor() {
    this.todoListView = new TodoListView();
    this.todoListModel = new TodoListModel([]);
    // bind to Element
    this.formElement = document.querySelector('#js-form');
    this.inputElement = document.querySelector('#js-form-input');
    this.containerElement = document.querySelector('#js-todo-list');
    this.todoItemCountElement = document.querySelector('#js-todo-count');
    // ハンドラ呼び出しで、`this`が変わらないように固定する
    // `this`が常に`App`のインスタンスを示すようにする
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  /**
   * Todoを追加するときに呼ばれるリスナー関数
   * @param {string} title
   */
  handleAdd(title) {
    this.todoListModel.addTodo(new TodoItemModel({ title, completed: false }));
  }

  /**
   * Todoの状態を更新したときに呼ばれるリスナー関数
   * @param {{ id:number, completed: boolean }}
   */
  handleUpdate({ id, completed }) {
    this.todoListModel.updateTodo({ id, completed });
  }

  /**
   * Todoを削除したときに呼ばれるリスナー関数
   * @param {{ id: number }}
   */
  handleDelete({ id }) {
    this.todoListModel.deleteTodo({ id });
  }

  /**
   * TodoListViewが変更した時に呼ばれるリスナー関数
   */
  handleChange(event) {
    const todoItems = this.todoListModel.getTodoItems();
    const todoListView = new TodoListView();
    const todoListElement = todoListView.createElement(todoItems, {
      onUpdateTodo: ({id, completed }) => {
        this.handleUpdate({ id, completed });
      },
      onDeleteTodo: ({ id }) => {
        this.handleDelete({ id });
      }
    });
    render(todoListElement, this.containerElement);
    this.todoItemCountElement.textContent = `Todoアイテム数: ${this.todoListModel.getTotalCount()}`;
  }

  /**
   * 入力を送信したときに呼ばれるリスナー関数
   * @param {Event} event
   */
  handleSubmit(event) {
    event.preventDefault();
    this.handleAdd(this.inputElement.value);
    this.inputElement.value = "";
  }

  mount() {
    // 2. TodoListModelの状態が更新されたら表示を更新する
    this.todoListModel.onChange(this.handleChange);
    // 3. フォームを送信したら、新しいTodoItemModelを追加する
    this.formElement.addEventListener('submit', this.handleSubmit);
  }

  unmount() {
    this.todoListModel.offChange(this.handleChange);
    this.formElement.removeEventListener('submit', this.handleSubmit);
  }
}