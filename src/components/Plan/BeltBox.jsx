import "./BeltBox.css"

/**
 * 	BeltBox is a style component which displays belts as their colors.
 * 	The component is adjusted to render differently in case of errors 
 * 	to not cause complete page/application crashes. All rendering errors
 * 	are logged in console.error.
 * 
 * Example usage:
 *      var belts = [{
 * 			"id":  "1",
 *          "color": "#00BE08",
 * 			"name": "grön",
 *          "is_child": false
 *      }, {
 * * 		"id":  "2",
 *          "color": "#0DB7ED",
 * 			"name": "blå",
 *          "is_child": false
 *      }]
 * 
 * @author Griffin DV21JJN C19HLN
 * 
 * @param 	id 				@type { number } 				- An ID to identify the component
 * @param	width 			@type { number }   				- The desired width of the component
 * @param	height 			@type { number } 				- The desired height of the component
 * @param   belts 			@type { arr } 		         	- An array of Belts containing belt colorcode and is_child. 
 * 										  	  				  Two belts may not be the same! In such cases behaviour is undefined.
 * 							belt.id 		@type { id } 					- The ID of the belt.
 * 							belt.color 		@type { colorcode } 			- A hexcode representing the belt color "#FFFFFF".
 * 							belt.name 		@type { string }				- A string containing the name of the belt.
 * 							belt.is_child	@type { boolean }  				- A boolean which is true if it is aa child belt.
 * 		
 * @returns A BeltBox component either correctly rendered or with placeholders in case of errors.
 */


function BeltBox ( {id, width, height, belts} ) {
	let beltNumber
	let beltWidth
	let childMargin
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

		beltNumber = belts.length
		beltWidth = width/beltNumber
		childMargin = height/4
		return true
	}

	function checkBeltChild (belt) {
		if (belt.is_child == null || belt.is_child === undefined) {
			console.error("Invalid belt.is_child value")
			return false
		}

		return true
	}

	function checkColorCode (color) {
		if (!hexReg.test(color)) {
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
	

	return (
		// Check if able to load BeltBox
		checkID(id) && checkBelt() ?
			<div id={id} style={{width:width, height:height}} className="beltbox">
				{
					belts.map(belt => 

						// Check if color is available
						checkColorCode(belt.color) ?

							checkBeltChild(belt) ? 
								(
									belt.is_child ?
								
										<div key={belt.id + "child-belt"} className="belt" style={{width:beltWidth, height:height, background:"white"}}>
											<div id={belt.id + "child-belt-color"} style={{width:beltWidth, height:height/2, marginTop:childMargin, marginBot:childMargin, background:belt.color}}/>
										</div>
										:
										<div key={belt.id + "adult-belt"} className="belt" style={{width: beltWidth, height:height, background: belt.color}}/>	
								)
								:
								(
									<div key = {belt.id + "-belt-error-child"} id = {id + "belt-error-child"} className="belt-error" style={{width:beltWidth, height:height, background:belt.color}}>child?</div>
								)
							:
							
							// Color unavailable
							checkBeltName(belt) ?
								<div key = {id + "-belt-error-color"} id = {id + "-belt-error-color"} className="belt-error" style={{width:beltWidth, height: height}}>{belt.name}</div>
								:
								<div key = {id + "-belt-error-name"} id = {id + "-belt-error-color"} className="belt-error" style={{width:beltWidth, height:height}}>undefined</div>
					)
				}
			</div>
			:
			// Unable to loada BeltBox
			<div id = "error-load-belt-box" className="beltbox" style={{width:width, height:height}}>Error loading component</div>
	)
}

export default BeltBox
