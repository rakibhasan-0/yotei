import React, { useState, useEffect, useContext } from 'react';
import { AccountContext } from '../../context'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Button from 'react-bootstrap/Button'
import ActivitySelectionList from './../../components/Workout/ActivitySelectionList';
import Modal from "react-bootstrap/Modal";

/**
 * This class is responsible for selecting activity
 *
 * @author Kebabpizza (Group 8), Verona (Group 5)
 */
function WorkoutActivitySelection({closePopup, addActivities}) {
    const { token } = useContext(AccountContext);

    const [techniques, setTechniques] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [tags, setTags] = useState([]);
    const [techniqueRelations, setTechniqueRelations] = useState(null)
    const [exerciseRelations, setExerciseRelations] = useState(null)
    const [technique_checked, setTechnique_checked] = useState({})
    const [exercise_checked, setExercise_checked] = useState({})

    useEffect(() => {
        fetchFunc();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * Function to perform all fetches that are required
     */
    async function fetchFunc(){
        const requestOptions = {
            headers: {'Content-type': 'application/json', token}
        };

        await fetch(`/api/techniques/all`, requestOptions)
            .then(res => res.json())
            .then((data) => setTechniques(data.sort((a, b) => a.name.localeCompare(b.name))))
            .catch(console.log)

        await fetch(`/api/exercises/all/idname`, requestOptions)
            .then(res => res.json())
            .then((data) => setExercises(data.sort((a, b) => a.name.localeCompare(b.name))))
            .catch(console.log)
        
        // Set start values of techniques_checked, exercises_checked
        let copy = {...technique_checked}
        techniques.forEach((index) => {
            copy[index] = false;
            setTechnique_checked(copy)
        });
        copy = {...exercise_checked}
        exercises.forEach((index) => {
            copy[index] = false;
            setExercise_checked(copy)
        });
       const data = await fetchTags();
       await fetchTechniqueByTags(data);
       await fetchExerciseByTags(data);
    }
    /**
    * Fetches all tags.
    */
    async function fetchTags() {
        const headers = {token: token}
        const data = await fetch(`/api/tags/all`, {headers}).then(res => res.json())
        setTags(data);
        return data
    }
    /**
    * Fetches the relation between tags and techniques.
    */
    async function fetchTechniqueByTags(all_tags) {
        const headers = {token: token}
        await fetch(`/api/tags/fetch/techniques/by-tag`, {headers})
        .then(res => res.json())
        .then((data) => {
                    setTechniqueRelations(Object.keys(data).forEach(key => {
                        for(let i = 0; i < all_tags.length; i++){
                            if(all_tags[i].id === key){
                                return {tag_id: all_tags[i].id, activity_id: data[key]}
                            }
                        }
                    }))
                })
                .catch(console.log)
    }
    /**
    * Fetches the relation between tags and exercises.
    */
    async function fetchExerciseByTags(all_tags) {
        const headers = {token: token}
        await fetch(`/api/tags/fetch/exercises/by-tag`, {headers})
            .then(res => res.json())
                .then((data) => {
                    setExerciseRelations(Object.keys(data).forEach(key => {
                        for(let i = 0; i < all_tags.length; i++){
                            if(all_tags[i].id === key){
                                return {tag_id: all_tags[i].id, activity_id: data[key]}
                            }
                        }
                    }))
                })
                .catch(console.log)
    }
    
    function submittSelectedActivities(){
        closePopup();
       
        // Create array with all selected activities
        let activities = [];
        for (let k in technique_checked) {
            if (technique_checked.hasOwnProperty(k)) {
                if (technique_checked[k]) {
                    activities.push(techniques.find( t => t.id === k));
                }
            }
        }
        for (let k in exercise_checked) {
            if (exercise_checked.hasOwnProperty(k)) {
                if (exercise_checked[k]) {
                    activities.push(exercises.find( e => e.id === k));
                }
            }
        }

        addActivities(activities); 
    }



    return (
        <>
            <div className="popup-close-btn-container">
                <Button className="popup-close-btn" onClick={closePopup} variant="inline"><img alt="cross" src="/cross.svg" /></Button>
            </div>
            <Modal.Body>
                <Tabs defaultActiveKey="technique" className="mb-3">
                    <Tab eventKey="technique" title="Tekniker">
                        <ActivitySelectionList activities={techniques} dictionary={technique_checked} tags={tags} relations={techniqueRelations} />
                    </Tab>
                    <Tab eventKey="exercise" title="Övningar">
                        <ActivitySelectionList activities={exercises} dictionary={exercise_checked} tags={tags} relations={exerciseRelations} />
                    </Tab>
                </Tabs>
                
            </Modal.Body>
            <Button className="select-activity-button" variant="inline" onClick={submittSelectedActivities}>Välj</Button>
        </>
    );
};

export default WorkoutActivitySelection;
	