import React from "react"
import styles from "./GradingProtocolsRows.module.css"
import TechniqueCard from "../Common/Technique/TechniqueCard/TechniqueCard"

export default function GradingProtocolsRows({ data, beltColors }) {
	return (
		<div className={styles.container}>
			{data.map((category, index) => (
				<div key={index} className={styles.category}>
					<h3>{category.name}</h3>
					<ul className={styles.techniques}>
						{category.techniques.map((technique, idx) => {
							// Add the "type" attribute and set it to 'technique' this is to differentiate between techniques and exercises which is needed by technique card module.
							//Everything is a technique in the grading protocol. So it is set to 'technique' for all.
							const updatedTechnique = { 
								...technique, 
								beltColors, 
								type: "technique" // Add the new attribute
							}
							return (
								<TechniqueCard key={idx} technique={updatedTechnique} checkbox={false} id={updatedTechnique.activity_id} />
							)
						})}
					</ul>
				</div>
			))}
		</div>
	)
}
