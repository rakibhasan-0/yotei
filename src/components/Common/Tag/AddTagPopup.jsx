import React, { useState, useContext } from "react"
import "./AddTagPopup.css"
import Tag from "./Tag"
import { Search } from "react-bootstrap-icons"
import Button from "../Button/Button"
import { AccountContext } from "../../../context"
import Divider from "../Divider/Divider"

/**
 * OBSERVE! This component is used inside the TagInput-component and should not be used by itself. 
 * Popup is a component that can be put inside a popup window, where you can search for tags to add and
 * choose which tags to add, and see which tags are already added and can remove them.
 * 
 * The number of suggested tags is set to 5 in a constant. Can be changed if needed.
 * 
 * Props:
 *     id @type {string} - Sets the id of the addTag-popup. 
 * 	   addedTags @type {List of tags} - The list of choosen tags.
 *     setAddedTags @type {useState} - Sets the list of chosen tags. 
 *
 * Example usage:
 *  
 *	const [addedTags, setAddedTags] = useState([])
 *  const [showPopup, setShowPopup] = useState(false)
 *		return (
 *			<Popup title="Lägg till tagg" id= "addTagPopUp" isOpen={showPopup} setIsOpen={setShowPopup}>
				<AddTagPopup id ="addTagPopupDiv" addedTags={addedTags} setAddedTags={setAddedTags} setIsOpen={setShowPopup}/>
			</Popup>
 *		)
 *
 * @author Team Minotaur
 * @version 1.0
 * @since 2023-05-04
 */
export default function AddTagPopup({id,addedTags,setAddedTags, setIsOpen}) {
	const [suggested, setSuggested] = useState([])
	const [error, setError] = useState("")
	const [searchText,setSearchText] = useState("")
	const { token } = useContext(AccountContext)
	const tagSuggestionAmount = 5

	const handleRemoveTag = (tag) => {
		setError("")
		const copy = [...addedTags]
		const newAdded = copy.filter(tagInCopy => tagInCopy.id !== tag.id)
		setAddedTags(newAdded)
	}

	const handleAddTag = (tag) => {
		setError("")
		setAddedTags([...addedTags, tag])
		
		// removes the added tag from suggestions
		const copy = [...suggested]
		const newSuggested = copy.filter(tagInCopy => tagInCopy.id !== tag.id)
		setSuggested(newSuggested)
	}

	/**
	 * Send request to API for tag suggestion matching the search text.
	 * Includes added tags in request to not get them as suggestions.
	 * 
	 * @param {String} searchText Text in searchbar.
	 */
	const searchForTags = async (searchText) => {
		setError("")

		const tagList = []
		addedTags.forEach ((tag) => {
			tagList.push(tag.name)
		}) 

		const url = "/api/search/tags?name=" + searchText +"&tagAmount="+ tagSuggestionAmount +"&tags="+ tagList
		const requestOptions = {
			method: "GET",
			headers: {"Content-type": "application/json",token }
		}
		try {
			const response = await fetch(url, requestOptions)
			if (response.ok) {
				const data = await response.json()
				setSuggested(data.results)
			} else {
				setError("Något gick fel vid hämtning av taggförslag")
			}
		} catch (error) {
			setError("Något gick fel vid hämtning av taggförslag")
		}

		setSearchText(searchText)
	}

	/**
	 * Sends request to API to add a new tag to the database.
	 * The added tag is also added to addedTags.
	 * 
	 * @param {String} tagName Name of tag to be added.
	 */
	const createNewTag =  async (tagName) => {
		const requestOptions = {
			method: "POST",
			headers: {"Content-type": "application/json",token },
			body: JSON.stringify({name: tagName}),
		}
		try {
			const response = await fetch("/api/tags/add", requestOptions)
			if (response.ok) {
				const data = await response.json()
				setAddedTags([...addedTags, {id:data.id,name:data.name}])
			} else {
				setError("Något gick fel vid skapandet av tagg")
			}
		} catch (error) {
			setError("Något gick fel vid skapandet av tagg")
		}
	}

	return (
		<div className="popup-wrapper" id = {id}>
			<div>
				{error !== "" &&
					<p className="error-message">{error}</p>
				}
				<div className="search-bar">
					<input
						className="input-area"
						placeholder="Sök efter taggar"
						value={searchText}
						onChange={e => {searchForTags(e.target.value)}}
					>
					</input>
					<i className="search-icon"><Search/></i>
				</div>
				<div className="popup-tag-container">
					{suggested.map(tag => <Tag
						tagType="suggest"
						key={tag.id}
						text={tag.name}
						onClick={() => handleAddTag(tag)}
					/>)}
				</div>
				{searchText !== "" &&
					<>
						<h2 className="heading">Skapa ny tagg</h2>
						<div className="popup-tag-container" id="Tagg att skapa">
							<Tag
								tagType="suggest"
								text={searchText}
								onClick={() => createNewTag(searchText)}
							/>
						</div>
					</>
				}
				<Divider className="heading" id="Tillagda taggar" option="h2_left" title="Tillagda taggar"/>
				<div className="popup-tag-container">
					{addedTags.map(tag => <Tag
						tagType="added"
						key={tag.id}
						text={tag.name}
						onClick={() => handleRemoveTag(tag)}
					/>)}
				</div>
			</div>
			<div className="popup-button-container">
				<Button id="popup-close-button" outlined={true} onClick={()=> setIsOpen(false)}><h2>Stäng</h2></Button>
			</div>
		</div>
	)
}