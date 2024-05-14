import React, { useState, useContext, useEffect } from "react"
import styles from "./AddTagPopup.module.css" 
import { Search } from "react-bootstrap-icons"
import { AccountContext } from "../../../context"
import { PlusCircle } from "react-bootstrap-icons"
import FilterContainer from "../Filter/FilterContainer/FilterContainer"
import Sorter from "../Sorting/Sorter"
import RoundButton from "../RoundButton/RoundButton"
import { ChevronRight } from "react-bootstrap-icons"
import MiniPopup from "../MiniPopup/MiniPopup.jsx"
import TagUsagePopup from "./TagUsagePopup.jsx"
import Examinee from "./Examinee.jsx"
import ConfirmPopup from "../ConfirmPopup/ConfirmPopup.jsx"


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
 * @author Team Minotaur, Team Mango (Group 4), Team Durian (Group 3) (2024-05-13)
 * @version 2.0
 * @since 2024-04-22
 */
export default function AddTagPopup({id,addedTags,setAddedTags, setIsOpen}) {
	const sortOptions = [
		{label: "Namn: A-Ö", sortBy: "name-asc"},
		{label: "Namn: Ö-A", sortBy: "name-desc"},
		{label: "Mest använda", sortBy: "use-desc"},
		{label: "Minst använda", sortBy: "use-asc"}
	]

	const [suggested, setSuggested] = useState([])
	const [error, setError] = useState("")
	const [searchText,setSearchText] = useState("")
	const [tagListArray, setTagListArray] = useState([])
	const { token } = useContext(AccountContext)
	const [newAddedTags, setNewAddedTags] = useState(addedTags)
	const [showUsagePopup, setUsageShowPopup] = useState(false)
	const [showDeletePopup, setShowDeletePopup] = useState(false)
	const [sort, setSort] = useState(sortOptions[2])
	const [usage, setUsage] = useState([]) 
	const [tagIdToBeDeleted, setTagIdToBeDeleted] = useState([])
	const containsSpecialChars = str => /[^\w\d äöåÅÄÖ-]/.test(str)




	useEffect(() => {
		
		searchForTags(searchText, sort.sortBy)
	}, [searchText, sort])	


	/**
	 * Send request to API for tag suggestion matching the search text.
	 * Includes added tags in request to not get them as suggestions.
	 * 
	 * @param {String} searchText Text in searchbar.
	 */
	const searchForTags = async (searchText, sortBy) => {
		setError("")
		setSearchText(searchText)
		const url = new URL("/api/tags/filter", window.location.origin)
		url.searchParams.append("sort-by", sortBy)
		url.searchParams.append("contains", searchText)
		
		const requestOptions = {
			method: "GET",
			headers: {"Content-type": "application/json",token }
		}
		try {
			const response = await fetch(url, requestOptions)
			if (response.ok) {
				const data = await response.json()
				setSuggested(data)
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
		const returnErrorMessage = validateTagName(tagName)
		//Checked by default
		if (returnErrorMessage != "") {
			setError(returnErrorMessage)
		}
		else {
			try {
				const response = await fetch("/api/tags/add", requestOptions)
				if (response.ok) {
					const data = await response.json()
					const newTag = {id:data.id,name:data.name}
					setNewAddedTags([newTag, ...newAddedTags])
					setSuggested([newTag, ...suggested])
					
				} else {
					setError("Något gick fel vid skapandet av tagg")
				}
			} catch (error) {
				setError("Något gick fel vid skapandet av tagg")
			}
		}

		
	}

	/**
	 * Creates a TagList component for each existing tag on first render and saves each
	 * TagList component in a list. 
	 */
	useEffect(() => {

		//Handle when a tag is removed from something (Not deleted)
		const handleRemoveTag = (tag) => {
			setError("")
			const copy = [...newAddedTags]
			const newAdded = copy.filter(tagInCopy => tagInCopy.id !== tag.id)
			setNewAddedTags(newAdded)
		}

		//Handles when tag is added to something.
		const handleAddTag = (tag) => {
			setError("")
			setNewAddedTags([...newAddedTags, tag])
		}

		const tempTagListArray = suggested.map(tag =>
			<Examinee item={tag.name} 
				key={tag.id}
				id={tag.id} 
				showCheckbox={true}
				onCheck={checked => checked ? handleAddTag(tag) : handleRemoveTag(tag)}
				checked={newAddedTags.some(a => a.id == tag.id)}	
				onEdit={handleEditText}
				validateTagName={validateTagName}
				grayTrash={tag.exercises + tag.workouts + tag.techniques > 0}
				onRemove={() => handleDelete(tag)}
			/>
		)
		setTagListArray(tempTagListArray)
	}, [newAddedTags, suggested])


	/**
	 * Handles when a tag is to be deleted from the database. 
	 * @param {Tag} tag The tag to be deleted. 
	 */
	const handleDelete = (tag) => {
		if (tag.exercises + tag.workouts + tag.techniques > 0) {
			setUsage({"exercises": tag.exercises, "workouts": tag.workouts, "techniques": tag.techniques})
			setUsageShowPopup(true)
		}
		else {
			setTagIdToBeDeleted(tag.id)
			setShowDeletePopup(true)
		}
		
		
	}

	/**
	 * Handles when the user edits the name of a tag
	 * @param {Tag.id} id The tag to be edited
	 * @param {String} text The edited string
	 */
	const handleEditText = async (id, text) => {
		const url = new URL("/api/tags/" + id, window.location.origin)
		const requestOptions = {
			method: "PUT",
			headers: {"Content-type": "application/json",token },
			body: JSON.stringify({
				"id": id,
				"name": text
			})
		}
	
		try {
			const response = await fetch(url, requestOptions)
			if (!response.ok) {
				setError("Något gick fel vid hämtning av tagganvändning")
			}
			

		} catch (error) {
			setError("Något gick fel vid hämtning av tagganvändning")
		}

		
		suggested.find(tag => tag.id == id).name = text
		newAddedTags.find(tag => tag.id == id).name = text
		addedTags.find(tag => tag.id == id).name = text
		
		
	}

	/**
	 * Validets so the name of tag is not containing any illegal characters 
	 * or if the name is empty or if the name of the tag already exists. 
	 * @param {String} name The name of the tag to be validated. 
	 * @returns Nothing if the name is valid, otherwise, the errortext. 
	 */
	const validateTagName = (name) => {
		if (name == "") {
			return "Taggnamnet kan inte vara tomt"
		}
		else if (containsSpecialChars(name)) {
			return "Endast tecken A-Ö, 0-9 och - tillåts"
		}
		else if (suggested.find(tag => tag.name == name)) {
			return "Taggen finns redan"
		}
		return ""
	}

	/**
	 * Saves the newly added tags and closes the popup. 
	 */
	const saveAndClose = () => {
		setAddedTags(newAddedTags)
		setIsOpen(false)
	}

	/**
	 * Hides the usage popup. 
	 * @param {*} show 
	 */
	const hideShowPopup = (show) => {
		if (!show) {
			setUsage("")
		}
		setUsageShowPopup(show)
	}

	/**
	 * Deletes a tag from the database. 
	 */
	const deleteTag = async () => {
		const url = new URL("/api/tags/remove", window.location.origin)
		url.searchParams.append("id", tagIdToBeDeleted)
		
		const requestOptions = {
			method: "DELETE",
			headers: {"Content-type": "application/json",token }
		}
		try {
			const response = await fetch(url, requestOptions)
			if (response.ok) {
				setSuggested(suggested.filter(t => t.id != tagIdToBeDeleted))
				setAddedTags(addedTags.filter(t => t.id != tagIdToBeDeleted))
				setNewAddedTags(newAddedTags.filter(t => t.id != tagIdToBeDeleted))
				setTagListArray(tagListArray.filter(t => t.id != tagIdToBeDeleted))
				setTagIdToBeDeleted(null)
				
			} else {
				setError("Något gick fel vid borttagning av tagg")
			}
		} catch (error) {
			setError("Något gick fel vid borttagning av tagg")
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
						onChange={e => {searchForTags(e.target.value, sort.sortBy)}}
					>
						
					</input>
					<i className={styles["search-icon"]}><Search/></i>
					{searchText !== "" &&
						<button className ={styles["addButton"]} onClick={() => createNewTag(searchText)} id="tag-add-button" >
							<PlusCircle style={{cursor: "pointer"}}> </PlusCircle>
						</button>
					}
					
					
				</div>
				<div style={{height: "10px"}}></div>
			</div>
			
			<div>
				<FilterContainer id={"tag-filter"} title={"Sortering"} numFilters={0}>
					<Sorter id={"tag-sort"} selected={sort} onSortChange={setSort} options={sortOptions}/>
				</FilterContainer>
			</div>
			<div >
				{tagListArray}

				
			</div>
			
			<MiniPopup title={"Taggen kan inte tas bort"} isOpen={showUsagePopup} setIsOpen={hideShowPopup} >
				<TagUsagePopup usage={usage}>  </TagUsagePopup>
			</MiniPopup>

			<ConfirmPopup popupText={"Är du säker på att du vill ta bort taggen?"} showPopup={showDeletePopup} setShowPopup={setShowDeletePopup} onClick={deleteTag}>

			</ConfirmPopup>
			
			<RoundButton onClick={saveAndClose} id={"save-and-close-button"} > 
				<ChevronRight width={30} />
			</RoundButton>
		</div>

		
	)
}