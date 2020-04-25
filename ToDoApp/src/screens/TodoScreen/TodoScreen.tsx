import React, {useCallback} from 'react'
import {useObserver} from "mobx-react-lite";
import {StackNavigationProp} from '@react-navigation/stack'
import { TodoListNavigationProp } from "../../navigation/NavigationContainer";
import { useStore } from "../../context/TodoListStoreContext";
import TodoList from '../../components/TodoList'
import {Title, HelperText, ActivityIndicator} from "react-native-paper";
import {View} from "react-native";
import { useFocusEffect } from '@react-navigation/native';

interface ITodoScreenProps {
	navigation: TodoListNavigationProp
}

const TodoScreen: React.FC<ITodoScreenProps> = ({navigation}) => {
	const store = useStore();
	useFocusEffect(
		useCallback(() => {
			(async () => {
				console.log('immmredrdder get all todosdssds');
				await store.getAllTodos();
			})()
		},[store.list.length])
	)

	return useObserver(() => (
		<>
			{
				store.list.length && !store.isError && !store.isLoading ?
				<View style={{flex:1, padding: 10, flexDirection: 'column'}}>
					<TodoList navigation={navigation} todoList={store}/>
				</View>
					:
					<View style={{flex: 1, padding: 10, flexDirection:'row', justifyContent:'center', alignItems: 'center'}}>
						{!store.isLoading && !store.isError &&<HelperText>No Tasks. Please use the + to create a new task</HelperText>}
						{store.isLoading && !store.isError && <ActivityIndicator/>}
					</View>
			}
		</>

	))
};


export default TodoScreen;