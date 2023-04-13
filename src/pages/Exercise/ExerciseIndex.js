import React from 'react';
import SearchBar from '../../components/Common/SearchBar';
import '../../components/Activity/activity.css';
import AddActivityButton from '../../components/Activity/AddActivityButton'; //Keep :)
import ActivityList from '../../components/Activity/ActivityList';
import { AccountContext } from '../../context'


/**
 * Class for the Exercise-page. Creates the searchbar and the list.
 * 
 * When a user puts an input into the search bar, it will filter the
 * list after the current search term.
 *
 * Fetches the exercises from the API on pageload (componentDidMount).
 * @author Grupp 3 (Hawaii), Grupp 5 (Verona)
 */
class ExerciseIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {activities: [], visibleList: [], allTags: [], usedTags: []};
        this.uri = this.props.uri
        this.detailURL = "/exercise/exercise_page/"
    }

    render() {
        return (
            <div>
                <center>
                    <h2 className="py-2">Övningar</h2>
                </center>
                <SearchBar onSearch={(event)=>{
                    this.search(event)
                }}/>
                <ActivityList activities={this.state.visibleList}  apiPath={"exercises"} detailURL={this.detailURL}/>
                <div style={{padding: '50px'}}/>
                <AddActivityButton buttonName="+" linkTo="/exercise/create"/>
            </div>
        )
    }

    /**
     * Called when component is added.
     */
    componentDidMount() {
        this.getAllTags()
        this.getAllExercises()
        this.getAllExercisesByTag()
    }

    /**
    * Returns all tags.
    */
    async getAllTags() {
        const headers = {token: this.context.token}

        await fetch('/api/tags/all', {headers})
        .then(res => res.json())
        .then((data) => {
            this.setState({ allTags: data, visibleTags: data })
        })
        .catch(console.log)
    }

    /**
     * Returns all existing exercises.
     */
    async getAllExercises() {
        const headers = {token: this.context.token}

        await fetch(`/api/exercises/all`, {headers})
        .then(res => res.json())
        .then((data) => {
            this.setState({ activities: data, visibleList: data })
        })
        .catch(console.log)
    }

    /**
     * Sets all exercises to their tags.
     */
    async getAllExercisesByTag() {
        const headers = {token: this.context.token}

        await fetch(`/api/tags/fetch/exercises/by-tag`, {headers})
        .then(res => res.json())
        .then((data) => {
            this.setState({usedTags : Object.keys(data).map(key => {
                for(let i = 0; i < this.state.allTags.length; i++){
                    if(this.state.allTags[i].id == key){
                        return {tag_id: this.state.allTags[i].id, exercise_ids: data[key]}
                    }
                }
            })}) 
        })
    }

    /**
     * Used to search for the exercises that includes the searched word in the name or as a tag. 
     * @param {String} event 
     */
    async search(event) {
        const search = event.target.value.toLowerCase();

        /* Find all tags with the searched word */
        const searchedTags = this.state.allTags.filter(tag => tag.name.toLowerCase().includes(search))

        /* Get all exercisesIds with the correct tags */
        const exerciseIds = await this.getExercises(searchedTags)

        /* Get exercises with the correct tags */
        const exerciseByTag = this.state.activities.filter(activity => exerciseIds.includes(activity.id))

        /* Get exercises with the correct names */
        const exerciseByName = this.state.activities.filter(activity => activity.name.toLowerCase().includes(search))

        /* Show the exercises without duplicates */
        this.setState({visibleList: [...new Set([...exerciseByTag, ...exerciseByName])]})
    }

    /**
     * Returns the exercises that have a tag that is searched for.
     * @param {Array} searchedTags
     *
     * @returns All exercises with the searched tags.
     */
    async getExercises (searchedTags) {
        let exerciseIds = []

        searchedTags.map(tag => {
            this.state.usedTags.map(usedTag => {
                if(usedTag.tag_id == tag.id) {
                    usedTag.exercise_ids.forEach(exercise => {
                        exerciseIds.push(exercise)
                    });
                }
            }) 
        })
        return exerciseIds
    }
}

ExerciseIndex.contextType = AccountContext

export default ExerciseIndex;
