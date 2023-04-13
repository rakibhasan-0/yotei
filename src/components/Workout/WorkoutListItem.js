/**
 * This class is responsible to create the UI for a Workout-item in the list.
 * It's made up by one stripe row with the name and an arrow to make the description, time
 * author and date for the item fold out beneath.
 *
 * @author Hot-pepper (Group 7)
 */
import React, { useState } from 'react';
import './WorkoutListItem.css';
import { Link } from "react-router-dom";
import FavoriteButton from '../Common/FavoriteButton';
import FetchWorkoutDesc from "../Workout/FetchWorkoutDesc";
import DescriptionToggle from "../Common/DescriptionToggle";

const WorkoutListItem = ({ workout, index, initState}) => {
    const [isActive, setIsActive] = useState(false);
    let bgColor = "#ffdfe3";


    const createStripes = () => {
        if (index % 2 === 0) {
            bgColor = "#ffdfe3"
        }
        else {
            bgColor = "#ffffff"
        }
    }
    return (
        <div>
            {createStripes()}

            <div className="row align-items-center font-weight-bold py-2 " key={workout.id}
                 style={{
                     backgroundColor: bgColor
                 }}>
                <div className="col col-md-1 workout-star">
                <FavoriteButton workoutId={workout.id} initState={initState}/>
            </div>

            <div className="col-md-8 text-left workout-text">
                <h5 className="text-left workout-name fill"><Link to={`/workout/${workout.id}`}>{workout.name}</Link></h5>
            </div>

            <div className="toggleIcon" onClick={() => setIsActive(!isActive)}>
                <DescriptionToggle isActive={isActive} />
            </div>
            </div>


            <div className="row" style={{
                backgroundColor: bgColor
            }}>
                {isActive &&
                    <FetchWorkoutDesc workout={workout} apiPath={'workouts'} />
                }
            </div>
        </div>
    );
};

export default WorkoutListItem;
