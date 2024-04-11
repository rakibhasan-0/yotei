import styles from "./BeltBox.module.css"

/**
 * 	BeltBox is a style component which displays belts as their colors.
 * 	The component is adjusted to render differently in case of errors 
 * 	to not cause complete page/application crashes. All rendering errors
 * 	are logged in console.error.
 * 
 * 	Constraints are to be set by the parent component.
 * 
 * Example usage:
 *      var belts = [{
 * 			"id":  "1",
 *          "color": "00BE08",
 * 			"name": "grön",
 *          "child": false
 *      }, {
 * * 		"id":  "2",
 *          "color": "0DB7ED",
 * 			"name": "blå",
 *          "child": false
 *      }]
 * 
 * @author Griffin DV21JJN C19HLN
 * 
 * @param 	id 				@type { number } 				- An ID to identify the component
 * @param   belts 			@type { arr } 		         	- An array of Belts containing belt colorcode and child. 
 * 										  	  				  Two belts may not be the same! In such cases behaviour is undefined.
 * 							belt.id 		@type { id } 					- The ID of the belt.
 * 							belt.color 		@type { colorcode } 			- A hexcode representing the belt color "#FFFFFF".
 * 							belt.name 		@type { string }				- A string containing the name of the belt.
 * 							belt.child		@type { boolean }  				- A boolean which is true if it is aa child belt.
 * 		
 * @returns A BeltBox component either correctly rendered or with placeholders in case of errors.
 */


function BeltBox ( {id, belts} ) {
	var hexReg = new RegExp("^#(?:[0-9a-fA-F]{3}){1,2}$")
	let sortedBelts = sortBelts()


	function checkID (id) {
		if (id === null || id === undefined) {
			console.error("Invalid ID")
			return false
		}

		return true
	}

	function checkBelts () {
		if (belts === null || belts === undefined) {
			console.error("Invalid Belt input")
			return false
		}

		return true
	}


	function sortBelts () {
		if (checkBelts()) {
			let sorted = belts.slice().sort(( belt1, belt2 ) => {
				return belt1.id - belt2.id
			})

			return sorted
		}
		return null
	}

	function checkBeltChild (belt) {
		if (belt.child == null || belt.child === undefined) {
			console.error("Invalid belt.child value")
			return false
		}

		return true
	}

	function adaptColorCode (color) {
		return "#" + color
	}

	function checkColorCode (color) {
		if (!hexReg.test(adaptColorCode(color))) {
			console.error("Invalid colorcode")
			return false
		}
		
		return true
	}

	function checkBeltName (belt) {
		if (belt.name === null || belt.name === undefined) {
			console.error("Belt name and color is undefined")
			return false
		}

		return true
	}

	function checkDan(belt) {
		if (belt.id > 13) {
			switch (belt.id) {
			case(14):
				return( 
					<div key={`${belt.id}-adult-belt`} className={`${styles.sc23_beltbox_belt} ${styles.sc23_beltbox_belt_dan1}`} style={{background: adaptColorCode(belt.color)}}>
						<div className={styles.sc23_beltbox_belt_dan}/>
					</div>)
			
			case(15):
				return ( 
					<div key={`${belt.id}-adult-belt`} className={`${styles.sc23_beltbox_belt} ${styles.sc23_beltbox_belt_dan2}`} style={{background: adaptColorCode(belt.color)}}>
						<div className={styles.sc23_beltbox_belt_dan}/>
						<div className={styles.sc23_beltbox_belt_dan}/>
					</div>)
			
			case(16):
				return (
					<div key={`${belt.id}-adult-belt`} className={`${styles.sc23_beltbox_belt} ${styles.sc23_beltbox_belt_dan3}`} style={{background: adaptColorCode(belt.color)}}>
						<div className={styles.sc23_beltbox_belt_dan}/>
						<div className={styles.sc23_beltbox_belt_dan}/>
						<div className={styles.sc23_beltbox_belt_dan}/>
					</div>)
			}
		} else {
			return <div key={`${belt.id}-adult-belt`} className={styles.sc23_beltbox_belt} style={{background: adaptColorCode(belt.color)}}/>
		}
	}
	

	return (
		// Check if able to load BeltBox
		checkID(id) && checkBelts() ?
			<div id={id} className={`${styles.sc23_beltbox} ${"d-flex"}`}>
				{
					sortedBelts.map(belt => 

						// Check if color is available
						checkColorCode(belt.color) ?

							checkBeltChild(belt) ? 
								(
									belt.child ?
								
										<div key={`${belt.id}-child-belt`} className={styles.sc23_beltbox_belt} style={{background:"white"}}>
											<div id={`${belt.id}-child-belt-color`} className={styles.sc23_beltbox_belt_child} style={{background: adaptColorCode(belt.color)}}/>
										</div>
										:
										checkDan(belt) 
											
										
								)
								:
								(
									<div key={`${belt.id}-belt-error-child`} id={`${id}-belt-error-child`} className={styles.sc23_beltbox_belt_error} style={{background:adaptColorCode(belt.color)}}>child?</div>
								)
							:
							
							// Color unavailable
							checkBeltName(belt) ?
								<div key={`${id}-belt-error-color`} id={`${id}-belt-error-color`} className={styles.sc23_beltbox_belt_error}>{belt.name}</div>
								:
								<div key={`${id}-belt-error-name`} id={`${id}-belt-error-color`} className={styles.sc23_beltbox_belt_error}>undefined</div>
					)
				}
			</div>
			:
			// Unable to loada BeltBox
			<div id = "error-load-belt-box" className={styles.sc23_beltbox_beltbox}>Error loading component</div>
	)
}

export default BeltBox
