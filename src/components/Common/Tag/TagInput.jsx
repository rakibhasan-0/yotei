import React from "react"
import { useState} from "react"
import Tag from "./Tag"
import "./TagInput.css"
import Popup from "../Popup/Popup"
import AddTagPopup from "./AddTagPopup"
/**
 * Taginput is a component to use for choosing tags and displaying chosen tags. 
 * 
 * Props:
 *     id @type {string} - Sets the id of the taginput. 
 * 	   addedTags @type {List of tags} - The list of choosen tags.
 *     setAddedTags @type {useState} - Sets the list of chosen tags. 
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
 * @author Team Minotaur
 * @version 1.0
 * @since 2023-05-04
 */
export default function TagInput({id, addedTags, setAddedTags, isNested}) {
	const [showPopup, setShowPopup] = useState(false)
	const handleRemoveTag = (tag) => {
		const copy = [...addedTags]
		const newAdded = copy.filter(tagInCopy => tagInCopy.id !== tag.id)
		setAddedTags(newAdded)
	}

	return (
		<div id = {id} className="add-tag-container">
			<Tag 
				tagType="suggest"
				key ="addMoreTags"
				text ="Lägg till tagg"
				onClick={() => setShowPopup(true)}
			/>
			<div className="added-tag-container">
				{addedTags.map(tag => <Tag
					tagType="added"
					key={tag.id}
					text={tag.name}
					onClick={() => handleRemoveTag(tag)}
				/>)}
			</div>
			<Popup title="Lägg till tagg" id= "addTagPopUp" isOpen={showPopup} setIsOpen={setShowPopup} isNested={isNested}>
				<AddTagPopup id ="addTagPopupDiv" addedTags={addedTags} setAddedTags={setAddedTags} setIsOpen={setShowPopup}/>
			</Popup>
		</div>
	)
}
