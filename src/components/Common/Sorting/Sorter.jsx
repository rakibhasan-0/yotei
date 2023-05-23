import React,{ useEffect, useState } from "react"
import Component from "../List/Dropdown"
import style from "./Sorter.module.css"
import "../BeltPicker/BeltPicker.module.css"

function Sorter ({ id, children, defaultSort ,onSortChange }) {
	const [selectedOption, setSelectedOption] = useState(defaultSort || "")
    
	const handleChildClick = (item) => {
		console.log("Item: " + item)
		setSelectedOption(item)
	}

	useEffect(() => {
		onSortChange(selectedOption)
	}, [selectedOption])

	return (
		<Component
			text={
				<h2 style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop:"5px"}}>
                Sortera efter:
					<span className={style.sortText} style={{ marginLeft:"4px" }}>
						{selectedOption ? selectedOption : children[0]}
					</span>
				</h2>}
			id={id}
			onClick={() => handleChildClick(selectedOption)}
		>
			<div className={style.sort}>
				{React.Children.map(children, (child, index) => {
					const optionText = child.props.children

					// Check if it's the first option when selectedOption is null or empty
					const isCurrentOption =
                        optionText === selectedOption ||
                        (!selectedOption && index === 0 && !defaultSort)
                              
					return (
						<div
							key={index}
							className={`${style.sortItem} ${
								isCurrentOption ? style.currentOption : ""
							}`}
							onClick={() => handleChildClick(optionText)}
						>
							<span>{optionText}</span>
						</div>
					)
				})}
			</div>
		</Component>
	)
}

export default Sorter
