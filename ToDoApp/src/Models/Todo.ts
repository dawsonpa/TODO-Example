import { observable, action, computed, flow} from "mobx";
import { ToDoService, todoService }  from 'src/Services'
import uuid from 'react-native-uuid'
import BaseService from "../Services/BaseService";

export enum PendingState  {
	PENDING = 'pending',
	DONE = 'done',
	ERROR = 'error'
}

export interface ITodo {
	name?: string;
	description?: string;
	targetDate?: Date | string;
	completionDate?: Date | string;
	state?: PendingState;
	id?: string

}

class Todo {
	readonly id: string;
	service: ToDoService = todoService;

	@observable name: string = '';
	@observable description: string='';
	@observable targetDate: Date | null = null;
	@observable completionDate: Date | null = null;
	@observable state: PendingState = PendingState.DONE;

	constructor(todo: ITodo) {
		this.updateTodo(todo);
		const { id } = todo;
		if(id) {
			this.id = id;
		} else {
			this.id = uuid.v1();
		}
	}

	@action
	updateState = (state: PendingState) => {
		this.state = state;
	};

	@action
	updateTargetDate = (targetDate: Date | string) => {
		this.targetDate = new Date(targetDate);
	};

	@action
	updateCompletionDate = (completionDate: Date | string) => {
		this.completionDate = new Date(completionDate);
	};

	@action
	updateName = (name: string) => {
		this.name = name;
	};
	@action
	updateDescription = (description: string) => {
		this.description = description;
	};
	@action
	updateTodo = (updatedTodo: ITodo) => {
		const {
			name,
			description,
			completionDate,
			targetDate
		} = updatedTodo;
		if(completionDate) {
			this.updateCompletionDate(completionDate)
		}

		if(description) {
			this.updateDescription(description);
		}

		if(name) {
			this.updateName(name);
		}

		if(targetDate) {
			this.updateTargetDate(targetDate);
		}
	};
	@computed
	get completed() {
		return !!this.completionDate;
	}

	@computed
	get late(): boolean {
		return this.completionDate && this.targetDate && this.completionDate.getTime() < this.targetDate.getTime() ? true : false;
	}

}

export default Todo