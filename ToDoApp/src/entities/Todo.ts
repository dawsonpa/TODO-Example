import { EntitySchema } from "typeorm";
import BaseColumnSchemaPart, { IBase } from "./Parts/Base";

export interface ITodoEntity extends IBase {
	description?: string,
	name?: string,
	targetDate?: Date,
	completionDate?: Date
}

const TodoSchema = new EntitySchema<ITodoEntity>({
	name: 'todo',
	tableName: 'todo',
	columns: {
		...BaseColumnSchemaPart,
		description: {
			type: String,
		},
		name: {
			type: String
		},
		targetDate: {
			type: Date
		},
		completionDate: {
			type: Date,
			nullable: true
		}
	}

})


export default TodoSchema
