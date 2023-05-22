import "./BeltBox.css"

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


	function checkID (id) {
		if (id === null || id === undefined) {
			console.error("Invalid ID")
			return false
		}

		return true
	}

	function checkBelt () {
		if (belts === null || belts === undefined) {
			console.error("Invalid Belt input")
			return false
		}

		return true
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
	
	function isChild(str) {
		if (str == "true"){
			return true
		}
		
		return false
	}

	return (
		// Check if able to load BeltBox
		checkID(id) && checkBelt() ?
			<div id={id} className="sc23-beltbox d-flex">
				{
					belts.map(belt => 

						// Check if color is available
						checkColorCode(belt.color) ?

							checkBeltChild(belt) ? 
								(
									isChild(belt.child) ?
								
										<div key={`${belt.id}-child-belt`} className="sc23-beltbox-belt" style={{background:"white"}}>
											<div id={`${belt.id}-child-belt-color`} className="sc23-beltbox-belt-child" style={{background: adaptColorCode(belt.color)}}/>
										</div>
										:
										<div key={`${belt.id}-adult-belt`} className="sc23-beltbox-belt" style={{background: adaptColorCode(belt.color)}}/>	
								)
								:
								(
									<div key={`${belt.id}-belt-error-child`} id={`${id}-belt-error-child`} className="sc23-beltbox-belt-error" style={{background:adaptColorCode(belt.color)}}>child?</div>
								)
							:
							
							// Color unavailable
							checkBeltName(belt) ?
								<div key={`${id}-belt-error-color`} id={`${id}-belt-error-color`} className="sc23-beltbox-belt-error">{belt.name}</div>
								:
								<div key={`${id}-belt-error-name`} id={`${id}-belt-error-color`} className="sc23-beltbox-belt-error">undefined</div>
					)
				}
			</div>
			:
			// Unable to loada BeltBox
			<div id = "error-load-belt-box" className="sc23-beltbox-beltbox">Error loading component</div>
	)
}

export default BeltBox
