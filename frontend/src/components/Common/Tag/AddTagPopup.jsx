import React, { useState, useContext, useEffect } from "react"
import styles from "./AddTagPopup.module.css" 
import Tag from "./Tag"
import { Search } from "react-bootstrap-icons"
import Button from "../Button/Button"
import { AccountContext } from "../../../context"
import Divider from "../Divider/Divider"
import { PlusCircle, XCircleFill } from "react-bootstrap-icons"
import { toast } from "react-toastify"
import FilterContainer from "../Filter/FilterContainer/FilterContainer"
import Sorter from "../Sorting/Sorter"
import RoundButton from "../RoundButton/RoundButton"
import { ChevronRight } from "react-bootstrap-icons"
import TagList from "./Taglist.jsx"
import CheckBox from "../CheckBox/CheckBox"

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
 * @author Team Minotaur, Team Mango (Group 4), Team Durian (Group 3) (2024-05-02)
 * @version 2.0
 * @since 2024-04-22
 */
export default function AddTagPopup({id,addedTags,setAddedTags, setIsOpen}) {
	const [suggested, setSuggested] = useState([])
	const [error, setError] = useState("")
	const [searchText,setSearchText] = useState("")
	const { token } = useContext(AccountContext)
	const tagSuggestionAmount = 5

	const handleRemoveTag = (tag) => {
		setError("")
		setSuggested([...suggested, tag])
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

	// Fetches tag suggestions on first render
	useEffect(() => {
		searchForTags("")
	}, [])

	/**
	 * Send request to API for tag suggestion matching the search text.
	 * Includes added tags in request to not get them as suggestions.
	 * 
	 * @param {String} searchText Text in searchbar.
	 */
	const searchForTags = async (searchText) => {
		setError("")
		setSearchText(searchText)

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
		<div className={styles["popup-wrapper"]} id = {id}>
			<div>
				{error !== "" &&
					<p className={styles["error-message"]}>{error}</p>
				}
				<div className={styles["search-bar"]}>
					<input
						className={styles["input-area"]}
						placeholder="Sök eller skapa tagg"
						value={searchText}
						id = "tag-search-bar"
						onChange={e => {searchForTags(e.target.value)}}
					>
						
					</input>
					<i className={styles["search-icon"]}><Search/></i>
					{searchText !== "" &&
					<>
						<button className ={styles["addButton"]} onClick={() => createNewTag(searchText)} >
							<PlusCircle> </PlusCircle>
						</button>
					</>
						
					}
					
				</div>
			</div>
			<div style={{overflow:scroll}}>
				{addedTags.map(tag => <TagList 
					tagType="added"
					key={tag.id}
					text={tag.name}
					/>
					
				)}
					
				
			</div>
			<RoundButton onClick={() => setIsOpen(false)}>
				<ChevronRight width={30} />
			</RoundButton>
		</div>
	)
}