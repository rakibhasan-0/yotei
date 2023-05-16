import React from "react"
import "../../../pages/Workout/WorkoutView/WorkoutView.jsx"
import "./WorkoutToPrint.css"

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
	 * The sortByCategories function sorts the activity categories in the correct order.
	 * 
	 * @param {Object} workoutData - The object containing information about the workout.
	 * @returns {Array} - Returns the sorted activity categories.
	 */
	function sortByCategories(workoutData) {
		const sortedCategories = workoutData.activityCategories.sort((a, b) => a.categoryOrder - b.categoryOrder)
		return sortedCategories
	}

	return (
		<>
			<style>
				{`
			  @page {
				margin: 2cm;
				size: A4;
			  }
			`}
			</style>
			<div className={"WorkoutToPrint-container"}>
				<div className="WorkoutToPrint-row-item">
					<div className="WorkoutToPrint-column-item">
						<h1 className="font-weight-bold text-truncate" style={{ marginBottom: "40px", fontSize: "42px" }}>{workoutData?.name}</h1>
					</div>			
				</div>
				<div className="WorkoutToPrint-row-item">
					<div className="WorkoutToPrint-column-item">
						<h4 className="font-weight-bold mb-0" style={{ fontSize: "32px"}}>Författare</h4>
						<p style={{ fontSize: "20px"}}>{workoutData.author?.username}</p>
					</div>
					<div className="WorkoutToPrint-column-item WorkoutToPrint-column-item-right">
						<h4 className="font-weight-bold mb-0" style={{ fontSize: "32px"}}>Tidslängd</h4>
						<p style={{ fontSize: "20px"}}>{workoutData?.duration} min</p>
					</div>
				</div>

				<div className={"WorkoutToPrint-row-item"}>
					<div className={"WorkoutToPrint-column-item"}>
						<h4 className="font-weight-bold mb-0" style={{ fontSize: "32px"}}>Skapad</h4>
						<p style={{ fontSize: "20px"}}>{workoutData?.created}</p>
					</div>
					<div className={"WorkoutToPrint-column-item WorkoutToPrint-column-item-right"}>
						<h4 className="font-weight-bold mb-0 text-align-left" style={{ fontSize: "32px"}}>Senast ändrad</h4>
						<p style={{ fontSize: "20px"}}>{workoutData?.changed}</p>
					</div>
				</div>
				<div className="WorkoutToPrint-row-item" style={{ marginBottom: "20px" }}>
					<div className="WorkoutToPrint-column-item">
						<h4 className="font-weight-bold mb-0" style={{ fontSize: "32px"}}>Beskrivning</h4>
						<p className="WorkoutToPrint-properties" style={{ fontSize: "20px"}}>{workoutData?.description}</p>
					</div>
				</div>
				{sortByCategories(workoutData).map((activityCategory) => (
					<div className="category" key={activityCategory?.categoryOrder}>
						<div className="WorkoutToPrint-row-item">
							<div className="WorkoutToPrint-column-item">
								<h2 className="font-weight-bold mb-0" style={{ fontSize: "36px"}}>{activityCategory?.categoryName}</h2>
							</div>
						</div>
						{activityCategory.activities &&
						activityCategory.activities
							.sort((a, b) => a.order - b.order)
							.map((activity) => (
								<div className="activity" key={activity.id}>
									<div className="WorkoutToPrint-row-item">
										<div className="WorkoutToPrint-column-item">
											<h4 style={{ fontSize: "32px"}}>{activity?.name}</h4>
										</div>
										<div className="WorkoutToPrint-column-item WorkoutToPrint-column-item-right">
											<p style={{ fontSize: "20px"}}>{activity?.duration} min</p>
										</div>
									</div>
									<div className="WorkoutToPrint-row-item" style={{ marginBottom: "20px" }}>
										<div className="WorkoutToPrint-column-item">
											<p style={{ fontSize: "20px"}}>{workoutData?.description}</p>
										</div>
									</div>
								</div>
							))}
					</div>
				))}
			</div>
		</>
	)
}

export default WorkoutToPrint