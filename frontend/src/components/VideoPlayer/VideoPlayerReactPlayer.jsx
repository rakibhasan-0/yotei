import React from "react"
import ReactPlayer from "react-player"
import "../Gallery/Gallery.css"

// Render a YouTube video player or local file

export default function VideoPlayerReactPlayer({id, path, editMode}) {
	const style = editMode ? { marginBottom: "0px" } :  { marginBottom: "30px" }
	return (
		<div className="player-wrapper" style={style} id={id}>
			<ReactPlayer
				className={`react-player fixed-bottom`}
				url={path}
				width="100%"
				height="100%"
				controls={true}
			/>
		</div>
	)
}
