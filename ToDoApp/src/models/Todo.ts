import { observable, action, computed} from "mobx";
import { ToDoService, todoService }  from '../services'

export enum PendingState  {
	PENDING = 'pending',
	DONE = 'done',
	ERROR = 'error'
}

export interface ITodo {
	name?: string;
	description?: string;
	targetDate?: Date | string | null;
	completionDate?: Date | string | null;
	state?: PendingState;
	id?: string

}

class Todo {
	id: string;
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
			this.id = new Date().getTime().toString()
		}
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
			this.targetDate = null;
		}
	};

	@action
	updateCompletionDate = (completionDate: Date | string | null) => {
		if(completionDate) {
			this.completionDate = new Date(completionDate);
		} else {
			this.completionDate = null;
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