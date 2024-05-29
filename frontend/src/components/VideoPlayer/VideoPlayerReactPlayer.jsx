import React from "react"
import ReactPlayer from "react-player"
import "../Gallery/Gallery.css"

/**
 * Render a YouTube video player or local file
 *   Props:
 *    id 		@type {String}   An id for the player
 *    path 	@type {String}  URL to media
 * 	  editMode @type {boolean} True if in editMode 
 * 
 * @author Chimera, Kiwi
 * @since 2023-05-02
 * @updated 2024-05-29 Kiwi, Updated Comment props
 * @version 2.0 
 */

export default function VideoPlayerReactPlayer({id, path, editMode}) {
	const style = editMode ? { marginBottom: "0px" } :  { marginBottom: "30px" }
	return (
		<div className="player-wrapper" style={style} id={id}>
			<ReactPlayer
				className={"react-player fixed-bottom"}
				url={path}
				width="100%"
				height="100%"
				controls={true}
			/>
		</div>
	)
}
