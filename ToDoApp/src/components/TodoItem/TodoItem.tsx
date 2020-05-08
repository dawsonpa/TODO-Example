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
	const buttonColor = !complete ? Colors.green500 : colors.accent;

	const ToggleCompleteButton: FC = () => {
		const buttonIcon = !complete ? 'playlist-check' : 'undo';
		return useObserver(() => <FAB small  icon={buttonIcon} onPress={async () => await toggleComplete()}  style={{backgroundColor: buttonColor}} color={Colors.white}/>)
	};
	const EditButton = () => {
		return <FAB small icon='pencil' onPress={onEdit} style={{backgroundColor: Colors.grey500, marginRight: 5}} color={Colors.white} />
	}
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
				<View style={[style.fullWidth, {justifyContent: 'flex-end'}, style.row]}>
					<EditButton/>
					<ToggleCompleteButton/>
				</View>
			</Card.Content>
		</Card>
	))
};

export default TodoItem;
