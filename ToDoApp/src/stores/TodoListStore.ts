import {action, computed, observable, runInAction, toJS} from "mobx";
import Todo, {ITodo, PendingState} from "../models/Todo";
import {todoService, ToDoService} from "../services";
import {formatDates} from "../utils/time";

export enum Filters {
	COMPLETED='completed',
	INCOMPLETED='incomplete',
	ALL=''
}
export default class TodoListStore {
	@observable list: Todo[] = [];
	@observable state: PendingState = PendingState.DONE;
	@observable filter: Filters = Filters.ALL;
	@observable searchTerm: string = '';
	service: ToDoService = todoService;
	constructor() {
	}

	@action
	updateSearchTerm = (term: string) => {
		this.searchTerm = term;
	};

	@action
	updateFilter = (filter: Filters) => {
		this.filter = filter;
	};

	@action
	updateState = (state: PendingState) => {
		this.state = state;
	};

	@action
	addTodo = async (todo: ITodo) => {
		try {
			todo.id = new Date().getTime().toString();
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
						todo.updateTodo(created);
					}
				});
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
	@computed
	get searchResults(): Todo[] {
		let searchResults: Todo[] = this.list.slice();

		if(!this.filter && !this.searchTerm) {
			return searchResults;
		}

		if(this.filter) {
			searchResults = searchResults.filter((todo: Todo) => {
				if(this.filter === Filters.COMPLETED) {
					return todo.completed
				} else {
					return !todo.completed;
				}
			})
		}

		if(searchResults) {
			searchResults = searchResults.filter((todo: Todo) => {
				const {completionDate, targetDate, name, description } = todo;
				const testObj = {
					completionDate: completionDate ? formatDates(completionDate).toLowerCase() : '',
					targetDate: targetDate ? formatDates(targetDate).toLowerCase() : '',
					name: name.toLowerCase(),
					description: description.toLowerCase()
				};
				return Object.values(testObj).some(val => val.includes(this.searchTerm.toLowerCase()))})
		}

		return searchResults

	}
}