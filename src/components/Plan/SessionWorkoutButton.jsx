import React from "react"
import {PlusLg} from "react-bootstrap-icons" 
import workoutSvg from "./workout.svg"

/***
 * SessionWorkoutButton is a button-component. It can either be a button that creates new workouts
 * or, if the plan already has a workout, lets the user view the workout.
 * 
 * The component is also adjusted to render differently in case of errors 
 * to not cause complete page/application crashes. 
 * 
 * Constraints are to be set by the parent component.
 * 
 * @author Griffin 
 * 
 * @param id        @type {string}  id of component, should be unique
 * @param onClick   @type {function} determines the action when user clicks the button
 * @param workout   @type {boolean} if true renders a workout-icon if false renders the ''add-new-workout''button.
 * 
 * Example usage:
 *          <SessionWorkoutButton id="id" onClick={myFunction} workout={true}/> 
 * 
 * @returns A SessionWorkoutButton rendered according to given input. 
 * In case of incorrect input it returns a placeholder and an error message is displayed in console.error
 */
function SessionWorkoutButton({id, onClick, workout}) {
    
	function checkID (id) {
		if (id === null || id === undefined) {
			console.error("[invalid input]: SessionWorkoutButton requires an ID")
			return false
		}

		return true
	}

	function checkAction(oncClick) {
		if (oncClick === null || onClick === undefined) {
			console.error("[invalid input]: SessionWorkoutButton requires action onClick")
			return false
		}

		return true
	}

	function checkWorkout(workout) {
		if (workout === null || workout === undefined) {
			console.error("[invalid input]: SessionWorkoutButton requires boolean workout to be defined")
			return false
		}

		return true
	}

    

	return (
	/* check valid input*/
		checkID(id) && checkAction(onClick) && checkWorkout(workout) ?
			
		/* display different icons depending on if there exists a workout or not */
			workout ?
				<button id={id} onClick={onClick}><img src={workoutSvg}/></button>
				: 
				<button id={id} onClick={onClick}><PlusLg/></button>
        
			: 
        
			<div id="invalid-input"><p>Error loading component</p></div>
        
        
	)


}

export default SessionWorkoutButton