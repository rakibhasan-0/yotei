import React from "react"
import style from "./FlowChartNode.module.css"
const FlowChartNode = ({onClick, id, name, selected, color, ref}) => {

	return (
		<button 
			id={id} 
			type="button" 
			onClick={onClick}
			className={style.node}
			style={{ backgroundColor: selected ? "#fff" : color }}
			ref={ref}
		>
			{name}
		</button>
	)
}
export default FlowChartNode

