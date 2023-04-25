import React from 'react';
import SearchBar from '../../components/Common/SearchBar';
import ActivityList from "../../components/Activity/ActivityList";
import './WorkoutIndex.css';
import { AccountContext } from '../../context';
import DatePicker from '../../components/Common/DatePicker/DatePicker';
import RoundButton from '../../components/Common/RoundButton/RoundButton';
import { Plus } from 'react-bootstrap-icons';

/**
 * Workout class. 
 * Creates the searchbar and the activitylist.
 *
 * When a user puts an input into the search bar then it will filter the
 * activitylist after the current search term.
 *
 * Fetches the exercises from the API on pageload (componentDidMount).
 *
 * @author Team Capricciosa (Group 2), Kebabpizza (Group 8), Team Hawaii
 * 
 * @version 1.0
 */
class Workout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {workouts: [],
            visibleList: [],
            nameSearchParams: "",
            dateSearchParams: "",
            allTags : [],
            workoutTags: [],
            tags: [], 
        };
        this.uri = this.props.uri;
        this.detailURL = "/workout/"
    }

    updateSearch(searchParams) {
        if (searchParams.date !== ""){
            this.updateDate(searchParams.date)
            searchParams.date = searchParams.date
        }
        let workout_ids = [];
        const tags = this.state.tags.filter(tag =>
            tag.tag_name.toLowerCase().includes(searchParams.name.toLowerCase()) 
        );
        for(let i = 0; i < tags.length; i++){
            for(let j = 0; j < tags[i].workout_ids.length; j++){
                workout_ids.push(tags[i].workout_ids[j])
            }
        }
        let newVisibleList;
        if (searchParams.name[0] === '@') {
            const authorName = searchParams.name.split('@')[1]
            newVisibleList = this.state.workouts.filter(workout =>
                workout.authorName.toLowerCase().includes(authorName) && workout.created.includes(searchParams.date)
            );
        } else {
            newVisibleList = this.state.workouts.filter(workout =>
                (workout.name.toLowerCase().includes(searchParams.name) || workout_ids.includes(workout.id)) && workout.created.includes(searchParams.date)
            );
        }
        this.setState({workouts: this.state.workouts, visibleList: newVisibleList, nameSearchParams: searchParams.name, dateSearchParams: searchParams.date});
    }

    async updateDate(e){
        this.value = e;
    }

    render() {
        return (
            <>
                <div className="pt-2">
                    <center>
                        <h2>Pass</h2>
                    </center>
                    <SearchBar onSearch={(e) => {
                        this.updateSearch({name: e.target.value.toLowerCase(), date: this.state.dateSearchParams});
                    }}/>
                    <center>
                        <DatePicker
                            onChange={(e) => {this.updateSearch({name: this.state.nameSearchParams, date: e});

                        }}/>
                    </center>
                </div>
                <ActivityList activities={this.state.visibleList} apiPath={"workouts"} detailURL={this.detailURL}/>
                <div style={{padding: '50px'}}/>
                <RoundButton linkTo={"/workout/create"}>
                    <Plus />
                </RoundButton>
            </>
        );
    }

    /**
     * Fetches the workouts from the database and sets the sate.
     */
    componentDidMount() {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-type': 'application/json', token: this.context.token }
        };

        fetch(`/api/workouts/all/${this.context.userId}`, requestOptions)
            .then(res => res.json())
            .then((data) => {
                this.setState({ workouts: data, visibleList: data }, () => {
                    let allUsernames = []
                    // After the workouts are set, get the username of all the authors
                    fetch(`/user/all`, {headers: {token: this.context.token}})
                    .then(res => res.json())
                    .then((data) => {
                        allUsernames = data.map(({userId, username}) => ({userId, username}))
                        allUsernames.forEach(user => {
                            let res = this.state.workouts.filter(obj => {
                                return obj.author === user.userId
                            })
                            res.forEach(workout => {
                                workout.authorName = user.username
                            })
                        })
                    })
                    .catch(console.log)
                })
            })
            .catch(console.log);
            this.getTags();
            this.getTagsForWorkouts();
    }

   
    
    async getTags() {
        const requestOptions = {
            method: "GET",
            headers: {'Content-type': 'application/json', 'token' : this.context.token},
        };
        try {
            const response = await fetch('/api/tags/all', requestOptions);
            if (response.ok) {
                const data = await response.json();
                this.setState({allTags :  data.map((tags) => {
                    return {label: tags.name, value : tags.id}
                })});
            } else {
                this.setState({fetchTagsFailed: true})
                this.forceUpdate();
            }
        } catch(error) {
            console.log("Error at exercise insert");
            this.setState({fetchTagsFailed: true})
            this.forceUpdate();
        }
    }
    async getTagsForWorkouts(){
        const requestOptions = {
            method: "GET",
            headers: {'Content-type': 'application/json', 'token' : this.context.token},
        };
        try {
            const response = await fetch(`/api/tags/fetch/workouts/by-tag`, requestOptions);
            if (response.ok) {
                var data = await response.json(); 
                this.setState({tags: Object.keys(data).forEach(key => {
                    for(let i = 0; i< this.state.allTags.length; i++){
                        if(this.state.allTags[i].value === key){
                            return {tag_name: this.state.allTags[i].label, workout_ids: data[key]}
                        }
                    }
                })})
                this.forceUpdate();
            } else {
                this.setState({fetchTagsFailed: true})
                this.forceUpdate(); 
            }
        } catch(error) {
            console.log("Error at exercise insert");
            this.setState({fetchTagsFailed: true})
            this.forceUpdate();
        }


    }

}

Workout.contextType = AccountContext;

export default Workout;
