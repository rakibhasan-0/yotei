import React from "react"
import "./TagsInput.css"

// eslint-disable-next-line no-unused-vars
const TagsInput = props => {
	const [tags, setTags] = React.useState([])
	const addTags = event => {
		if (event.key === "Enter" && event.target.value !== "") {
			setTags([...tags, event.target.value])
			event.target.value = ""
		}
	}
	const removeTags = index => {
		setTags([...tags.filter(tag => tags.indexOf(tag) !== index)])
	}
	return (
		<div className="tags-input">
			<ul id="tags">
				{tags.map((tag, index) => (
					<li key={index} className="tag">
						<span className='tag-title'>{tag}</span>
						<span className='tag-close-icon'
							onClick={() => removeTags(index)}
						>
                  x
						</span>
					</li>
				))}
			</ul>
			<input
				type="text"
				className="input-form-tags"
				onKeyUp={event => event.key === "Enter" ? addTags(event) : null}
				placeholder="Taggar"
			/>
		</div>
	)
}
export default TagsInput