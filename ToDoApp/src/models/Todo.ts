import { observable, action, computed} from "mobx";
import { ToDoService, todoService }  from '../services'
import {ITodoEntity} from "../entities/Todo";

export enum PendingState  {
	PENDING = 'pending',
	DONE = 'done',
	ERROR = 'error'
}

export interface ITodo extends ITodoEntity {
	name?: string;
	description?: string;
	targetDate?: Date ;
	completionDate?: Date;
	state?: PendingState;
	id: number

}

class Todo implements ITodo {
	id: number;
	service: ToDoService = todoService;

	@observable name: string = '';
	@observable description: string='';
	@observable targetDate?: Date;
	@observable completionDate?: Date
	@observable state: PendingState = PendingState.DONE;

	constructor(todo: ITodoEntity) {
		this.id = todo.id || Math.floor(Math.random() * 100)
		this.updateTodo(todo);
	}

	@action
	updateState = (state: PendingState) => {
		this.state = state;
	};

	@action
	updateTargetDate = (targetDate: Date | string | null) => {
		if(targetDate) {
			this.targetDate = new Date(targetDate);
		} else {
			this.targetDate = undefined;
		}
	};

	@action
	updateCompletionDate = (completionDate: Date | string | null) => {
		if(completionDate) {
			this.completionDate = new Date(completionDate);
		} else {
			this.completionDate = undefined;
		}
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
	updateTodo = (updatedTodo: ITodoEntity) => {
		const {
			name,
			description,
			completionDate,
			targetDate,
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
	@action
	toggleComplete = () => {
		const completionDate = this.completionDate ? null : new Date();
		this.updateCompletionDate(completionDate)
	}
	@computed
	get completed() {
		return !!this.completionDate;
	}

	@computed
	get late(): boolean {
		const currentDate = new Date();
		if(!this.completionDate && this.targetDate) {
			return currentDate.getTime() > this.targetDate.getTime()
		}
		return this.completionDate && this.targetDate && this.completionDate.getTime() > this.targetDate.getTime() ? true : false;
	}
}

export default Todo
