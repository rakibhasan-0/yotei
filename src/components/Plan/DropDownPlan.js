import React, {} from "react"
import SearchBar from "../Common/SearchBar"
import "./PlanNav.css"
import ToggleButton from "./ToggleButton"

/**
 * The dropdown component for Plan
 * @author Group 4 (Calzone) and Group 3 (Hawaii)
 */
class DropDownPlan extends React.Component {
	constructor(props) {
		super(props)
		this.state = {visiblePlans: this.props.plans}
	}

	/**
     * Takes action when the "Choose all"("Välj alla") button is toggled.
     * Sets the state of the toggle button depending on if toggle used to
     * be on or off and sets all items' "checked" to true or false.
     */
	toggleButtonAction = (toggled) => {
		this.props.toggleAll(toggled, this.state.visiblePlans)
	}


	/**
     * Function runs when the "Filtrera" button is pressed. The list of plans is emptied and 
     * all the checked plans are entered. Runs the function setPlan() in PlanIndex to update
     * what's visible.
     */
	filterButtonAction = () => {
		this.props.setPlanFunction(this.props.plans.filter(opt => opt.checked))
	}

	/**
     * Creates a list of checkbox items with the elements of visibleList.
     * @returns the list
     */
	checkBoxList = () => {
		return this.state.visiblePlans.map( p => {
			return (
				<li className="col" key={p.id}>
					<div id="checkboxpad">
						<input
							type = "checkbox"
							id={p.id}
							name = {p.name}
							value ={p.name}
							checked = {p.checked}
							onChange ={e => this.props.checkedChange(this.props.plans.findIndex(a => a.id === p.id), e.currentTarget.checked)}

						/>
						<label htmlFor={`custom-checkbox-${p.id}`}>{p.name}</label>
					</div>
				</li>
			)
		})
	}

	/**
     * Renders a searchbar, checkbox list and toggle button.
     * @returns the whole dropdown
     */
	render(){

		const list = this.checkBoxList()

		return (
			<div id ="filter">
				<div id="searchBar">
					<SearchBar onSearch={(event)=>{
						const search = event.target.value.toLowerCase()
						const newVisibleList = this.props.plans.filter(plan => plan.name.toLowerCase().includes(search))
						this.setState({visiblePlans: newVisibleList})
					}}/>
				</div>

				<div id="checkBoxes">
					{list}
				</div>
                
				<div id="buttons" className="col">

					<button
						type="button"
						style={{backgroundColor: "#FFDFE3", borderRadius:10, borderWidth: 1}} 
						onClick={this.filterButtonAction}
					>
                        Filtrera
					</button>

					<ToggleButton toggle={this.toggleButtonAction}/>
				</div>

			</div>
		)
	}
}


export default DropDownPlan
