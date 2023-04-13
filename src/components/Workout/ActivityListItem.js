import Form from 'react-bootstrap/Form'
import "./ActivitySelectionList.css"
import { AccountContext } from '../../context'
import React, { useState, useContext } from 'react';
import DescriptionToggle from './../Common/DescriptionToggle';
import FetchActivityDesc from "../Activity/FetchActivityDesc";

/**
 * This class is responsible for reprecenting a item in a ActivitySelectionList
 *
 * @author Kebabpizza (Group 8)
 */
function ActivityListItem({activity, checkboxHasChanged, index, apiPath, defaultChecked}) {
    const { token } = useContext(AccountContext);
    const [isActive, setIsActive] = useState(false);

    if (activity.duration == null) {
        activity.techniqueId = activity.id
    } else {
        activity.exerciseId = activity.id
    }
    let bgColor = "#ffdfe3";

    if (index % 2 === 0) {
        bgColor = "#ffdfe3"
    }
    else {
        bgColor = "#ffffff"
    }

    async function toggleDesc() {
        if (activity.duration != null && !isActive) {
            const requestOptions = {
                headers: {'Content-type': 'application/json', token},
            };
            await fetch(`/api/exercises/getdesc?id=${activity.exerciseId}`, requestOptions)
                .then(res => res.json())
                .then((data) => activity.description = data.description)
                .catch(console.log)
        }

        setIsActive(!isActive);
    }

    return (
        <>
            <div className="row align-items-center py-2  "
                 style={{
                     backgroundColor: bgColor
                 }}>
                <div className="col-1">
                    <Form.Check
                        type="checkbox"
                        className="select-activity-checkbox"
                        defaultChecked={defaultChecked}
                        onChange={() => checkboxHasChanged(activity.id)}
                    />
                </div>
                {activity.duration == null ? (
                    <div className="col-9 align-items-left">
                        <h5 style={{textAlign: "left", marginTop: "10px", marginLeft:"5px", textOverflow: "ellipsis", overflow: "hidden"}}>{activity.name}</h5>
                    </div>
                ) : (
                    <>
                        <div className="col-6 align-items-left">
                            <h5 style={{textAlign: "left", marginTop: "10px", marginLeft:"5px", textOverflow: "ellipsis", overflow: "hidden"}}>{activity.name}</h5>
                        </div>
                        <div className=" listItemTime col-3 ">{activity.duration} min</div>
                    </>
                )}
                <div className="toggleIcon" onClick={toggleDesc}>
                    <DescriptionToggle isActive={isActive}/>
                </div>

                <div>
                    {isActive &&
                        <div className="col">
                            <div className="text-col">{activity.description}</div>
                        </div>
                    }
                </div>
            </div>
        </>
    );
};

export default ActivityListItem;
