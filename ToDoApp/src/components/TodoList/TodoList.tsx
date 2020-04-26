import React, {FC} from 'react';

import TodoListStore from '../../stores/TodoListStore'
import Todo from '../../models/Todo'
import { TodoListNavigationProp } from "../../navigation/NavigationContainer";
import TodoItem from '../TodoItem/'
import {EDIT_TODO_ROUTE} from "../../navigation/routes";
import {useObserver} from "mobx-react-lite";
import {FlatList} from "react-native";

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
		<FlatList
			style={{marginBottom: 60, paddingBottom: 10}}
			data={todoList.searchResults}
			renderItem={({item}) => (
				<TodoListItem todo={item}/>
			)}
		/>
	))
};

export default TodoList