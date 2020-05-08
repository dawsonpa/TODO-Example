import React, {useCallback} from 'react'
import {useObserver} from "mobx-react-lite";
import {StackNavigationProp} from '@react-navigation/stack'
import {TodoListNavigationProp} from "../../navigation/NavigationContainer";
import {useStore} from "../../context/TodoListStoreContext";
import TodoList from '../../components/TodoList'
import {TouchableOpacity} from "react-native";
import {ActivityIndicator, RadioButton, Colors, HelperText, Text, Searchbar} from "react-native-paper";
import {View} from "react-native";
import {useFocusEffect} from '@react-navigation/native';

import styles from './TodoScreenStyle'
import {Filters} from "../../stores/TodoListStore";
import colors from "../../theme/colors";

interface ITodoScreenProps {
	navigation: TodoListNavigationProp
}

const TodoScreen: React.FC<ITodoScreenProps> = ({navigation}) => {
	const store = useStore();
	useFocusEffect(
		useCallback(() => {
			(async () => {
				console.log('getting all')
				await store.getAllTodos();
			})()
		},[store.list.length])
	);

	return useObserver(() => (
		<>
			{
				store.list.length && !store.isError && !store.isLoading ?
				<View style={{flex:1, padding: 10, flexDirection: 'column'}}>
					<Searchbar
						style={{marginTop: 5}}
						placeholder={'Search Todos'}
						onChangeText={searchTerm => store.updateSearchTerm(searchTerm)}
						value={store.searchTerm}
					/>
					{store.searchResults.length ? <>
						<TodoList navigation={navigation} todoList={store}/>
					</> :
						<View style={{flex: 1, flexDirection:'row', justifyContent:'center', alignItems: 'center'}}>
							{!store.isLoading && !store.isError &&<HelperText>No Tasks match the given criteria. Please update the filters and/or the search term</HelperText>}
						</View>
					}
					<View style={[styles.bottom, {margin: 20, borderRadius:20, zIndex: 500, paddingRight:10, paddingLeft: 10, backgroundColor:colors.primary, alignItems:'center'}, styles.row, styles.justifySpaceBetween]}>
						<TouchableOpacity onPress={() => store.updateFilter(Filters.ALL)} style={[styles.row, {alignItems: 'center'}] }>
							<Text style={{color: Colors.white}}>No Filter</Text>
							<RadioButton
								value={Filters.ALL}
								status={store.filter === Filters.ALL ? 'checked' : 'unchecked'}
								onPress={() => store.updateFilter(Filters.ALL)}
								color={colors.accent}
							/>
						</TouchableOpacity>
						<TouchableOpacity  onPress={() => store.updateFilter(Filters.COMPLETED)} style={[styles.row, {alignItems: 'center'}] }>
							<Text style={{color: Colors.white}}>Completed</Text>
							<RadioButton
								value={Filters.COMPLETED}
								status={store.filter === Filters.COMPLETED ? 'checked' : 'unchecked'}
								onPress={() => store.updateFilter(Filters.COMPLETED)}
								color={colors.accent}
							/>
						</TouchableOpacity>
						<TouchableOpacity activeOpacity={0.1} onPress={() => store.updateFilter(Filters.INCOMPLETED)} style={[styles.row, {alignItems: 'center'}] }>
							<>
								<Text style={{color: Colors.white}}>Incomplete</Text>
								<RadioButton
									value={Filters.INCOMPLETED}
									status={store.filter === Filters.INCOMPLETED ? 'checked' : 'unchecked'}
									onPress={() => store.updateFilter(Filters.INCOMPLETED)}
									color={colors.accent}
								/>
							</>
						</TouchableOpacity>
					</View>

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
