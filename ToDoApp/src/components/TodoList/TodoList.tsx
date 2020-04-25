import React, {FC} from 'react';
import TodoListStore from '../../stores/TodoListStore'
import Todo from '../../models/Todo'
import { TodoListNavigationProp } from "../../navigation/NavigationContainer";
import TodoItem from '../TodoItem/'
import {EDIT_TODO_ROUTE} from "../../navigation/routes";
import {useObserver} from "mobx-react-lite";

interface ITodoListProps {
	todoList: TodoListStore,
	navigation: TodoListNavigationProp
}

interface ITodoListItemProps {
	todo: Todo
}
const TodoList: FC<ITodoListProps> = ({ todoList, navigation}) => {

	const TodoListItem: FC<ITodoListItemProps> = ({ todo }) => {
		const {
			completed,
			completionDate,
			targetDate,
			description,
			late,
			name,
		} = todo;

		const onEdit = () => {
			navigation.navigate(EDIT_TODO_ROUTE, { todo, edit: true })
		};

		const toggleComplete = async () => {
			await todoList.toggleComplete(todo)
		}

		return useObserver(() =>
			<TodoItem
				toggleComplete={toggleComplete}
				completionDate={completionDate}
				targetDate={targetDate}
				complete={completed}
				name={name}
				description={description}
				late={late}
				onEdit={onEdit}
			/>
		)
	};

	return useObserver(() =>(
		<>
			{
				todoList.list.map((todo: Todo) => <TodoListItem todo={todo}/> )
			}
		</>
	))
};

export default TodoList