import React, { useState } from "react"
import ExamineeButton from "./ExamineeButton"
import CommentButton from "./CommentButton"
import styles from "./ExamineeBox.module.css"

export default function ExamineeBox({ examineeName = "Max Värsting" }) {
	const [selectedButton, setSelectedButton] = useState(null)

	const handleButtonClick = (buttonId) => {
		setSelectedButton(prev => prev === buttonId ? null : buttonId)
		console.log(`Pressed ${buttonId} button`)
	}

	return (
		<div className={styles.examineeContainer}>
			<fieldset className={styles.examineeFieldset}>
				<div className={styles.examineeName}>
					<p>{examineeName}</p>
				</div>
				<CommentButton onClick={() => console.log("Pressed comment button")} className={styles.commentButtonContainer}/>
				<div className={styles.buttonContainer}>
					<ExamineeButton
						id="pass-button"
						type="green"
						onClick={() => handleButtonClick("pass-button")}
						isSelected={selectedButton === "pass-button"}
						className={styles.examineeButton}
					>
						<p>G</p>
					</ExamineeButton>
					<ExamineeButton 
						id="fail-button"
						type="red"
						onClick={() => handleButtonClick("fail-button")}
						isSelected={selectedButton === "fail-button"}
						className={styles.examineeButton}
					>
						<p>U</p>
					</ExamineeButton>
				</div>
			</fieldset>
		</div>
	)
}
