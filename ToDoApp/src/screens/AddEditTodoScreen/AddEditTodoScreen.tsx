import React from 'react'
import AddEditTodoForm from '../../components/AddEditToDoForm'
import {useStore} from "../../context/TodoListStoreContext";
import {IAddEditNavigationProps} from "../../navigation/NavigationContainer";
import {useObserver} from "mobx-react-lite";
import {View} from "react-native";
const AddEditTodoScreen: React.FC<IAddEditNavigationProps> = ({navigation, route}) => {
	const store = useStore();

	// @ts-ignore
	const { edit } = route.params;
	// @ts-ignore
	const { todo } = route.params;
	return useObserver(() =>(
		<View style={{flex: 1, padding: 10}}>
			<AddEditTodoForm
				addTodo={store.addTodo}
				editTodo={store.updateTodo}
				deleteTodo={store.removeTodo}
				goBack={navigation.goBack}
				edit={edit}
				todo={todo}
			/>
		</View>

	))
};


export default AddEditTodoScreen;