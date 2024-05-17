import React from "react"
import styles from "./GradingProtocolsRows.module.css"
import TechniqueCard from "../Common/Technique/TechniqueCard/TechniqueCard"

export default function GradingProtocolsRows({ data,chosenProtocol }) {
	return (
		<div className={styles.container}>
			{data.map((category, index) => (
				<div key={index} className={styles.category}>
					<h3>{category.name}</h3>
					<ul className={styles.techniques}>
						{category.techniques.map((technique, idx) => (
							<TechniqueCard key={idx} technique={technique} />
                        
						))}
					</ul>
				</div>
			))}
		</div>
	)
}
