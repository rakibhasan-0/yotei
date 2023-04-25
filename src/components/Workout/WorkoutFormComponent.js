import { useState, useContext, useEffect} from 'react';
import { Form, Button } from "react-bootstrap";
import DraggableList from "./DraggableList"
import { Col, Row } from "react-bootstrap";
import AddUserWorkoutSelect from './AddUserWorkoutSelect';
import { GoBackButton } from "../Common/GoBackButton";
import Creatable from 'react-select/creatable';
import { AccountContext } from "../../context"
import './Calendar.css'
/**
 *  This component is an input form and is used in the page for creating
 *  a new workout (WorkoutCreate.js)
 * 
 * @author Team Kebabpizza (Group 8), Team Verona (Group 5), Team Capricciosa (Group 2)
 * 
 */
function WorkoutFormComponent(props){
    const [validated, setValidated] = useState(false);
    const workout = props.workout
    //const currentTags = props.tags

    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    
    //const [workoutDate, setWorkoutDate] = useState(null);
    //const [workoutTime, setWorkoutTime] = useState(null);
    let workoutDate = null;
    let workoutTime = null;
    const [selectedUsers, setSelectedUsers] = useState([
        {
            label: '',
            value: 1
        }
    ]);
    const [activities, setActivities] = useState([]);
    // false = checkbox is checked, true = checkbox is unchecked
    const [workoutVisibility, setWorkoutVisibility] = useState(false);
    const [tag, setTags] = useState([]);
    const [inputTaglist, setInputTaglist] = useState([]);
    const { token } = useContext(AccountContext)

    /**
     * Gets all tags from the database.
     */
    useEffect(() => {
        const requestOptions = {
            method: "GET",
            headers: { 'Content-type': 'application/json', 'token': token },
        };
        fetch('/api/tags/all', requestOptions).then((respone) => {
            return respone.json();
        }).then((data) => {
            const tags = [];
            let names = data.map((value) => {
                return { label: value.name, value: value }
            })

            for (const key in data) {
                const onetag = {
                    ...data[key]
                }
                tags.push(onetag);

            }

            setTags(names);
            setSelectedUsers(props.workout.users);
        })
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * Handles the submition of a workout. This function is called when the
     * add button is pressed.
     * 
     * @param {*} event 
     */
    function handleSubmit(event){
        const form = event.currentTarget;

        if (name.trim() == "") {
            alert("Invalid name.");
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        
        if (form.checkValidity() === false){
            event.preventDefault();
            event.stopPropagation();
        }
        else {
            event.preventDefault();

            if (workoutDate == null){
                //setWorkoutDate(getTodaysDate());
                workoutDate = getTodaysDate();
                console.log(workoutDate)
            }
            if (workoutTime == null){
                //setWorkoutTime(getCurrentTime());
                workoutTime = getCurrentTime();
                console.log(workoutTime)
            }
            
            fetchCallback();
        }

        setValidated(true);
    }

    /**
     * Function is called whenever a user adds or deletes a tag from their workout.
     * @param inputValue The inputted tags from the user.
     */
    const tagOnChange = (inputValue) => {
        setInputTaglist(inputValue)
    }

    /**
     * Grabs the user input from the form and sends that data to a callback
     * function that stores it to the db.
     * This function is called when the add button is pressed
     * @param {*} event event
     */
    function fetchCallback(event){
        // This prevents the page from reloading when
        // the add button is pressed.
        
        if (inputTaglist !== null){
            //Removes the possibillity of multiple tags with the same label.
            for (let i = 0; i < inputTaglist.length; i++) {
                console.log(inputTaglist[i]);
                for (let j = 0; j < inputTaglist.length; j++) {
                    if (inputTaglist[i].label === inputTaglist[j].label && i !== j){
                        if (j > -1) {
                            inputTaglist.splice(j, 1); // 2nd parameter means remove one item only
                        }
                    }
                }
            }
        } 
        props.callback(
            true, 
            name,
            desc,
            workoutDate,
            workoutTime,
            selectedUsers,
            workoutVisibility,
            activities,
            inputTaglist
            );
    }

    /**
     * Returns the current time.
     * @returns current time
     */
    function getCurrentTime() {
        const today = new Date();
        const currHour = today.getHours().toString().padStart(2, '0')
        const currMin = today.getMinutes().toString().padStart(2, '0')

        return currHour + ":" + currMin;
    }

    /**
     * Returns todays date.
     * @returns todays date
     */
    function getTodaysDate() {
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();

        return today = yyyy + '-' + mm + '-' + dd;
    }

    function handleCheckboxValue(){
        setWorkoutVisibility(!workoutVisibility)
    }

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit} >
            <Row style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%'}}>
                <Form.Group as={Col} md="9" controlId='validationCustom01' className='mb-3'>
                    {/*<Form.Label>Namn på pass</Form.Label>*/}
                    <Form.Control
                        type="text"
                        placeholder="Namn"
                        defaultValue={workout.name}
                        required
                        onChange={e => setName(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Detta fält kan inte lämnas tomt
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                        Ser bra ut!
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="9" controlId='validationCustom04' className='mb-3'>
                    {/*
                    In the current state in the project this is not used for anything, in the future if a workout should have a timestamp this can be 
                    uncommented and there will appear a options on the workout create form to add a date and time. Even though time does NOT work 
                    in the current implemenation of the project.
                    
                    <InputGroup className='mb-3'>
                        <DatePicker
                            locale="sv"
                            type="date"
                            className="form-control calendar-layer-1"
                            yearPlaceholder="yyyy"
                            monthPlaceholder="mm"
                            dayPlaceholder="dd"
                            onChange={(e) => setWorkoutDate(e.toLocaleDateString('sv-SV'))}
                        
                        />
                        <TimePicker
                            locale="sv"
                            type="time"
                            className="form-control"
                            value={workoutTime ? workoutTime : ''}
                            hourPlaceholder="hh"
                            minutePlaceholder="mm"
                            clockIcon={false}
                            disableClock={true}
                            onChange={(e) => setWorkoutTime(e)}
                        />

                    </InputGroup>
                    <Form.Text className="text-muted" style={{float: 'left', marginTop: '-1rem'}}>
                        * inte obligatorisk
                    </Form.Text>
                    */}
                </Form.Group>

                <Form.Group as={Col} md="9" controlId='validationCustom03' className='mb-3'>
                    {/*<Form.Label>Beskrivning</Form.Label>*/}
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Beskrivning av pass"
                        defaultValue={workout.desc}
                        required
                        onChange={e => setDesc(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Detta fält kan inte lämnas tomt
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                        Ser bra ut!
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="9" className="mb-3">
                    <DraggableList 
                        startActivities={workout.activities}
                        updateOutputArray={setActivities}
                    />
                    <Creatable
                        options={tag}
                        placeholder="Taggar"
                        formatCreateLabel={(inputText) => `Skapa "${inputText}"`}
                        isMulti
                        defaultValue={props.tags}
                        onChange={tagOnChange}
                        key={props.tags}
                    />
                </Form.Group>

                <Form.Group as={Col} md="9" className="mb-3">
                    <div className="custom-control custom-checkbox mb-3" style={{float: 'left'}}>
                        <input type="checkbox" className="custom-control-input" onChange={handleCheckboxValue} id="defaultChecked2" checked={workoutVisibility} />
                        <label className="custom-control-label" for="defaultChecked2">Privat pass</label>
                    </div>
                </Form.Group>

                <Form.Group as={Col} md="9" className="mb-3">
                    <AddUserWorkoutSelect 
                        addedUsers={selectedUsers}
                        setSelectedUsers={setSelectedUsers}
                        author={workout.authorName}
                    /> 
                </Form.Group>
                
                <Form.Group as={Col} md="9" className="mb-3">
                    <div className='mb-3' style={{float:'right', marginTop: '1rem'}}>
                            <Button size="lg" type="submit" style={{background:'#BE3B41', border: 'none'}}>Spara</Button>
                    </div>

                    <div className='mb-3' style={{float:'left', marginTop: '1rem'}}>
                        <GoBackButton onClick={() => !(isEmpty(name) && isEmpty(desc) && isEmpty(activities) && isEmpty(inputTaglist))}></GoBackButton>
                    </div>
                </Form.Group>
            </Row>


        </Form>
    )
}

function isEmpty(array) {
    return array.length === 0
}
export default WorkoutFormComponent;
