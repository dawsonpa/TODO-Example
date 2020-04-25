import BaseService from "./BaseService";
import {ITodo} from "../models/Todo";

export const TODOS_KEY = '@todos';

export default class ToDoService extends BaseService {
	readonly storageKey: string = TODOS_KEY;
	constructor(storageKey?: string) {
		super();
		if(storageKey) {
			this.storageKey = storageKey;
		}
	}

	async createToDo(val: ITodo) {
		console.log('begining to create', val, 'vall');
		const todos = await this.getAllToDos();
		console.log(todos, 'todont')
		todos.push(val);
		const result = await this.create(this.storageKey, JSON.stringify(todos));
		console.log(result, 'res')
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
		const result = await this.get(this.storageKey);
		console.log(result, 'all');
		const todos = result ? JSON.parse(result): [];
		console.log(todos, 'after');
		return todos;

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

		const result = await this.create(this.storageKey, JSON.stringify(updatedTodos));
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