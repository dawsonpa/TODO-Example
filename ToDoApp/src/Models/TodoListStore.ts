import { action, computed, observable, runInAction, toJS } from "mobx";
import Todo, { ITodo, PendingState } from "./Todo";
import { todoService, ToDoService } from "../Services";
import uuid from "react-native-uuid";

export enum Filters {

}
export class TodoListStore {
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
		try {
			todo.id = uuid.v1();
			this.updateState(PendingState.PENDING);
			const created = await this.service.createToDo(todo);
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
		try {
			this.updateState(PendingState.PENDING);
			const todos: ITodo[] = await this.service.getAllToDos();
			runInAction(() => {
				todos.forEach((todo: ITodo) => this.list.push(new Todo(todo)));
				this.updateState(PendingState.DONE)
			})
		} catch(e) {
			runInAction(() => {
				this.updateState(PendingState.ERROR);
			})
		}
	};

	@action
	updateTodo = async (todo: Todo) => {
		try {
			this.updateState(PendingState.PENDING);
			const parsedTodo = toJS(todo) as ITodo;
			const created = await this.service.updateToDo(parsedTodo);
			runInAction(() => {
				todo.updateTodo(created);
				this.updateState(PendingState.DONE);
			})
		} catch (e) {
			runInAction(() => {
				this.updateState(PendingState.ERROR);

			})
		}
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
}