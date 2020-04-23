import BaseService from "./BaseService";
import {ITodo} from "../Models/Todo";

export const TODOS_KEY = '@todos'

export default class ToDoService extends BaseService {
	readonly storageKey: string = TODOS_KEY;
	constructor(storageKey?: string) {
		super();
		if(storageKey) {
			this.storageKey = storageKey;
		}
	}

	async createToDo(val: ITodo) {
		const todos = await this.getAllToDos();
		todos.push(val);
		const result = await this.update(this.storageKey, JSON.stringify(todos));
		const updatedTodos = JSON.parse(result);
		const updatedToDo = updatedTodos.find(((todo: ITodo) => todo.id ===val.id));
		return updatedToDo;
	}

	async getToDo(id: string) {
		const todos = await this.getAllToDos();
		if(todos.length) {
			return todos.find((todo: ITodo) => todo.id === id)
		}
		throw new Error(`Todo with ${id} does not exists`)
	}

	async getAllToDos() {
		const todos = await this.get(this.storageKey);
		return typeof todos === 'string' ? JSON.parse(todos): []
	}

	async updateToDo(val: ITodo) {
		const todos = await this.getAllToDos();
		const todo = todos.find((todo: ITodo) => todo.id === val.id);
		const updatedTodo = Object.assign(todo, val);
		const updatedTodos = todos.map((todo: ITodo) => {
			if(todo.id === val.id) {
				return updatedTodo;
			}
			return todo;
		})

		const result = await this.update(this.storageKey, JSON.stringify(updatedTodos));
		const resultTodos = JSON.parse(result);
		const updatedToDo = resultTodos.find(((todo: ITodo) => todo.id === val.id));
		return updatedToDo;
	}

	async deleteTodo(id: string) {
		const todos = await this.getAllToDos();
		const updatedTodos = todos.filter((todo: ITodo) => todo.id !== id);
		const result = await this.update(this.storageKey, JSON.stringify(updatedTodos));
		return JSON.parse(result);
	}

}

const todoService = new ToDoService();

export {
	todoService
}