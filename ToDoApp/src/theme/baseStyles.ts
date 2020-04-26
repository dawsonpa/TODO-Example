import {StyleSheet} from "react-native";

const baseStyles = StyleSheet.create({
	row: {
		flexDirection: 'row'
	},
	column: {
		flexDirection: 'column'
	},
	bottom: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
	},
	bold: {
		fontWeight: 'bold'
	},
	fullWidth: {
		width: '100%'
	},
	justifySpaceBetween: {
		justifyContent: 'space-between'
	},
	justifyEnd: {
		justifyContent: 'flex-end'
	},
	marginBottom: {
		marginBottom: 5
	}
});

export default baseStyles