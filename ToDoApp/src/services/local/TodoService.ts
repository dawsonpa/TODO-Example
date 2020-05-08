import {ITodoService} from "../remote/TodoService";
import CRUDService from "./CRUDService";
import {ITodoEntity} from "../../entities/Todo";

class TodoService extends CRUDService<ITodoEntity > implements ITodoService {

}

export default TodoService
