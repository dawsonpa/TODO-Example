import React, {FC} from 'react'
import {ITodo} from "../../models/Todo";
import { Card, List, Colors, Text, Button, FAB } from "react-native-paper";
import {useObserver} from "mobx-react-lite";
import {StyleProp, View} from "react-native";
import style from './TodoItemStyle'
import colors from "../../theme/colors";
import {formatDates} from "../../utils/time";

export interface ITodoItemProps extends ITodo {
	late: boolean;
	complete: boolean;
	toggleComplete: () => void;
	onEdit: () => void;
}

export interface IDateRow {
	dateString: string;
	dateTitle: string;
}
const TodoItem: FC<ITodoItemProps> = ({ description, targetDate, completionDate, name, complete, late, toggleComplete, onEdit }) => {
	const color = late ? colors.primary : complete ? Colors.green500 : Colors.grey500;
	const iconName = !complete ? 'circle-outline' : 'checkbox-marked-circle-outline';
	const buttonColor = !complete ? Colors.green500 : colors.primary;

	const DateRow: FC<IDateRow> = ({dateString, dateTitle}) => useObserver( () => (
		<View  style={style.row}>
			<Text style={style.bold} >{dateTitle}</Text>
			<Text>{dateString}</Text>
		</View>
	));

	const ToggleCompleteButton: FC = () => {
		console.log(name, description, 'name descripti')
		const buttonText = !complete ? 'Complete' : 'Reset';
		return useObserver(() => <Button onPress={async () => await toggleComplete()} style={{marginRight: 5}} color={buttonColor} mode={'contained'}>{buttonText}</Button>)
	};

	const EditButton = () => {
		return <FAB small icon='pencil' onPress={onEdit} style={{backgroundColor: Colors.grey600}} color={Colors.grey100}/>
	}

	const DateColumn: FC<> = () => {
		return useObserver(() => (
			<View style={style.column}>
				{targetDate &&<DateRow dateString={targetDate.toString()} dateTitle={'Target Date'}/>}
				{completionDate && <DateRow dateString={completionDate.toString()} dateTitle={'Completion Date'}/>}
			</View>
		))
	};

	return useObserver(() => (
		<Card style={{marginTop: 30, backgroundColor: colors.background}} >
			<Card.Content>
				<List.Accordion
					title={name}
					description={description}
					left={props => <List.Icon {...props}  icon={iconName} color={color}/>}
				>
					<List.Item
						title={'Target Date'}
						description={formatDates(targetDate as Date)}
						left={props => <List.Icon {...props}  icon={'calendar'}/>}
					/>
					{completionDate && <List.Item
						title={'Completion Date'}
						description={formatDates(completionDate as Date)}
						left={props => <List.Icon {...props}  icon={'calendar'}/>}
					/>}

				</List.Accordion>
				<View style={[style.fullWidth, style.justifySpaceBetween, style.row]}>
					<ToggleCompleteButton/>
					<EditButton/>
				</View>
			</Card.Content>
		</Card>
	))
};

export default TodoItem;