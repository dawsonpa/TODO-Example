import RemoteTodoService, {ITodoService} from "../remote/TodoService";
import LocalTodoService from '../local/TodoService'
import Todo, {ITodoEntity} from "../../entities/Todo";
import BaseManager from "./BaseManager";

class TodoServiceManager extends BaseManager<ITodoEntity> implements ITodoService {
	constructor() {
		const localService = new LocalTodoService(Todo)
		const remoteService = new RemoteTodoService()
		super(remoteService, localService)
	}

	async createOne(body: ITodoEntity) {
		const service = await this.getService();
		return service.createOne(body);
	}

	async getAll() {
		const service = await this.getService();
		return service.getAll()
	}

	async getOne(id: number | string) {
		const service = await this.getService();
		return service.getOne(id);
	}

	async updateOne(id: number | string, body: ITodoEntity) {
		const service = await this.getService();
		return service.updateOne(id, body);
	}

	async deleteOne(id: number | string) {
		const service = await this.getService()
		return service.deleteOne(id)
	}
}

export default TodoServiceManager


const todoServiceManager = new TodoServiceManager();

export {
	todoServiceManager
}
