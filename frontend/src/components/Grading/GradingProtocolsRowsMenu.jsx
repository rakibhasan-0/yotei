import React from "react"
import styles from "./GradingProtocolsRowsMenu.module.css" // Import CSS styles

export default function GradingProtocolsRowsMenu({ protocols, onSelectRow }) {
	return (
		<div className={styles["grading-protocols-rows"]}> {/* Apply CSS class */}
			{protocols && protocols.length > 0 ? (
				protocols.map((protocol, index) => (
					<div key={index} className={styles["grading-protocol-row"]} onClick={() => onSelectRow(protocol)}> {/* Apply CSS class */}
						{protocol}
					</div>
				))
			) : (
				<p>Inga graderingsprotokoll tillgängliga</p>
			)}
		</div>
	)
}
