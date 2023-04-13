import React from 'react';
import { AccountContext } from '../../context'
import PlanList from '../../components/Plan/PlanList';
import PlanNav from '../../components/Plan/PlanNav';
import PlanOrSessionDialog from '../../components/Plan/PlanOrSessionDialog';
import AddButton from '../../components/Common/AddButton';
import AddActivityButton from "../../components/Activity/AddActivityButton";


/**
 * Index page for Plan, uses component PlanList
 *  @author Group 4(Calzone) and Group 3(Hawaii)
 */
class PlanIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {plans: [], filteredPlans: [], sessions: [], filteredSessions: [], workoutCache: {}};
        this.uri = this.props.uri
    }

    /**
     * Executed when the filter button is pressed in the filter panel.
     * @param selectedPlans An array of the currently selected plans
     */
    setPlan = async (selectedPlans) => {
        //Find out which sessions should be shown
        let newFilteredSessions = this.state.sessions.filter(session => selectedPlans.some(plan => session.plan === plan.id))
        let cacheCopy = {...this.state.workoutCache}


        //Find out which sessions who haven't had their workout fetched
        let sessionsToUpdate = []
        newFilteredSessions.forEach(session => {
            if (!(session.id in cacheCopy) && session.workout) {
                sessionsToUpdate.push(session)
            }
        })

        //TODO Implement get mothod in api for getting multiple workouts at once
        //Fetch for each session
        let fetches = []
        for (const session of sessionsToUpdate) {
            fetches.push(fetch(`api/workouts/workout/${session.workout}`, {headers: {token: this.context.token}})
                .then(response => response.json())
                .then(workout => cacheCopy[session.id] = workout)
                .catch(()=>{}))
        }
        await Promise.all(fetches)
        //Add fetched workout to session object
        newFilteredSessions = newFilteredSessions.map(session => {
            return ({...session, workoutObj: cacheCopy[session.id]})
        })
        const newSessions = this.state.sessions.map(session => {
            return ({...session, workoutObj: cacheCopy[session.id]})
        })
        //Set new state using all the new info
        this.setState({
            filteredPlans: selectedPlans,
            filteredSessions: newFilteredSessions,
            workoutCache: cacheCopy,
            sessions: newSessions
        })
    }

    onDelete(sessionId) {
        let items = [...this.state.sessions]
        let index = this.state.sessions.findIndex(session => session.id === sessionId)
        items.splice(index, 1)
        this.setState({
            sessions: items,
            filteredSessions: items.filter( session => this.state.filteredPlans.some(plan => session.plan === plan.id))
        })
    }

    render() {
        return (
            <div>
                <PlanNav plans={this.state.plans} setPlanFunction={this.setPlan} checkedChange={(index, checked) => {
                    let items = [...this.state.plans]
                    items[index].checked = checked
                    this.setState({plans: items})
                }}
                 toggleAll={(toggled, visiblePlans) => this.setState({plans: this.state.plans.map(v => {
                     if(visiblePlans.some(p => p.id === v.id)){
                         v.checked = toggled
                     }
                     return v
                 })})}/>
                <PlanList plans = {this.state.filteredPlans} sessions={this.state.sessions.filter( session => {
                    return this.state.filteredPlans.some(plan => session.plan === plan.id)
                })} onEdit={async session => {
                    let index = this.state.sessions.findIndex( sesh => sesh.id === session.id)
                    let items = [...this.state.sessions]

                    //If session has new workout then fetch the new workout into the cache
                    let cacheCopy = {...this.state.workoutCache}
                    if (session.workout && session.workout !== items[index].workout) {
                        await fetch(`api/workouts/workout/${session.workout}`, {headers: {token: this.context.token}})
                            .then(response => response.json())
                            .then(workout => {
                                cacheCopy[session.id] = workout
                                session.workoutObj = cacheCopy[session.id]
                            })
                            .catch(()=>{})

                    }
                    items[index] = session
                    let sortedSessions = items.sort((a, b) => new Date(a.date) - new Date(b.date));
                    this.setState({
                        workoutCache: cacheCopy,
                        sessions: sortedSessions,
                        filteredSessions: sortedSessions.filter(session => this.state.filteredPlans.some(plan => session.plan === plan.id))
                    })
                }} onDelete={this.onDelete.bind(this)}/>
                <PlanOrSessionDialog/>
            </div>
        )
    }

    /**
     * Fetches all plans when the page loads
     */
     componentDidMount() {
        const headers = {token: this.context.token}
        fetch(`/api/plan/all`, {headers})
            .then(res1 => res1.json())
            .then((data1) => {
                this.setState({plans: data1})
                fetch("/api/session/getByPlans?id=" + data1.map(plan => plan.id).join(",")  ,{headers})
                    .then(res2 => res2.json())
                    .then(data2 => {
                        data2.map(session => includeTimeInDate(session))
                        this.setState({sessions: data2.sort( (a, b) => new Date(a.date) - new Date(b.date))})
                    })
            })
            .catch(()=>{})
    }



}

/**
 * Splits up a sessions time attribute and add the hour and minutes to a sessions date attribute
 */
export const includeTimeInDate = (session) => {
    if(session.time != null){

        let date = new Date(session.date)
        let splitTime = session.time.split(":")
        let hour = parseInt(splitTime[0])
        let minutes = parseInt(splitTime[1])
        date.setHours(hour, minutes)
        session.date = date.toString()
    }
}

PlanIndex.contextType = AccountContext

export default PlanIndex;