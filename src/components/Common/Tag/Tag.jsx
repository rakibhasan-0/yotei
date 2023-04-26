import React from "react"
import "./Tag.css"
import { PlusCircle, XCircle } from "react-bootstrap-icons"

/**
 * Creates the UI for the Tags
 *  Props:
 *  tagType (see below)
 *  onClick, 
 *  text (the text in the tag).
 * 
 * tagType must be one of three
 * 1. "default": pink tag without icon.
 * 2. "suggest": gray tag with plus icon.
 * 3. "added": pink tag with x icon.
 * 
 * @author: Team Kraken (Group 7)
 * @version: 1.0
 */

export default function Tag({ tagType, onClick, text }) {
	if (!((tagType === "default") || (tagType === "suggest") || (tagType === "added"))) {
		throw new Error("Tag must have type of default, suggest or added")
	}

	if (tagType === "default") {
		return (
			<button className="base-tag" onClick={onClick}>
				<p className="no-margin">{text}</p>
			</button>

		)
	} else if (tagType === "suggest") {
		return (
			<button className="base-tag suggest" onClick={onClick}>
				<p className="no-margin">{text}</p>
				<PlusCircle className="ml-2" size={18} />
			</button>
		)
	} else {
		return (
			<button className="base-tag" onClick={onClick}>
				<p className="no-margin">{text}</p>
				<XCircle className="ml-2" size={18} />
			</button>
		)
	}

}
