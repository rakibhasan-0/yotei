import styles from "./BeltPicker.module.css"
import DropdownComponent from "../List/Dropdown"
import CheckBox from "../CheckBox/CheckBox"
import BeltIcon from "../BeltIcon/BeltIcon"
import { useContext, useEffect, useState } from "react"
import { AccountContext } from "../../../context"
import { toast } from "react-toastify"

/**
 * Represents a belt row with text, two checkboxes and two
 * icons. 
 *  
 * Props:
 *    belt	   @type {Object}   A const containing .name for name, a hexcode .color for color and a boolean .child for if it's a child 
 *    states   @type {Object}   A state object, as shown above
 * 	  onToggle @type {Function} A toggle function when a belt is selected (both child and adult
 * 
 * @see BeltPicker.BELTS
 * @returns A new belt row
 */

const BeltRow = ({ belt, states, onToggle }) => {
	const name = belt[0].name
	const child = belt.find(b => b.child)
	const adult = belt.find(b => !b.child)

	const [childState, setChildState] = useState(false)
	const [adultState, setAdultState] = useState(false)

	useEffect(() => {
		setChildState(states?.some(b => b.id === child?.id))
		setAdultState(states?.some(b => b.id === adult?.id))
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className={styles.beltRow}>
			<div className={styles.beltItem}>
				{child ? <>
					<CheckBox id={`belt-child-${name}`} onClick={toggleChildState} checked={childState} />
					<BeltIcon id={`belt-child-${name}-icon`} belt={child} />
				</> : <div style={{width:"72px"}} />}
			</div>
			<p id={`belt-text-${name}`} className={styles.beltText}>{name}</p>
			<div className={styles.beltItem}>
				<BeltIcon id={`belt-adult-${name}-icon`} belt={adult} />
				<CheckBox id={`belt-adult-${name}`} onClick={toggleAdultState} checked={adultState} />
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
 * Props:
 *    belt	   @type {Object}	A const containing .name for name, a hexcode .color for color and a boolean .child for if it's a child 
 *    id	   @type {String}	An id for the belt picker
 *    states   @type {Object}	A state object, as shown above
 * 	  onToggle @type {Function} A toggle function when a belt is selected (both child and adult)
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
 * @returns A new belt picker component
 */
export default function BeltPicker({ id, states, onToggle, centered, onClearBelts, filterWhiteBelt, errorMessage }) {
	const { token } = useContext(AccountContext)
	const [belts, setBelts] = useState()
	const [rerender, setRerender] = useState(false)
	
	useEffect(() => {
		fetch("/api/belts", {
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
			if (filterWhiteBelt) {
				setBelts(prev => {
					const {Vitt, ...rest} = prev // eslint-disable-line
					return rest
				})
			}
		}).catch(ex => {
			toast.error("Kunde inte hämta bälten")
			console.error(ex)
		})
	}, [token])

	/**
	 * Because the checkbox state is handeled inside <BeltRow /> we need to
	 * manually rerender the <BektRow /> elements when the user clears the
	 * selected belts.
	 */
	const clearBelts = async () => {
		setRerender(true)
		await onClearBelts()
		setRerender(false)
	}

	return (
		<>
			<DropdownComponent text={"Bälten"} id={id} centered={centered} autoClose={false} >
				{!rerender && 
					<>
						<input type="checkbox" style={{display: "none"}}/> {/* Do not touch this checkbox, is needed */}
						{belts && Object.values(belts).map((belt, index) => (
							<BeltRow onToggle={onToggle} states={states} key={index} belt={belt} />
						))}
						{onClearBelts &&
							<div className={styles.beltRow} onClick={clearBelts}>
								<p className={`${styles.beltText} ${styles.centeredText}`}>Rensa valda bälten</p>
							</div>
						}
					</>
				}
			</DropdownComponent>
			
			<p className={styles.err}>{errorMessage}</p>
		</>
	)
}
