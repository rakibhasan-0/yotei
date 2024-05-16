import React from "react"
import style from "./SearchBar.module.css"
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
 * 	   onBlur @type {function} - Called when the user leaves the input field
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
 * @author Team Minotaur Mavericks & Team Kraken & Team Mango & Team Tomato (Group 8,Group 7, Group 4, Group 6)
 * @since 2024-04-17
 * @version 3.0 
 */

export default function SearchBar({ id, placeholder, text, onChange, addedTags, setAddedTags, suggestedTags, setSuggestedTags, onBlur }) {

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
		//Set the searchbar to be empty when new tag is added.
		onChange?.("")
	}

	const handleRemoveTag = (tag) => {
		const copy = [...addedTags]
		const newAdded = copy.filter(tagInCopy => tagInCopy !== tag)
		setAddedTags(newAdded)
		setSuggestedTags([...suggestedTags, tag])
	}

	return (
		<div id={id} className={style.searchBar}>
			<input
				onBlur={onBlur}
				className={style.searchBarInputArea}
				id = "searchbar-input"
				placeholder={placeholder}
				value={text}
				onChange={e => {
					return onChange?.(e.target.value)
				}}
			>
			</input>
			<i className={style.searchIcon}><Search /></i>
			{suggestedTags &&
				<div className={addedTags.length > 0 || suggestedTags.length > 0 ? style.searchBarTagContainer : `${style.searchBarTagContainer} ${style.closed}`}>
					{addedTags.map((tag, key) => <Tag
						tagType="added"
						key={key}
						text={tag}
						onClick={() => handleRemoveTag(tag)}
					/>)}
					{suggestedTags.map((tag, key) => <Tag
						id={"tag-in-searchbar-" + tag.replace(" ", "-")}
						tagType="suggest"
						key={key}
						text={tag}
						onClick={() => handleAddTag(tag)}
					/>)}
				</div>
			}
		</div>
	)
}
