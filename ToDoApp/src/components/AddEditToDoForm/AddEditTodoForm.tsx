import React, {FC, useState} from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import {Button, Colors, Subheading, TextInput} from "react-native-paper";
import Todo, {ITodo} from "../../models/Todo";
import styles from './AddEditTodoFormStyle'
import {View, KeyboardAvoidingView} from "react-native";
import {useObserver} from "mobx-react-lite";
import {useStore} from "../../context/TodoListStoreContext";

interface IAddEditTodoFormProps {
	addTodo: (todo: ITodo) => Promise<void>;
	editTodo: (updatedTodo: ITodo, todo: Todo) => Promise<void>
	deleteTodo: (todo: Todo) => Promise<void>
	goBack: () => void;
	edit: boolean;
	todo?: Todo;
}

const AddEditTodoForm: FC<IAddEditTodoFormProps> = ({ edit, addTodo,editTodo,deleteTodo, todo, goBack }) => {
	const store = useStore();

	const [description, setDescription] = useState(edit && todo ? todo.description : '');
	const [name, setName] = useState(edit && todo ? todo.name : '');
	const [targetDate, setTargetDate] = useState(edit && todo && todo.targetDate ? todo.targetDate: new Date());
	const [completionDate, setCompletionDate] = useState(edit && todo && todo.completionDate ? todo.completionDate : new Date());
	const onSave= async () => {
		const newTodo: ITodo = {
			name,
			description,
			targetDate
		};
		if(edit && todo) {
			newTodo.id = todo.id;
			if(todo.completed) {
				newTodo.completionDate = completionDate;
			}
			await store.updateTodo(newTodo, todo);
		} else {
			await store.addTodo(newTodo);
		}

		goBack();

	};

	 const onDelete = async () => {
	 	if(edit && todo) {
			await store.removeTodo(todo)
		}

	 	goBack();
	 };
	return useObserver(() => (
		<KeyboardAvoidingView style={[styles.fullWidth, styles.column]}>
			<TextInput
				label={'Name'}
				value={name}
				onChangeText={text => setName(text)}
			/>
			<TextInput
				label={'Description'}
				value={description}
				onChangeText={text => setDescription(text)}
			/>
			<Subheading>Target Date</Subheading>
			<TextInput
				style={{height: 50}}
				render={() =>
					<DateTimePicker
						display='spinner'
						value={targetDate}
						onChange={(event, date) => {if (date) setTargetDate(date)}}
					/>
				}
			/>
			{edit && todo && todo.completed  ? <TextInput
					label={'Completion Date'}
					render={() =>
						<DateTimePicker
							display='spinner'
							value={completionDate}
							onChange={(event, date) => {if (date) setCompletionDate(date)}}

						/>
					}
				/> :
				<TextInput
					label={'Completion Date'}
					value={edit && todo && todo.completed ? completionDate.toISOString() : '--'}
					editable={false}
				/>
			}
			<View style={[styles.row, styles.justifySpaceBetween, styles.fullWidth]}>

			</View>
			<View style={[styles.row, styles.justifySpaceBetween, styles.fullWidth]}>


			</View>
			<View style={[styles.row,styles.justifyEnd, styles.fullWidth]}>
				<Button mode={'contained'} onPress={onDelete} color={Colors.red100}>
					Delete
				</Button>
				<Button onPress={goBack} mode={'contained'} color={Colors.grey100}>
					Cancel
				</Button>
				<Button mode={'contained'} onPress={onSave} color={Colors.green100}>
					Save
				</Button>
			</View>
		</KeyboardAvoidingView>
	))
};

export default AddEditTodoForm;