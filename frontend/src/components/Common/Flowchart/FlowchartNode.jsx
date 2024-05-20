
import styles from "./FlowChartNode.module.css"



const FlowChartNode = ({onClick, id, name, selected, ref}) => {

	return (
		<button 
			id={id} 
			type="button" 
			onClick={onClick} 
			className={styles.node}
			color={selected ? {"backgroundColor": "#fff"} : {"backgroundColor": "blue"}}
			ref={ref}
		>
			{name}
		</button>
	)
}
export default FlowChartNode