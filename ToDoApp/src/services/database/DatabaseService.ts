import {ConnectionOptions, ConnectionManager, createConnection, getConnection} from "typeorm";
import TodoSchema from "../../entities/Todo";
import databaseConfig, {TODO_DB_CONNECTION_NAME} from "../../config/database";

class DatabaseService {
	connectionManager: ConnectionManager;
	constructor() {
		this.connectionManager = new ConnectionManager();
	}

	async connect(){
		const connectOptions: ConnectionOptions = {
			...databaseConfig,
			entities: [TodoSchema],
			logging: ['error', 'query', 'schema'],
		}
		return createConnection(connectOptions)
	}

	get isConnected(): boolean {
		let isConnected = false
		try {
			isConnected = getConnection(TODO_DB_CONNECTION_NAME).isConnected
		} catch (e) {}
		return isConnected;
	}

	async refreshConnection() {
		if(this.isConnected) {
			try {
				await getConnection(TODO_DB_CONNECTION_NAME).close()
			}catch (e) {}
		}
		try {
			const connect = await this.connect()
			await connect.synchronize();
		} catch(e) {}
	}

	async reconnect () {
		if(!this.isConnected) {
			console.log('trying to reconnect')
			try {
				const connect = await this.connect()
				await connect.synchronize()
			} catch (e) {}
		}
	}
}

export default  DatabaseService;

const databaseService = new DatabaseService();

export {
	databaseService
}
