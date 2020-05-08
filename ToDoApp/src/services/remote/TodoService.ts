import RestService, {IRestService} from "./RestService";
import TodoSchema, {ITodoEntity} from "../../entities/Todo";

export interface ITodoService extends IRestService<ITodoEntity>{

}
class TodoService extends RestService<ITodoEntity> implements ITodoService {
	constructor() {
		super(TodoSchema, 'todos');
	}
}


export default TodoService
