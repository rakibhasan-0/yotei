/**
 * This class displays the created workouts of a user.
 *
 * @author Hot-pepper (Group 7)
 */
import React, { useState, useEffect, useContext } from 'react';
import './WorkoutListItem.css';
import { AccountContext } from '../../context';
import ActivityList from '../Activity/ActivityList';
import SearchBar from '../../components/Common/SearchBar';

const DisplayCreatedWorkouts = () => {
    const [data, setData] = useState([])
    const [visibleData, setVisibleData] = useState([])
    const [isLoading, setLoading] = useState(true);
    const [tags, setTags] = useState([])
    const { token, userId } = useContext(AccountContext)

    useEffect(() => {
        getCreatedWorkouts()
    }, [])

    /**
     * Fetches the created workouts of the user.
     */
    function getCreatedWorkouts() {
        const requestOptions = {
            headers: { 'Content-type': 'application/json', token }
        };
        fetch(`/api/workouts/created/${userId}`, requestOptions)
            .then(response => response.json())
            .then(response => {setData(response)
                               setVisibleData(response)})
        setLoading(false)
    }

    /**
     * Fetch a list of tags 
     */
    useEffect(() => {
        const requestOptions = {
            method: "GET",
            headers: {'Content-type': 'application/json', 'token' : token},
        };
        fetch('/api/tags/all', requestOptions)
            .then(data => data.json())
            .then(allTags => {
                fetch(`/api/tags/fetch/workouts/by-tag`, requestOptions)
                .then(data => data.json())
                .then(data => {
                    setTags(Object.keys(data).map(key => {
                        for(let i = 0; i< allTags.length; i++){
                            if(allTags[i].id == key){
                                return {name: allTags[i].name, workout_ids: data[key]}
                            }
                        }
                    }))
                })
            })
        
    }, [])

    /**
     * Filter the list of visible workouts     
     */
    function updateSearch(searchParams) {
        let workout_ids = [];

        const tagList = tags.filter(tag =>
            tag.name.toLowerCase().includes(searchParams.toLowerCase()) 
        
        );

        for(let i = 0; i < tagList.length; i++){
            for(let j = 0; j < tagList[i].workout_ids.length; j++){
                workout_ids.push(tagList[i].workout_ids[j])
            }
        }

        let newVisibleList;
        newVisibleList = data.filter(workout =>
            (workout.name.toLowerCase().includes(searchParams) || workout_ids.includes(workout.id))
        );
        
        setVisibleData(newVisibleList)
    }

    return (
        <div>
            <div className="pb-3">
                <SearchBar onSearch={(event)=>{
                    updateSearch(event.target.value)
                }}/>
            </div>
            {isLoading ? 
            <div className="h1">Loading...</div> 
            : 
            <ActivityList activities={visibleData} apiPath={'workouts'} />}
        </div>
    );
};

export default DisplayCreatedWorkouts;
