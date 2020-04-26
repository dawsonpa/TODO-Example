import React, {FC, useState} from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import {Button, Colors, Subheading, TextInput, FAB} from "react-native-paper";
import Todo, {ITodo} from "../../models/Todo";
import styles from './AddEditTodoFormStyle'
import {View, KeyboardAvoidingView, ScrollView} from "react-native";
import {useObserver} from "mobx-react-lite";
import {useStore} from "../../context/TodoListStoreContext";
import colors from "../../theme/colors";

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
		<KeyboardAvoidingView style={[styles.fullWidth, styles.column, {flex: 1}]}>
			<View style={[styles.row,styles.justifyEnd, styles.fullWidth, styles.marginBottom]}>
				<FAB icon={'delete'} onPress={onDelete} style={{backgroundColor: colors.primary, marginRight: 10}}/>
				<FAB  icon={'content-save'}  onPress={onSave} style={{backgroundColor: Colors.green500}}/>
			</View>
			<ScrollView>
				<TextInput
					label={'Name'}
					value={name}
					onChangeText={text => setName(text)}
					style={styles.marginBottom}
				/>
				<TextInput
					label={'Description'}
					value={description}
					onChangeText={text => setDescription(text)}
					style={styles.marginBottom}
				/>
				<Subheading>Target Date</Subheading>
				<TextInput
					style={styles.marginBottom}
					render={() =>
						<DateTimePicker
							display='spinner'
							value={targetDate}
							onChange={(event, date) => {if (date) setTargetDate(date)}}
						/>
					}
				/>
				{edit && todo && todo.completed  ? <>
						<Subheading>Completion Date</Subheading>
						<TextInput
							style={styles.marginBottom}
							render={() =>
								<DateTimePicker
									display='spinner'
									value={completionDate}
									onChange={(event, date) => {if (date) setCompletionDate(date)}}
								/>
							}
						/></> :
					<TextInput
						label={'Completion Date'}
						style={styles.marginBottom}
						value={edit && todo && todo.completed ? completionDate.toISOString() : '--'}
						editable={false}
					/>
				}
			</ScrollView>
		</KeyboardAvoidingView>
	))
};

export default AddEditTodoForm;