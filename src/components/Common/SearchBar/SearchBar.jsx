import React, { useState } from "react"
import "./SearchBar.css"
import { Search } from "react-bootstrap-icons"
import Tag from "../Tag/Tag"
/**
 * Creates the UI for the searchbar.
 * 
 * Props:
 * 	   id @type {string} - id for the component
 *     placeholder @type {string}  - The placeholdertext in searchbar
 *     text @type {string} - The value in the searchbar
 *     onChange @type {function} - Called when the value is changed
 * 	   addedTags @type {Array} - List of added tags
 *	   setAddedTags @type {function} - Setter for addedTags
 *     suggestedTags @type {Array} - List of suggested tags
 *     setSuggestedTags @type {function} - Setter for suggestedTags
 *
 * Example usage:
 *     <SearchBar 
 * 			id="searchbar-techniques" 
 * 			placeholder="Sök" 
 * 			text={query} 
 * 			onChange={setQuery}
 * 			addedTags={tags}
 * 			setAddedTags={setTags}
 * 			suggestedTags={suggestedTags}
 * 			setSuggestedTags={setSuggestedTags}
 * 		/>
 *
 * @author Team Minotaur Mavericks & Team Kraken (Group 8,Group 7)
 * @since 2023-05-02
 * @version 2.0 
 */

export default function SearchBar({ id, placeholder, text, onChange, addedTags, setAddedTags, suggestedTags, setSuggestedTags }) {

	const [focused, setFocused] = useState(false)

	const handleAddTag = (tag) => {
		// if tag is already added, don't add it
		for (const tagInList of addedTags) {
			if (tag === tagInList) return
		}
		setAddedTags([...addedTags, tag])
		// removes the added tag from suggestions
		const copy = [...suggestedTags]
		const newSuggested = copy.filter(tagInCopy => tagInCopy !== tag)
		setSuggestedTags(newSuggested)
	}

	const handleRemoveTag = (tag) => {
		const copy = [...addedTags]
		const newAdded = copy.filter(tagInCopy => tagInCopy !== tag)
		setAddedTags(newAdded)
		setSuggestedTags([...suggestedTags, tag])
	}

	return (
		<div id={id} className={focused ? "search-bar open" : "search-bar"}>
			<input
				className="search-bar-input-area"
				placeholder={placeholder}
				value={text}
				onChange={e => {
					return onChange?.(e.target.value)
				}}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
			>
			</input>
			<i className="search-icon"><Search /></i>
			<div className={focused || (addedTags.length > 0 || suggestedTags.length > 0) ? "search-bar-tag-container" : "search-bar-tag-container closed"}>
				{addedTags.map((tag, key) => <Tag
					tagType="added"
					key={key}
					text={tag}
					onClick={() => handleRemoveTag(tag)}
				/>)}
				{suggestedTags.map((tag, key) => <Tag
					id={"tag-in-searchbar"}
					tagType="suggest"
					key={key}
					text={tag}
					onClick={() => handleAddTag(tag)}
				/>)}
			</div>
		</div>
	)
}
