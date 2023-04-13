import "./ActivitySelectionList.css"
import ActivityListItem from './ActivityListItem'
import SearchBar from './../Common/SearchBar.js';
import React, {useState} from 'react';

/**
 * This class is responsible for presenting a list of activities and keeps track of
 * which once are selected
 *
 * @author Kebabpizza (Group 8), Verona (Group 5)
 */
function ActivitySelectionList({activities, dictionary, tags, relations}) {

    const [visibleList, setVisibleList] = useState([]);
    
    function checkboxHasChanged(activityID){
        dictionary[activityID] = !dictionary[activityID];
    }

    const scrollContainerStyle = {maxHeight: "600px" };

    /**
     * Function to filter the list when searching based on names and tags
     * @param {*} event the string that is used for search
     */
    const search = async (event) => {

        const search = event.target.value.toLowerCase()
        
        const filteredTags = tags.filter(tag => tag.name.toLowerCase().includes(search))
        
        const activityIds = await getActivityIdFromTag(filteredTags)
        
        const activitesByTag = activities.filter(activity => activityIds.includes(activity.id))
        
        const activityByName = activities.filter(activity => activity.name.toLowerCase().includes(search))  
        
        const combind = Array.from(new Set(activityByName.concat(activitesByTag)))
        
        setVisibleList(combind)                   
        
    }

    /**
    * Finds the technique ids for a list of tags.   
    * @param {List} tagList The list of tags.
    * @returns A list of technique ids.
    */
    const getActivityIdFromTag = async (tagList) => {
        let activityIds = []
        tagList.map(tag => {
            relations.map(relation => {
                if (relation.tag_id === tag.id) {
                    relation.activity_id.forEach(technique => {
                        activityIds.push(technique)
                    })
                }
            })
        })
        return activityIds
    }

    // show "visiblieList" when it contains something, otherwise activites, not optimal solution  
    const list = visibleList.length !== 0 ? visibleList : activities;

    return (
        <>
            <SearchBar onSearch={search}/>
            <div className="scrollbar scrollbar-primary" style={scrollContainerStyle}>
                <div className="container grid-striped select-activity-list-container">
                    {list.map((activity, index) => (
                        <ActivityListItem key={activity.id} activity={activity} checkboxHasChanged={checkboxHasChanged} defaultChecked={dictionary[activity.id]} index={index}/>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ActivitySelectionList;
