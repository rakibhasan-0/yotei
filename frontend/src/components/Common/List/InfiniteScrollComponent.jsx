import React, { useState, useEffect, useRef } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import Spinner from "../Spinner/Spinner"

/**
 * This component is used to show the first couple of list items and
 * render in more as the user scrolls to the bottom.
 * 
 * @param {any} children The list items to show.
 * @returns {JSX.Element} The rendered InfiniteScrollComponent.
 * @example
 * // Usage
 * <InfiniteScrollComponent>
 *   {items.map((item, index) => (
 *     <div key={index}>{item}</div>
 *   ))}
 * </InfiniteScrollComponent>
 * 
 * @author Kraken (Grupp 7)
 * @version 1.0
 * @since 2023-05-23
 */

export default function InfiniteScrollComponent({ children, activities }) {

	const shownItems = useRef(20)

	const [visibleTechniques, setVisibleTechniques] = useState([])

	const fetchedTech = useRef(localStorage.getItem("storedTech"))

	const [isLoading, setIsLoading] = useState(true)

	function updateShownItems() {
		let startIndex = shownItems.current - 20
		let endIndex = shownItems.current 
		let data = children.slice(startIndex, endIndex)

		setVisibleTechniques(prevItems => [...prevItems, ...data])
		fetchedUpdate()

		shownItems.current += 20
		setIsLoading(false)
	}

	function fetchedShownItems(){
		let startIndex = 0
		let endIndex = +fetchedTech.current
		let data = children.slice(startIndex, endIndex)

		setVisibleTechniques(prevItems => [...prevItems, ...data])
		fetchedUpdate()
		shownItems.current = +fetchedTech.current + 20
		console.log(+fetchedTech.current)
		setIsLoading(false)
	}

	function fetchedUpdate(){
		if(visibleTechniques.length > 0){
			localStorage.setItem("storedTech", visibleTechniques.length)
			fetchedTech.current = +visibleTechniques.length
		}
	}

	useEffect(() => {
		if(+fetchedTech.current > 0 && visibleTechniques.length == 0){
			console.log("hejfje")
			fetchedShownItems()
		}

		else if(visibleTechniques.length == 0){
			console.log("hje")
			shownItems.current = 20
			setVisibleTechniques([])
			updateShownItems()
		}
	}, [activities ? activities : children])

	return (
		isLoading ? 
			< Spinner />
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
				scrollableTarget={"scrollable-content"}
			>
				<div>
					{visibleTechniques}
				</div>
			</InfiniteScroll>
	)

}

