import {action, computed, observable, runInAction, toJS} from "mobx";
import Todo, {ITodo, PendingState} from "../models/Todo";
import {todoService, ToDoService} from "../services";

export enum Filters {

}
export default class TodoListStore {
	@observable list: Todo[] = [];
	@observable state: PendingState = PendingState.DONE;
	@observable filters: Filters[] = [];
	service: ToDoService = todoService;
	constructor() {
	}


	@action
	updateState = (state: PendingState) => {
		this.state = state;
	};

	@action
	addTodo = async (todo: ITodo) => {
		console.log('hello g=addd')
		try {
			todo.id = new Date().getTime().toString();
			this.updateState(PendingState.PENDING);
			const created = await this.service.createToDo(todo);
			console.log('cre', created);
			runInAction(() => {
				const newTodo = new Todo(created);
				this.list.push(newTodo);
				this.updateState(PendingState.DONE);
			})
		} catch (e) {
			runInAction(() => {
				this.updateState(PendingState.ERROR);

			})
		}
	};

	@action
	removeTodo = async (todo: Todo) => {
		try {
			this.updateState(PendingState.PENDING);
			await this.service.deleteTodo(todo.id);
			runInAction(() => {
				this.list.splice(this.list.indexOf(todo), 1);
				this.updateState(PendingState.DONE)
			})
		} catch(e) {
			runInAction(() => {
				this.updateState(PendingState.ERROR);
			})
		}
	};

	@action
	getAllTodos = async () => {
		console.log('get all')
		try {
			this.updateState(PendingState.PENDING);
			const todos: ITodo[] = await this.service.getAllToDos();
			runInAction(() => {
				const newTodos: Todo[] = [];
				todos.forEach((todo: ITodo) => newTodos.push(new Todo(todo)));
				this.list = newTodos;
				this.updateState(PendingState.DONE)
			})
		} catch(e) {
			runInAction(() => {
				this.updateState(PendingState.ERROR);
			})
		}
	};

	@action
	updateTodo = async (updatedTodo: ITodo, oldTodo: Todo) => {
		try {
			this.updateState(PendingState.PENDING);
			const created = await this.service.updateToDo(updatedTodo);
			runInAction(() => {
				this.list.map((todo: Todo) => {
					if(oldTodo.id === todo.id) {
						console.log('updating, ', todo)
						todo.updateTodo(created);
					}
				});
				console.log(this.list.slice());
				this.updateState(PendingState.DONE);
			})
		} catch (e) {
			runInAction(() => {
				this.updateState(PendingState.ERROR);

			})
		}
	};

	@action
	toggleComplete = async (todo: Todo) => {
		todo.toggleComplete();
		const updatedTodo: ITodo = toJS(todo);
		await this.updateTodo(updatedTodo, todo)
	};



	@computed
	get completedTodos(): Todo[] {
		return this.list.filter(todo => todo.completed);
	}

	@computed
	get incompleteTodos(): Todo[] {
		return this.list.filter(todo => !todo.completed);
	}
	
	@computed
	get lateToDos(): Todo[] {
		return this.list.filter(todo => todo.late);
	}

	@computed
	get isLoading(): boolean {
		return this.state === PendingState.PENDING;
	}

	@computed
	get isError(): boolean {
		return this.state === PendingState.ERROR;
	}
}