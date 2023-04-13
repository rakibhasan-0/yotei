import React from "react";
import "./TagDisplay.css"

function TagList({tags}) {
    return (
        <div className="tags-input">
            <ul id="tags">
                {tags.map((tag, index) => (
                    // Tag color will be added later
                    <li key={index} className="tag" style={{background: tag.color}}>
                        <span className='tag-title'>{tag.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default TagList;
