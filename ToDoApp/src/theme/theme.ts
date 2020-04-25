import { Theme, DefaultTheme } from "react-native-paper";
import colors from "./colors";

const theme: Theme = {
	...DefaultTheme,
	dark: true,
	colors: {
		...DefaultTheme.colors,
		primary: colors.primary,
		accent: colors.accent,
		background: colors.background
	}
};

export default theme;