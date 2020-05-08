import {EntitySchemaColumnOptions} from "typeorm";
export interface IBase {
	id: number,
	createdAt?: Date,
	updatedDate?: Date
}
const BaseColumnSchemaPart = {
	id: {
		type: Number,
		primary: true,
		generated: true,
	} as EntitySchemaColumnOptions,
	createdAt: {
		name: 'created_at',
		type: Date,
		createDate: true,
	} as EntitySchemaColumnOptions,
	updatedAt: {
		name: 'updated_at',
		type: Date,
		updateDate: true,
	} as EntitySchemaColumnOptions,
};

export default BaseColumnSchemaPart
