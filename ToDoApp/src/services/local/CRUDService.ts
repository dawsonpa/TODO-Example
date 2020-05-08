import {BaseEntity, getRepository, EntitySchema, Connection, Repository, getConnection} from "typeorm";
import {IRestService} from "../remote/RestService";
import DatabaseService, {databaseService} from "../database/DatabaseService";
import {TODO_DB_CONNECTION_NAME} from "../../config/database";

class CRUDService<T> implements IRestService<T> {
	entity: EntitySchema<T>
	databaseService: DatabaseService


	constructor(entity: EntitySchema<T>) {
		this.entity = entity
		this.databaseService = databaseService
	}

	async createOne(body: T) {
		console.log(body, 'body')
		await this.databaseService.reconnect();
		const repo = this.getRepository
		const result = await repo.save(body)
		console.log(result, 'result')
		return result;
	}

	async getAll() {
		console.log('gettting it agaom')
		await this.databaseService.reconnect();
		const repo = this.getRepository

		const result = await repo.find()
		console.log(result, 'result');
		return result;
	}

	async getOne(id: string | number) {
		await this.databaseService.reconnect();
		const repo = this.getRepository
		return repo.findOne(id)
	}

	async updateOne(id: string | number, body: T) {
		await this.databaseService.reconnect();
		const repo = this.getRepository
		const old = repo.findOne(id)
		const updated = {...old, ...body}
		await repo.save(updated);
		return this.getOne(id)
	}

	async deleteOne(id: string | number) {
		await this.databaseService.reconnect();
		const repo = this.getRepository
		await repo.delete(id)
		return 'deleted'
	}

	get getRepository(): Repository<T> {
		return getConnection(TODO_DB_CONNECTION_NAME).getRepository(this.entity)
	}
}

export default CRUDService
