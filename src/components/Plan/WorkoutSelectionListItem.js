import "../Workout/ActivitySelectionList.css"
import React, { useState } from 'react';
import DescriptionToggle from './../Common/DescriptionToggle';
import FetchWorkoutDesc from "../Workout/FetchWorkoutDesc";

/**
 * This class is responsible for reprecenting a item in a ActivitySelectionList
 *
 * @author Kebabpizza (Group 8)
 */
function WorkoutSelectionListItem({workout, radioSelected, index}) {
    const [isActive, setIsActive] = useState(false);

    let bgColor = "#ffdfe3";

    if (index % 2 === 0) {
        bgColor = "#ffdfe3"
    }
    else {
        bgColor = "#ffffff"
    }

    function toggleDesc() {
        setIsActive(!isActive);
    }

    return (
        <div>
            <div className="row  py-2  "
                 style={{
                     backgroundColor: bgColor
                 }}>
                <div className="col-1 selectWorkout">
                    <div className="radio">
                        <label><input name="selectWorkout" type="radio" onChange={() => radioSelected(workout)}/></label>
                    </div>
                </div>
                    <div className="col-6 align-items-left">
                        <h5 style={{textAlign: "left", marginTop: "10px", marginLeft:"5px", textOverflow: "ellipsis", overflow: "hidden"}}>{workout.name}</h5>
                    </div>


                <div className="toggleIcon col" onClick={toggleDesc}>
                    <DescriptionToggle isActive={isActive}/>
                </div>
            </div>

                <div>
                    {isActive &&
                        <div className="row"style={{
                            backgroundColor: bgColor
                        }}>
                            <FetchWorkoutDesc workout={workout} apiPath={"workouts"}/>
                        </div>
                    }
                </div>
        </div>
    );
};

export default WorkoutSelectionListItem;
