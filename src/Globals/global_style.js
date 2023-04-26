export const reactSelectStyle = {
	control: (base, { isFocused }) => ({
		...base,
		"&:hover": {
			borderColor: isFocused ? "#BE3B41" : "#ced4da",
		},
		boxShadow: isFocused ? "inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0, 0.6)" : 0,
		borderColor: isFocused ? "#BE3B41" : "#ced4da",
	}),
	option: (base, { isFocused }) => ({
		...base,
		"&:active": {
			backgroundColor: isFocused ? "#ffdfe3" : "#ffffff",
		},
		backgroundColor: isFocused ? "#ffdfe3" : "#ffffff",
		color: "#495057"
	}),
}