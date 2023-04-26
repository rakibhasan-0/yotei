import React from "react"
import SearchIcon from "../../../../public/search.svg"
import "./SearchBar.css"

/**
 * Creates the UI for the searchbar. Props: placeholder (placeholdertext in searchbar),
 * text (optional value (text) for the searchbar),onChange (for when searchtext is entered). 
 *
 * @author Team Minotaur Mavericks & Team Kraken (Group 8,Group 7)
 * @version 1.0
 */
export default function SearchBar({placeholder,text,onChange}) {
	return (
		<>
			<div className='search-bar'>
				<input
					className="input-area"
					placeholder={placeholder}
					value={text}
					onChange={e => onChange?.(e.target.value)}></input>
				<i><img className= "search-icon" src={SearchIcon} alt='Search icon'/></i>
			</div>
		</>
	)
}
