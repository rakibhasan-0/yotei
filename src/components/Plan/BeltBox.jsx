import "./BeltBox.css"

/**
 * 
 *
 * Props:
 *      prop1       @type { number }      - An ID to identify the component
 *      prop2       @type {number}        - The desired width of the component
 * 		prop3		@type {number}		  - The desired height of the component	
 *      prop4       @type { arr }         - An array of Belts containing belt colorcode and is_child. 
 * 											Two belts may not be the same! In such cases behaviour is undefined.
 *          4.1     @type { id }   		  - The id of the belt
 *          4.2 	@type { colorcode }   - A hexcode representing the belt color "#FFFFFF"
 * 			4.3     @type { boolean }     - A boolean which is true if it is aa child belt.     
 * 
 * 
 * Example usage:
 *      var belts = [{
 * 			"id":  "1",
 *          "color": "#00BE08",
 *          "is_child": false
 *      }, {
 * * 		"id":  "2",
 *          "color": "#0DB7ED",
 *          "is_child": false
 *      }]
 * 
 * 
 * @param {*} param0 
 * @returns 
 */


function BeltBox ( {id, width, height, belts} ) {
	let size = belts.length
	let beltWidth = width/size
	let childMargin = height/4

	return (
		<div id={id} style={{width:width, height:height}} className="beltbox">
			{
				belts?.map(belt => 

					belt.is_child ? 
						(
					// Child belt
							<div key={belt.id + "child-belt"} className="belt" style={{width:width/size, height:height, background:"white"}}>
								<div id={belt.id + "child-belt-color"} style={{width:beltWidth, height:height/2, marginTop:childMargin, marginBot:childMargin, background:belt.color}}/>
							</div>
						)
						:
						(
					// Adult belt
							<div key={belt.id + "adult-belt"} className="belt" style={{width: beltWidth, height:height, background: belt.color}}/>
						)
				)
			}
		</div>
	)
}

export default BeltBox
