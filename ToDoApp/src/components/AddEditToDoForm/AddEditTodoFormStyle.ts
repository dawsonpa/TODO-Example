import {StyleSheet} from "react-native";
import baseStyles from '../../theme/baseStyles'

const styles = StyleSheet.create({
	...baseStyles,
	buttonGroup: {
		justifyContent: 'space-between',
		width: '40%'
	}
});

export default styles