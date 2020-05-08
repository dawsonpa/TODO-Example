import {ConnectionOptions} from 'typeorm'
export const TODO_DB_CONNECTION_NAME = 'todo-connection'
const databaseConfig: ConnectionOptions = {
	type: 'react-native',
	database: 'todoDB',
	location: 'default',
	name: TODO_DB_CONNECTION_NAME
}

export default databaseConfig
