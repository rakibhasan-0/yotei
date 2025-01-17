import React, { useState, useEffect, useRef } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import Spinner from "../Spinner/Spinner"

/**
 * This component is used to show the first couple of list items and
 * render in more as the user scrolls to the bottom.
 * 
 * children @type {Array} The array of items to show.
 * activities @type {activities} Also activities? very unclear
 * activeKey @type {String} String representing the activeTab - "tekniker eller övningar"
 * searchCount @type {searchCount} A counter variable to ensure that no race conditions are caused by running code to many times.
 * @returns {JSX.Element} The rendered InfiniteScrollComponent.
 * @example
 * // Usage
 * <InfiniteScrollComponent>
 *   {items.map((item, index) => (
 *     <div key={index}>{item}</div>
 *   ))}
 * </InfiniteScrollComponent>
 * 
 * @author Kraken (Grupp 7), Kiwi (Group 2 - 2024), Coconut (Group 7- 2024)
 * @version 1.1
 * @since 2024-05-08
 * @updated 2024-05-29 - Added scrollId to make popup inside popup possible
 * @updated 2024-05-29 Kiwi, Added auto-scroll and updated comment
 */

export default function InfiniteScrollComponent({ children, activities, activeKey, searchCount, scrollId }) {

	const shownItems = useRef(20)

	const [visibleTechniques, setVisibleTechniques] = useState([])

	const fetchedTech = useRef(localStorage.getItem("storedTech"))

	const fetchedTechnique = useRef(localStorage.getItem("stored_technique"))
	const fetchedExercise = useRef(localStorage.getItem("stored_exercise"))

	const [isLoading, setIsLoading] = useState(true)

	/**
	 * Loads next chunk of items.
	 */
	function updateShownItems() {
		let startIndex = shownItems.current - 20
		let endIndex = shownItems.current 
		let data = children.slice(startIndex, endIndex)
		setVisibleTechniques(prevItems => [...prevItems, ...data])
		fetchedUpdate()
		shownItems.current += 20
		setIsLoading(false)
	}

	/**
	 * Reads and loads items corresponding to the previously loaded amount
	 */
	function showFetchedItems(){
		let startIndex = 0
		let endIndex = +fetchedTech.current
		let data = children.slice(startIndex, endIndex)

		setVisibleTechniques(prevItems => [...prevItems, ...data])
		fetchedUpdate()
		shownItems.current = +fetchedTech.current + 20
		setIsLoading(false)
	}

	/**
	 * Stored currentlyloaded amount of items into localstorage and sets currently loaded items to the current number.
	 */
	function fetchedUpdate(){
		if(visibleTechniques.length > 0){
			localStorage.setItem("storedTech", shownItems.current)
			fetchedTech.current = +shownItems.current
		}
	}

	/**
	 * If there are stored technique/exercise and an amount of activities needed to load, they are loaded using 
	 * showFetchedItems. Otherwise load items noramlly using updateShownItems.
	 */
	useEffect(() => {
		if(+fetchedTech.current > 0 && +searchCount < 4){
			setVisibleTechniques([])
			showFetchedItems()

			if (activeKey == "technique") {
				const checkElementInterval = setInterval(() => {
					const element = document.getElementById(fetchedTechnique.current)
					if (element != null) {
						clearInterval(checkElementInterval)
						element.scrollIntoView()
					}
				}, 300)
			}

			else if(activeKey == "exercise"){
				const checkElementInterval = setInterval(() => {
					const element = document.getElementById(fetchedExercise.current)
					if (element != null) {
						clearInterval(checkElementInterval)
						element.scrollIntoView()
					}
				}, 300)
			}
		}

		else{
			shownItems.current = 20
			setVisibleTechniques([])
			updateShownItems()
		}
	}, [activities ? activities : children])

	return (
		isLoading ? 
			< Spinner/>
			:
			<InfiniteScroll
				dataLength={visibleTechniques.length}
				hasMore={children.length > visibleTechniques.length}
				next={updateShownItems}
				loader={
					<div style={{padding: 20}}>
						<Spinner/>
					</div>
				}
				scrollableTarget={scrollId}
			>
				<div>
					{visibleTechniques}
				</div>
			</InfiniteScroll>
	)

}

