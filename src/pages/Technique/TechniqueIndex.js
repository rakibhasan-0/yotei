import React from "react"
import SearchBar from "../../components/Common/SearchBar"
import "../../components/Activity/activity.css"
import ActivityList from "../../components/Activity/ActivityList"
import {AccountContext} from "../../context"
import RoundButton from "../../components/Common/RoundButton/RoundButton"
import { Plus } from "react-bootstrap-icons"

/**
 * Class for the Technique-page that creates the searchbar and the list.
 * When a user puts an input into the search bar it will filter the
 * list according to the current search term.
 * 
 * Fetches the techniques from the API on pageload (componentDidMount).
 * @author Grupp 3 (Hawaii), Grupp 6 (Calskrove, 2022-05-03)
 */
class TechniqueIndex extends React.Component {
	constructor(props) {
		super(props)
		this.state = {activities: [], visibleList: [], tags: [], relations: []}
		this.uri = this.props.uri
		this.detailURL = "/technique/technique_page/"
	}

	render() {
		return (
			<div>
				<center>
					<h2 className="pt-2">Tekniker</h2>
				</center>
				<SearchBar onSearch={this.search}/>
				<ActivityList activities={this.state.visibleList}  apiPath={"techniques"} detailURL={this.detailURL} />
				<div style={{padding: "50px"}}/>
				<RoundButton linkTo={"/technique/create"}>
					<Plus />
				</RoundButton>
			</div>
            
		)
	} 

	search = async (event) => {
		const search = event.target.value.toLowerCase()
        
		const filteredTags = this.state.tags.filter(tag => tag.name.toLowerCase().includes(search))

		const techniqueIds = await this.getTechniqueIdsFromTag(filteredTags)

		const techniqueByTag = this.state.activities.filter(activity => techniqueIds.includes(activity.id))

		const techniqueByName = this.state.activities.filter(activity => activity.name.toLowerCase().includes(search))

		const combind = Array.from(new Set(techniqueByName.concat(techniqueByTag)))

		this.setState({visibleList: combind})                   
	}

    

	/**
     * Finds the technique ids for a list of tags.   
     * @param {List} tagList The list of tags.
     * 
     * @returns A list of technique ids.
     */
	async getTechniqueIdsFromTag(tagList) {
		let techniqueIds = []

		tagList.forEach(tag => {
			this.state.relations.forEach(relation => {
				if (relation.tag_id === tag.id) {
					relation.technique_ids.forEach(technique => {
						techniqueIds.push(technique)
					})
				}
			})
		})
		return techniqueIds
	}

	componentDidMount() {
		this.fetchTechniques()
		this.fetchTags()
		this.fetchTechniqueByTags()
	}

	/**
     * Fetches all techniques.
     */
	async fetchTechniques() {
		const headers = {token: this.context.token}
		await fetch("/api/techniques/all", {headers})
			.then(res => res.json())
			.then((data) => {
				//Set both states to the received list of activities but sorted lexicographically (alphabetically)
				const sortedData = data.sort((a, b) => a.name.localeCompare(b.name))
				this.setState({ activities: sortedData, visibleList: sortedData })
			})
			.catch(console.log)
	}
   
	/**
     * Fetches all tags.
     */
	async fetchTags() {
		const headers = {token: this.context.token}
		await fetch("/api/tags/all", {headers})
			.then(res => res.json())
			.then((data) => {
				this.setState({ tags: data })
			})
			.catch(console.log)
                
	}
    
	/**
     * Fetches the relation between tags and techniques.
     */
	async fetchTechniqueByTags() {
		const headers = {token: this.context.token}
		await fetch("/api/tags/fetch/techniques/by-tag", {headers})
			.then(res => res.json())
			.then((data) => {
				this.setState({relations: Object.keys(data).forEach(key => {
					for(let i = 0; i < this.state.tags.length; i++){
						if(this.state.tags[i].id === key){
							return {tag_id: this.state.tags[i].id, technique_ids: data[key]}
						}
					}
				})})
			})
			.catch(console.log)

	}

}

TechniqueIndex.contextType = AccountContext

export default TechniqueIndex
