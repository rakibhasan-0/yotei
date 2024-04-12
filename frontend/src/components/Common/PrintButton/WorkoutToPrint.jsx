import React from "react"
import "../../../pages/Workout/WorkoutView/WorkoutView.jsx"
import styles from "./WorkoutToPrint.module.css"

/**
 * The WorkoutToPrint component is used to create a printable view of workout data.
 * The component receives the workoutData object which contains information about the workout.
 * Props: 
 * 		workoutData @param {Object} - The object containing information about the workout.
 * 					@returns {JSX.Element} - Returns the JSX element for the printable view of the workout.
 * 
 * Example usage:
 * 			<WorkoutToPrint workoutData={workoutData} />
 * 
 * @author Chimera (Grupp 4)
 * @since 2023-05-16
 * @version 1.0 
 */
const WorkoutToPrint = ({ workoutData }) => {

	/**
	 * Takes in an array, and returns 
	 * an array of arrays according to the
	 * specified size.
	 * 
	 * @param {Array} list 
	 * @param {Number} size 
	 */
	const chunk = (list, size) => {
		const chunkedList = []
		for (let i = 0; i < list.length; i += size) {
			chunkedList.push(list.slice(i, i + size))
		}
		return chunkedList
	}

	const sorted = workoutData.activityCategories
		.sort((a, b) => a.categoryOrder - b.categoryOrder)
	const chunks = chunk(sorted, 2)

	return (
		<>
			<div className={styles.WorkoutToPrintContainer}>
				<div className={styles.WorkoutToPrintRowItem}>
					<div className={styles.WorkoutToPrintColumnItem}>
						<h1 className="font-weight-bold text-truncate" style={{ marginBottom: "40px", fontSize: "42px" }}>{workoutData?.name}</h1>
					</div>			
				</div>
				<div className={styles.WorkoutToPrintRowItem}>
					<div className={styles.WorkoutToPrintColumnItem}>
						<h4 className="font-weight-bold mb-0" style={{ fontSize: "32px"}}>Författare</h4>
						<p style={{ fontSize: "20px"}}>{workoutData.author?.username}</p>
					</div>
					<div className={`${styles.WorkoutToPrintColumnItem} ${styles.WorkoutToPrintColumnItemRight}`}>
						<h4 className="font-weight-bold mb-0" style={{ fontSize: "32px"}}>Tidslängd</h4>
						<p style={{ fontSize: "20px"}}>{workoutData?.duration} min</p>
					</div>
				</div>

				<div className={styles.WorkoutToPrintRowItem}>
					<div className={styles.WorkoutToPrintColumnItem}>
						<h4 className="font-weight-bold mb-0" style={{ fontSize: "32px"}}>Skapad</h4>
						<p style={{ fontSize: "20px"}}>{workoutData?.created}</p>
					</div>
					<div className={`${styles.WorkoutToPrintColumnItem} ${styles.WorkoutToPrintColumnItemRight}`}>
						<h4 className="font-weight-bold mb-0 text-align-left" style={{ fontSize: "32px"}}>Senast ändrad</h4>
						<p style={{ fontSize: "20px"}}>{workoutData?.changed}</p>
					</div>
				</div>
				<div className={styles.WorkoutToPrintRowItem} style={{ marginBottom: "20px" }}>
					<div className={styles.WorkoutToPrintColumnItem}>
						<h4 className="font-weight-bold mb-0" style={{ fontSize: "32px"}}>Beskrivning</h4>
						<p className={styles.WorkoutToPrintProperties} style={{ fontSize: "20px"}}>{workoutData?.description}</p>
					</div>
				</div>
				<div className={`${styles.details} container text-left`}>
					{chunks.map((chunk, row) => (
						<div className="row my-4" key={`${row}-row`}>
							{chunk.map((category, col) => (
								<div className="position-relative col border border-secondary rounded mx-1 pb-2" key={`${row}-${col}-col`}>
									<p className={styles.categoryTitle}>{category.categoryName}</p>
									<div className={category.categoryName ? "mt-3" : "mt-1"}>
										{category.activities?.map((activity, index) => (
											<div className="mt-1 px-2" key={index} style={{backgroundColor: index % 2 ? "#F8EBEC" : "white"}}>
												<div className="d-flex justify-content-between">
													<p>{activity.name}</p>
													<p>{activity.duration} min</p>
												</div>
												<p style={{color: "gray"}}>{activity.exercise?.description}</p>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</>
	)
}

export default WorkoutToPrint