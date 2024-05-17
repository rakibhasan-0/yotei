import React from "react"
import styles from "./GradingProtocolsRows.module.css"

export default function GradingProtocolsRows({ data }) {
	return (
		<div className={styles.container}>
			{data.map((category, index) => (
				<div key={index} className={styles.category}>
					<h3>{category.name}</h3>
					<ul className={styles.techniques}>
						{category.techniques.map((technique, idx) => (
							<li key={idx}>{technique.name}</li>
						))}
					</ul>
				</div>
			))}
		</div>
	)
}
