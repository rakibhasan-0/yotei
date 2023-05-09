import "./Spinner.css"

/**
 * An indicator for the loading state.
 * 
 * Props:
 *     id (optional) @type {string}  - An id used for testing.
 *
 * Example usage:
 *     <Spinner id="test-id"/>
 *
 * @author Team Medusa
 * @version 1.0
 * @since 2023-05-05
 */
function Spinner({ id }) {
	return (
		<svg
			className="spinner-spinner"
			width="45"
			height="45"
			viewBox="0 0 45 45"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			id={id ? id : ""}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M22.5 43C22.5 44.1046 21.6015 45.0093 20.5012 44.9124C9.0111 43.901 0 34.2528 0 22.5C0 10.0736 10.0736 0 22.5 0C34.2528 0 43.901 9.0111 44.9124 20.5012C45.0093 21.6015 44.1046 22.5 43 22.5V22.5C41.8954 22.5 41.0114 21.6014 40.8935 20.5032C39.8977 11.225 32.0426 4 22.5 4C12.2827 4 4 12.2827 4 22.5C4 32.0426 11.225 39.8977 20.5032 40.8935C21.6014 41.0114 22.5 41.8954 22.5 43V43Z"
				fill="#B4B4B4"
			/>
		</svg>
	)
}
export default Spinner
