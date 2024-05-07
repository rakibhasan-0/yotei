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
import MiniPopup from "../MiniPopup/MiniPopup.jsx"


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
	const sortOptions = [
		{label: "Namn: A-Ö", },
		{label: "Namn: Ö-A", },
		{label: "Mest använda",},
		{label: "Minst använda", }
	]

	const [suggested, setSuggested] = useState([])
	const [error, setError] = useState("")
	const [searchText,setSearchText] = useState("")
	const [tagListArray, setTagListArray] = useState([])
	const { token } = useContext(AccountContext)
	const [newAddedTags, setNewAddedTags] = useState(addedTags)
	const [showPopup, setShowPopup] = useState(false)
	const [sort, setSort] = useState(sortOptions[0])

	

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

		const url = new URL("/api/tags/filter")
		url.searchParams.append("sort-by", "use-desc")
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
		try {
			const response = await fetch("/api/tags/add", requestOptions)
			if (response.ok) {
				const data = await response.json()
				const newTag = {id:data.id,name:data.name}
				//Checked by default
				setNewAddedTags([newTag, ...newAddedTags])
				setSuggested([newTag, ...suggested])
			
			} else {
				setError("Något gick fel vid skapandet av tagg")
			}
		} catch (error) {
			setError("Något gick fel vid skapandet av tagg")
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
			<TagList tag={tag} key={tag.id} 
				onChecked={checked => checked ? handleAddTag(tag) : handleRemoveTag(tag)}
				added={newAddedTags.some(a => a.id == tag.id)}	
				onTrashClicked={handleDelete}
				onPencilClicked={true}
			/>
		)
		setTagListArray(tempTagListArray)
	}, [newAddedTags, suggested])

	const handleDelete = () => {
		setShowPopup(true)
	}

	const handleEditText = () => {

	}

	const saveAndClose = () => {
		setAddedTags(newAddedTags)
		setIsOpen(false)
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
				<div style={{height: "10px"}}></div>
			</div>
			
			<div>
				<FilterContainer title={"Sortering"} numFilters={0}>
					<Sorter onSortChange={setSort} id="tag-sort" selected={sort} options={sortOptions}/>
				</FilterContainer>
			</div>
			<div style={{overflow:scroll}}>
				{tagListArray}

				<MiniPopup title={"Taggen kunde ej tas bort"} isOpen={showPopup} setIsOpen={setShowPopup} >
					<div >
						Denna tagg används på x övningar x tekniker och x pass
					</div>
				</MiniPopup>
			</div>
			
			<RoundButton onClick={saveAndClose} > 
				<ChevronRight width={30} />
			</RoundButton>
		</div>
	)
}