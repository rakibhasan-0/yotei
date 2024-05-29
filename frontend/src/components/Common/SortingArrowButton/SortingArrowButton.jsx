import React from "react"
import style from "./SortingArrowButton.module.css"

/**
 * 
 * 
 * That component is responsible for the visualization of the sorting arrow button.
 * The user can rotate the arrow by clicking on the button.
 * 
 * id @type {String/Int} id- The id of the button. 
 * changeOrder @type {Function} changeOrder- The function that changes the order of the list.
 * rotate @type {boolean} rotate- A boolean that determines if the arrow should be rotated or not.
 * 
 * 
 *  example usage:
 *  const [order, setDescendingOrder] = useState(false)
 *  const [rotate, setRotate] = useState(false)
 *  
 *  function changeOrder(){
 *      setDescendingOrder(!order)
 *      setRotate(!rotate)
 *  }
 * 
 *  Note: The component is used in the Statistics component and the position of that button is relative to a container.
 *  And it rotates the button by using ScaleY(-1).
 * 
 *  <SortingArrowButton id="sorting-button" changeOrder={changeOrder} rotate ={rotate}/>
 * 
 * @version 1.0
 * @since 2024-05-16
 * @updated 2024-05-29 Kiwi, Updated props comment
 * @author Team Coconut
 * 
 */


export default function SortingArrowButton({id, changeOrder, rotate}) {
	return (
		<div className={style.sortingButtonContainer}>
			<button onClick={changeOrder} id={id}>
				<img src="/upDownArrow.svg" className={rotate ? style.rotate : ""} />
			</button>
		</div>
	)
}