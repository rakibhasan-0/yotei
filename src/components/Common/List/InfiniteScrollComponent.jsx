import React, { useState, useEffect, useRef } from "react"
import InfiniteScroll from "react-infinite-scroll-component"

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

export default function InfiniteScrollComponent({ children }) {

	const shownItems = useRef(20)

	const [visibleTechniques, setVisibleTechniques] = useState([])

	function updateShownItems() {
		let startIndex = shownItems.current - 20
		let endIndex = shownItems.current - 1
		let data = children.slice(startIndex, endIndex)
  
		setVisibleTechniques(prevItems => [...prevItems, ...data])
		shownItems.current += 20
	}

	useEffect(() => {
		shownItems.current = 20
		setVisibleTechniques([])
		updateShownItems()
	}, [children])
  

	return (

		<InfiniteScroll
			dataLength={visibleTechniques.length}
			hasMore={true}
			next={(updateShownItems)}
			loader={<p>Loading...</p>}
			endMessage={<p>No more data to load.</p>}
			scrollableTarget={"scrollable-content"}
		>
			<div>
				{visibleTechniques}
			</div>
		</InfiniteScroll>
	)

}

