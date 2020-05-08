import {action, computed, observable, runInAction, toJS} from "mobx";
import Todo, {PendingState} from "../models/Todo";
import {formatDates} from "../utils/time";
import TodoServiceManager, {todoServiceManager} from "../services/managers/TodoServiceManager";
import {ITodoEntity} from "../entities/Todo";

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
	service: TodoServiceManager = todoServiceManager;
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
	addTodo = async (todo: ITodoEntity) => {
		try {
			this.updateState(PendingState.PENDING);
			console.log(todo, 'hello')
			const created = await this.service.createOne(todo);
			console.log(created, 'created')
			runInAction(() => {
				if(created) {
					const newTodo = new Todo(created);
					this.list.push(newTodo);
				}
				this.updateState(PendingState.DONE);
			})
		} catch (e) {
			console.log(e, 'ererer')
			runInAction(() => {
				this.updateState(PendingState.ERROR);
			})
		}
	};

	@action
	removeTodo = async (todo: Todo) => {
		try {
			this.updateState(PendingState.PENDING);
			await this.service.deleteOne(todo.id);
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
			const todos: ITodoEntity[] | undefined = await this.service.getAll();
			console.log(todos, 'todos')
			runInAction(() => {
				if(todos && todos.length) {
					const newTodos: Todo[] = [];
					todos.forEach((todo: ITodoEntity) => {
						if(todo.id) {
							newTodos.push(new Todo(todo))
						}
					});
					this.list = newTodos;
				}
				this.updateState(PendingState.DONE)
			})
		} catch(e) {
			console.log(e, 'errorereererrrere')
			runInAction(() => {
				this.updateState(PendingState.ERROR);
			})
		}
	};
	@action
	updateTodo = async (updatedTodo: ITodoEntity, oldTodo: Todo) => {
		try {
			this.updateState(PendingState.PENDING);
			if(oldTodo.id) {
				const created = await this.service.updateOne(oldTodo.id, updatedTodo);
				runInAction(() => {
					this.list.map((todo: Todo) => {
						if(oldTodo.id === todo.id && created) {
							todo.updateTodo(created);
						}
					});
					this.updateState(PendingState.DONE);
				})
			}
			this.updateState(PendingState.DONE);
		} catch (e) {
			runInAction(() => {
				this.updateState(PendingState.ERROR);

			})
		}
	};
	@action
	toggleComplete = async (todo: Todo) => {
		todo.toggleComplete();
		const updatedTodo: ITodoEntity = toJS(todo);
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
