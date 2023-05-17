import "./BeltPicker.css"
import DropdownComponent from "../List/Component"
import CheckBox from "../CheckBox/CheckBox"
import BeltIcon from "../BeltIcon/BeltIcon"
import { useContext, useEffect, useState } from "react"
import { AccountContext } from "../../../context"

/**
 * Represents a belt row with text, two checkboxes and two
 * icons. 
 * 
 * @param {Object} belt The belt object
 * @param {Object} states Array of selected belts
 * @param {Boolean} onToggle
 * @see BeltPicker.BELTS
 * @returns A new belt row
 */
const BeltRow = ({ belt, states, onToggle }) => {
	const name = belt[0].name
	const child = belt[1]
	const adult = belt[0]

	const [childState, setChildState] = useState(false)
	const [adultState, setAdultState] = useState(false)

	useEffect(() => {
		setChildState(states?.some(b => b.id === child.id))
		setAdultState(states?.some(b => b.id === adult.id))
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="belt-row">
			<div className="belt-item">
				<CheckBox id={`belt-child-${name}`} onClick={toggleChildState} checked={childState} />
				{/* Set the belt color to red if its white and a child */}
				<BeltIcon id={`belt-child-${name}-text`} color={`#${child.color}`} child={true} />
			</div>
			<p id={"belt-text"} className="belt-text">{name}</p>
			<div className="belt-item">
				<BeltIcon id={`belt-adult-${name}`} color={`#${adult.color}`} />
				<CheckBox id={`belt-adult-${name}-text`} onClick={toggleAdultState} checked={adultState} />
			</div>
		</div>
	)

	function toggleChildState(state) {
		setChildState(state)
		onToggle(state, child)
	}

	function toggleAdultState(state) {
		setAdultState(state)
		onToggle(state, adult)
	}
}

/**
 * A belt picker component, allowing one to pick child and adult
 * belts for all the available belts. The parent is responsible
 * for handling the selection logic, as shown in the example below:
 * 
 * states = [
 *  {
 *   "id": 1,
 *   "name": "Brun",
 *   "color": "FFFFF6",
 *   "child": false
 * 	}
 * ]
 * 
 * The onToggle function should accept a belt, and adult
 * parameter, where belt is the color, and adult 
 * a boolean to indiciate if an adult or child belt 
 * was toggled.
 * 
 * Example Usage:
 * 
 * const [belts, setBelts] = useState([])
 * const onToggle = belt => setBelts(prev => {
 * 	  if (prev.includes(belt)) {
 * 	  	return prev.filter(b => b !== belt)
 * 	  }
 * 	  return [...prev, belt]
 * })
 * <BeltPicker onToggle={onToggle} states={belts} />
 * 
 * @author Chimera (Group 4)
 * @since 2023-05-12
 * @version 2.0
 * @param id An id for the belt picker
 * @param states A state object, as shown above
 * @param onToggle A toggle function when a belt is selected (both child and adult)
 * @returns A new belt picker component
 */
export default function BeltPicker({ id, states, onToggle, centered }) {
	const { token } = useContext(AccountContext)
	const [belts, setBelts] = useState()
	
	useEffect(() => {
		fetch("/api/belts/all", {
			headers: { token }
		}).then(async data => {
			const json = await data.json()
			const groups = {}
			for (const belt of json) {
				if (!groups[belt.name]) {
					groups[belt.name] = []
				}
				groups[belt.name].push(belt)
			}
			setBelts(groups)
		}).catch(ex => {
			alert("Kunde inte hämta bälten")
			console.error(ex)
		})
	}, [token])
	
	return (
		<DropdownComponent text={"Bälten"} id={id} centered={centered} autoClose={false} >
			{belts && Object.values(belts).map((belt, index) => (
				<BeltRow onToggle={onToggle} states={states} key={index} belt={belt} />
			))}
		</DropdownComponent>
	)
}
