import React, {FC} from 'react';
import  {NavigationContainer as NativeNavigationContainer, RouteProp} from '@react-navigation/native';
import {createStackNavigator, StackNavigationProp} from '@react-navigation/stack';
import {Appbar} from "react-native-paper";
import TodoScreen from '../screens/TodoScreen'
import AddEditTodoScreen from '../screens/AddEditTodoScreen'
import {
	ADD_TODO_ROUTE,
	ADD_TODO_TITLE,
	EDIT_TODO_ROUTE,
	EDIT_TODO_TITLE,
	TODO_LIST_ROUTE,
	TODO_LIST_TITLE
} from "./routes";
import Todo from "../models/Todo";
import {useObserver} from "mobx-react-lite";

export type RootStackParamList = {
	TodoList: undefined,
	AddTodo: {edit: boolean, todo?: Todo},
	EditTodo: {edit: boolean, todo: Todo}
}

const Stack = createStackNavigator<RootStackParamList>();
interface IHeader {
	navigation: TodoListNavigationProp;
}

interface IAddEditHeader {
	edit?: boolean
	navigation: AddEditTodoNavigationProp
}
const NavigationContainer: React.FC =() => {
	const ListHeader: FC<IHeader> =({navigation}) => {
		return(
			<Appbar.Header>
				<Appbar.Content
					title="Todo List"
					subtitle="Keep track of your task as you complete them"
				/>
				<Appbar.Action icon="plus" onPress={() => navigation.navigate(ADD_TODO_ROUTE)} />
			</Appbar.Header>
		)

	};

	const AddEditHeader: FC<IAddEditHeader> = ({navigation, edit}) => {
		return (
			<Appbar.Header>
				<Appbar.BackAction
					onPress={navigation.goBack}
				/>
				<Appbar.Content
					title={edit ? 'Edit Todo' : 'Create Todo'}
					subtitle={edit ? 'Update a task.' : 'Create a new task.'}
				/>
			</Appbar.Header>
		)

	};

	return useObserver(() => (
		<NativeNavigationContainer>
			<Stack.Navigator initialRouteName={TODO_LIST_ROUTE}>
				<Stack.Screen
					options={(props) =>({
						headerTitleText: TODO_LIST_TITLE,
						header:() => <ListHeader navigation={props.navigation}/>
					})}
					key={TODO_LIST_ROUTE}
					name={TODO_LIST_ROUTE}
					component={TodoScreen}
				/>
				<Stack.Screen
					options={(props) =>({
						headerTitleText: ADD_TODO_TITLE,
						header: () => <AddEditHeader edit={false} navigation={props.navigation}/>
					})}
					initialParams={{edit: false}}
					key={ADD_TODO_ROUTE}
					name={ADD_TODO_ROUTE}
					component={AddEditTodoScreen}
				/>
				<Stack.Screen
					options={(props: IAddEditHeader) =>({
						headerTitleText: EDIT_TODO_TITLE,
						header: () => <AddEditHeader edit={true} navigation={props.navigation}/>
					})}
					initialParams={{edit: true}}
					key={EDIT_TODO_ROUTE}
					name={EDIT_TODO_ROUTE}
					component={AddEditTodoScreen}
				/>
			</Stack.Navigator>
		</NativeNavigationContainer>
	))
};

export default NavigationContainer

// @ts-ignore
export type TodoListNavigationProp = StackNavigationProp<RootStackParamList, TODO_LIST_ROUTE>
// @ts-ignore
export type AddTodoNavigationProp = StackNavigationProp<RootStackParamList, ADD_TODO_ROUTE>
// @ts-ignore
export type AddTodoRouteProp = RouteProp<RootStackParamList, ADD_TODO_ROUTE>
// @ts-ignore
export type EditTodoNavigationProp = StackNavigationProp<RootStackParamList, EDIT_TODO_ROUTE>
//@ts-ignore
export type EditTodoRouteProp = RouteProp<RootStackParamList, EDIT_TODO_ROUTE>

export type AddEditTodoNavigationProp = AddTodoNavigationProp | EditTodoNavigationProp
export type AddEditRouteProp = AddTodoRouteProp | EditTodoRouteProp;

export interface IAddEditNavigationProps {
	navigation: AddEditTodoNavigationProp
	route: AddEditRouteProp;
}