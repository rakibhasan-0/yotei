import React from "react"
import "./Tag.css"
import { PlusCircle, XCircleFill } from "react-bootstrap-icons"

/**
 * Creates the UI for the Tags
 *  Props:
*  	    id @type {string} - id for the component
*	    tagType @type {string} - (see below)
*       onClick @type {function} - called when tag is clicked
*       text @type {string} - the text in the tag
 * 
 * tagType must be one of three:
 * 		1. "default": pink tag without icon.
 * 		2. "suggest": gray tag with plus icon.
 * 		3. "added": pink tag with x icon.
 * 
 * Example usage:
 * 		<Tag
 * 			id="tag-for-exercise"
 * 			tagType="default"
 * 			onClick={onClick}
 * 			text="Spark"
 * 		/>
 * 
 * 
 * @author: Team Kraken (Group 7)
 * @version: 2.0
 */

export default function Tag({ id, tagType, onClick, text }) {
	if (!((tagType === "default") || (tagType === "suggest") || (tagType === "added"))) {
		throw new Error("Tag must have type of default, suggest or added")
	}

	if (tagType === "default") {
		return (
			<button type="button" id={id} className="base-tag" onClick={onClick}>
				<p className="no-margin">{text}</p>
			</button>

		)
	} else if (tagType === "suggest") {
		return (
			<button type="button" id={id} className="base-tag suggest" onClick={onClick}>
				<p className="no-margin">{text}</p>
				<PlusCircle className="ml-2" size={18} color="black"/>
			</button>
		)
	} else {
		return (
			<button type="button" id={id} className="base-tag" onClick={onClick}>
				<p className="no-margin">{text}</p>
				<XCircleFill className="ml-2 flex-shrink-0" size={18} color="black"/>
			</button>
		)
	}

}
