import React from "react"
import { useState } from "react"
import Tag from "./Tag"
import styles from "./TagInput.module.css"
import Popup from "../Popup/Popup"
import AddTagPopup from "./AddTagPopup"


/**
 * Taginput is a component to use for choosing tags and displaying chosen tags. 
 * 
 * Props:
 *     id @type {string} - Sets the id of the taginput. 
 * 	   addedTags @type {List of tags} - The list of choosen tags.
 *     setAddedTags @type {useState} - Sets the list of chosen tags.
 * 	   isNested @type {boolean} - True if nested
 * 	   itemName @type {String} - Name of item
 *
 * Example usage:
 *  
 *	const [addedTags, setAddedTags] = useState([])
 *		return (
 *			<div>
 *				<TagInput id ="tagChooser" addedTags={addedTags} setAddedTags={setAddedTags}/>
 *			</div>
 *		)
 *
 * @author Team Minotaur, Team Durian (Group 3)
 * @version 1.0
 * @since 2024-05-17
 * @updated 2024-05-29 Kiwi, Updated props comment
 */
export default function TagInput({id, addedTags, setAddedTags, isNested, itemName}) {
	const [showPopup, setShowPopup] = useState(false)
	const [newAddedTags, setNewAddedTags] = useState(addedTags)

	const [showConfirmPopup, setShowConfirmPopup] = useState(false)
	

	const handleRemoveTag = (tag) => {
		const copy = [...addedTags]
		const newAdded = copy.filter(tagInCopy => tagInCopy.id !== tag.id)
		setAddedTags(newAdded)
	}

	const handleClose = () => {
		if(addedTags !== newAddedTags) {
			setShowPopup(true)
			setShowConfirmPopup(true)
		}
		else {
			setShowPopup(false)
			setShowConfirmPopup(false)
		}
	}

	

	return (
		<div id = {id} className={styles["add-tag-container"]}>
			<Tag 
				tagType="suggest"
				key ="addMoreTags"
				text ="Hantera tagg"
				onClick={() => setShowPopup(true)}
			/>
			<div className={styles["added-tag-container"]}>
				{addedTags.map(tag => <Tag
					tagType="added"
					key={tag.id}
					text={tag.name}
					onClick={() => handleRemoveTag(tag)}
				/>)}
			</div>
			<Popup title={itemName ? itemName : "Hantera taggar"} dividerOption="h2_left"  id= "addTagPopUp" isOpen={showPopup} setIsOpen={setShowPopup} isNested={isNested} onClose={handleClose}>
				<AddTagPopup id ="addTagPopupDiv" addedTags={addedTags} setAddedTags={setAddedTags} setIsOpen={setShowPopup} newAddedTags={newAddedTags} setNewAddedTags={setNewAddedTags} setShowConfirmPopup={setShowConfirmPopup} showConfirmPopup={showConfirmPopup}/>
			</Popup>
		</div>
	)
}
